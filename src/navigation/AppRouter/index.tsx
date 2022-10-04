import * as React from 'react'
import {
    View
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native';

import { OverlayProvider } from 'stream-chat-react-native';

import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import Loader from '../../components/Loader';
import RootNav from '../../navigation/rootStack';

import Text from '../../components/UI/AppText'

import ChatContext from '../../chatContext';
import { chatTheme } from '../../theme/chatTheme';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { moderateScale, verticalScale } from '../../utils/scalingUnits';

import { StreamChat } from 'stream-chat';
import axios from 'axios'
import { useSelector } from 'react-redux';

import Config from "react-native-config";
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

import { setupBackgroundPush } from '../../utils/pushNotification'
import { navigate, navigationRef } from '../navigationRef';

const chatClient = new StreamChat(Config.GETSTREAMS_API_KEY);


const appRouter = props => {
    // chat states
    const [channel, setChannel] = React.useState(undefined);
    const [clientSetupLoading, setClientsetupLoading] = React.useState(false)
    const [clientReady, setClientReady] = React.useState(false)

    const userReducer = useSelector(state => state.user)

    const { loggedIn, userData } = userReducer;

    // Register device for push notifications

    React.useEffect(() => {
        setupBackgroundPush();
    }, [])

    React.useEffect(() => {
        if (!loggedIn) {
            return;
        }

        let unsubscribeTokenRefreshListener;
        // Register FCM token with stream chat server.
        const registerPushToken = async () => {
            const token = await messaging().getToken();

            await chatClient.addDevice(token, 'firebase');

            unsubscribeTokenRefreshListener = messaging().onTokenRefresh(async newToken => {
                await chatClient.addDevice(newToken, 'firebase');
            });
        };

        const init = async () => {
            await setupChatClient();
            if (clientReady) {
                await requestPermission();
                await registerPushToken();
            }
        };

        init();
        const {
            unsubscribeOnMessage,
            unsubscribeOnNotificationOpen,
            unsubscribeForegroundEvent
        } = setupNotificationListeners()

        return async () => {
            unsubscribeTokenRefreshListener?.();
            unsubscribeOnMessage()
            unsubscribeOnNotificationOpen()
            unsubscribeForegroundEvent()
        };
    }, [loggedIn]);

    // Request Push Notification permission from device.
    const requestPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    };

    const setupNotificationListeners = () => {

        notifee.onBackgroundEvent(async ({ detail, type }) => {
            if (type === EventType.ACTION_PRESS || type == EventType.PRESS) {
                // user press on notification detected while app was on background on Android
                const channelId = detail.notification?.data?.channel_id;
                if (channelId) {
                    const filter = {
                        id: { $eq: channelId }
                    };

                    const queryRes = await chatClient.queryChannels(filter, {}, {
                        watch: true, // this is the default
                        state: true,
                    });
                    const channelWithState = queryRes[0]

                    setChannel(channelWithState)
                    navigate("ChatScreen")
                }
                await Promise.resolve();
            }
        })

        const unsubscribeForegroundEvent = notifee.onForegroundEvent(async ({ detail, type }) => {
            if (type === EventType.PRESS) {
                // user has pressed notification
                const channelId = detail.notification?.data?.channel_id;
                // The navigation logic, to navigate to relevant channel screen.
                if (channelId) {
                    const filter = {
                        id: { $eq: channelId }
                    };

                    const queryRes = await chatClient.queryChannels(filter, {}, {
                        watch: true, // this is the default
                        state: true,
                    });
                    const channelWithState = queryRes[0]

                    setChannel(channelWithState)
                    navigate("ChatScreen")
                }
            }
        });

        // listeners
        const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('onNotificationOpenedApp ', remoteMessage)
            // Notification caused app to open from background state on iOS
            const channelId = remoteMessage.data?.channel_id;

        });

        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

            const message = await chatClient.getMessage(remoteMessage.data.id);

            // create the android channel to send the notification to
            const channelId = await notifee.createChannel({
                id: 'chat-messages',
                name: 'Chat Messages',
            });

            // display the notification
            await notifee.displayNotification({
                title: 'New message from ' + message.message.user.name,
                body: message.message.text,
                data: remoteMessage.data,
                android: {
                    smallIcon: 'icon_notification',
                    color: '#355D9B',
                    channelId,
                    // add a press action to open the app on press
                    pressAction: {
                        id: 'default',
                    },
                },
            });
        });




        return {
            unsubscribeOnNotificationOpen,
            unsubscribeOnMessage,
            unsubscribeForegroundEvent
        }
    }

    const setupChatClient = async () => {
        let chatBaseUrl = Config.CHAT_SERVER_URL || 'http://localhost:5000';
        let url = `${chatBaseUrl}/stream-chat/user-token`

        if (!userData || !loggedIn) {
            return
        }

        try {

            setClientsetupLoading(true)

            const axiosData = { userId: `${userData?.id}_user` }

            let userToken = await axios.post(url, axiosData, {}).then((res) => res?.data).catch((err) => console.log('error ', err))

            if (userToken && userToken?.token) {
                const user = {
                    id: `${userData?.id}_user`,
                    name: userData?.name,
                    phone: userData?.phone,
                };

                await chatClient.connectUser(user, userToken?.token);

                setClientsetupLoading(false)
                setClientReady(true)
            } else {
                setClientsetupLoading(false)
                if (!loggedIn) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error connecting chat chatClient'
                    })
                }
            }
        }
        catch (error) {
            console.log('error in chat chatClient connect ', error)
            console.log('process.env.GETSTREAMS_API_KEY ', Config.GETSTREAMS_API_KEY)
            setClientsetupLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Error connecting chat chatClient;' + error?.message
            })
        }
    }

    const disconnectClient = async () => {
        // console.log('chatClient disconnected ')
        setClientReady(false)
        chatClient?.disconnectUser()
    }

    const toastConfig = {
        success: ({ text1, text2, props }) => (
            <View
                style={{
                    borderLeftColor: '#42ba96',
                    borderLeftWidth: moderateScale(6),
                    borderRadius: verticalScale(7),
                    marginTop: verticalScale(20),
                    minHeight: verticalScale(60),
                    paddingHorizontal: verticalScale(15),
                    minWidth: '90%',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        borderRadius: verticalScale(7),
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(14),
                        }}
                    >{text1}</Text>
                </View>
            </View>
        ),
        error: ({ text1, text2, props }) => (
            <View
                style={{
                    borderLeftColor: '#FF3333',
                    borderLeftWidth: moderateScale(6),
                    borderRadius: verticalScale(7),
                    marginTop: verticalScale(20),
                    minHeight: verticalScale(60),
                    paddingHorizontal: verticalScale(15),
                    width: '90%',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        borderRadius: verticalScale(7),
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(14),
                        }}
                    >{text1}</Text>
                </View>
            </View>
        ),
    };


    return <NavigationContainer
        ref={navigationRef}
    >
        <ChatContext.Provider
            value={{
                chatClient,
                setupChatClient,
                disconnectClient,
                clientSetupLoading,
                clientReady,
                setChannel,
                channel
            }}
        >
            <OverlayProvider
                value={{ style: chatTheme }}
            >
                <RootNav />
                <Loader />
                <SuccessModal />
                <ErrorModal />
                <Toast
                    config={toastConfig}
                />
            </OverlayProvider>
        </ChatContext.Provider>
    </NavigationContainer>
}

export default appRouter