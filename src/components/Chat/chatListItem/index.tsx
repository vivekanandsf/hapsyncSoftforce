import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import {
    View,
    Pressable,
    Image,
    StyleSheet
} from 'react-native'

import { useSelector } from 'react-redux';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import Text from '../../UI/AppText'

import ChatContext from '../../../chatContext';

import moment from 'moment'

type Props = {
    channelPrefix: String,
    data: Object
}

const userListItem = (props: Props) => {
    const {
        data,
        channelPrefix
    } = props;


    const {
        chatClient,
        setupChatClient,
        clientReady,
        disconnectClient,
        setChannel
    } = React.useContext(ChatContext)

    const user = data;

    const navigation = useNavigation();

    const userReducer = useSelector(state => state.user);

    const [channelInEntry, setChannelInEntry] = React.useState(undefined);
    const channel_id = React.useRef(undefined)

    const [isTyping, setIsTyping] = React.useState(false);
    const [typingUser, setTypingUser] = React.useState("");
    const [unmounted, setUnmounted] = React.useState(false)

    React.useEffect(() => {
        (async () => {
            setUnmounted(false);
            if (!clientReady) {
                await setupChatClient()
            }


            const membersArray = [
                `${userReducer?.userData.id}_user`,
                data?.id
            ]
            // maintain sort order in all devices
            membersArray.sort(function (a, b) {
                const aId = a?.slice(0, 2)
                const bId = b?.slice(0, 2)
                return parseInt(aId) - parseInt(bId)
            })

            let channelId = [...membersArray].join('__')
            if (channelPrefix) {
                channelId = `${channelPrefix}_${channelId}`
            }

            const channel = chatClient.channel("messaging", channelId, { members: [`${userReducer?.userData.id}_user`, data?.id] })
            await channel.create();

            channel_id.current = channelId; // store value in Ref

            const filter = {
                type: 'messaging',
                members: { $in: [`${userReducer?.userData.id}_user`, data?.id] },
                id: { $eq: channelId }
            };
            const queryRes = await chatClient.queryChannels(filter, {
            }, {
                watch: true, // this is the default
                state: true,
            });
            const channelWithState = queryRes[0]

            setChannelInEntry(channelWithState);

            var channelListener = channel.on(channelEventHandler)
            // console.log("chat List")
            // console.log(user)
        })();
        return () => {
            channelListener?.unsubscribe();
            setUnmounted(true)
        }
    }, [])

    const channelEventHandler = event => {
        if (unmounted) {
            return
        }
        if (event.type == 'typing.start' && !isTyping) {
            setIsTyping(true)
            setTypingUser(event?.user?.name)
        }
        if (event.type == 'typing.stop') {
            setIsTyping(false)
            setTypingUser('')
            getUpdatedState()
        }
    }

    const getUpdatedState = async () => {
        const filter = {
            type: 'messaging',
            members: { $in: [`${userReducer?.userData.id}_user`, data?.id] },
            id: { $eq: channel_id.current }
        };

        const queryRes = await chatClient.queryChannels(filter, {}, {
            watch: true, // this is the default
            state: true,
        });
        const channelWithState = queryRes[0]

        if (channelWithState) {
            setChannelInEntry(channelWithState);
        }
    }

    const handleChatStart = () => {
        if (!userReducer || !data?.id) {
            return
        }

        if (!channelInEntry) {
            return
        }

        setChannel(channelInEntry);

        navigation.navigate("ChatScreen", {
            user,
            name:user?.name
        })
    }

    const getUnreadNumber = (_channel) => {
        if (!_channel) {
            return -1
        }
        const unread = _channel.countUnread();
        return unread
    }

    const dateIsToday = (date) => {
        return moment.unix(date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")
    }

    const renderImage = () => {
        return <View>
            <Image
                style={{
                    width: moderateScale(54),
                    height: moderateScale(54),
                    borderRadius: moderateScale(27)
                }}

                source={
                    user?.image_url ?
                        {
                            uri: user?.image_url
                        }
                        : require("../../../assets/images/event.png")
                }
            />
            <View
                style={{
                    backgroundColor: user?.online ? 'green' : 'rgba(123, 125, 126, 1)',
                    height: verticalScale(8),
                    width: verticalScale(8),
                    borderRadius: verticalScale(5),
                    borderWidth: verticalScale(1),
                    borderColor: '#fff',
                    marginTop: -verticalScale(6),
                    marginLeft: 'auto',
                    marginRight: verticalScale(10)
                }}
            />
        </View>
    }

    const renderLastMessage = () => {
        const channelMessages = channelInEntry?.state?.messages || [];
        let message = channelMessages?.length > 0 && channelMessages[channelMessages.length - 1]?.text;
        if (message?.length > 40) {
            message = message?.substring(0, 40) + '...'
        }

        if (isTyping) {
            return <Text style={{
                color: '#818E9B',
                fontSize: verticalScale(12),
                marginTop: verticalScale(5),
                fontStyle: 'italic'
            }}>
                {typingUser} is typing...
            </Text>
        }

        return <Text style={{
            color: '#818E9B',
            fontSize: verticalScale(12),
            marginTop: verticalScale(5),
        }}>
            {message}
        </Text>
    }

    const renderUnreadNo = () => {
        const unread = getUnreadNumber(channelInEntry);

        return unread > 0 ? <View style={{
            height: verticalScale(16),
            width: verticalScale(16),
            backgroundColor: 'rgba(0, 173, 239, 1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: verticalScale(7),
            borderRadius: verticalScale(10),
            marginLeft: 7
        }}>
            <Text
                style={{
                    color: '#fff',
                    fontSize: verticalScale(11)
                }}
            >
                {unread}
            </Text>
        </View>
            : undefined

    }


    const getLastMessageTime = () => {
        const channelMessages = channelInEntry?.state?.messages || [];
        const lastMessage = channelMessages?.length > 0 ? channelMessages[channelMessages.length - 1] : undefined;

        if (lastMessage) {
            let lastMessageTime = lastMessage?.created_at && dateIsToday(lastMessage?.created_at) ?
                moment(lastMessage?.created_at).format("hh:mm A") :
                moment(lastMessage?.created_at).format("hh:mm A[,] MMM DD")

            return lastMessageTime
        }

        return user?.last_active && dateIsToday(user?.last_active) ?
            moment(user?.last_active).format("hh:mm A") :
            moment(user?.last_active).format("hh:mm A[,] MMM DD")

    }

    const renderLabel = () => {
        const label = user?.label

        if (!label) {
            return
        }

        return <View style={{
            backgroundColor: '#355D9B',
            borderRadius: verticalScale(20),
            height: verticalScale(16),
            paddingHorizontal: moderateScale(9),
            position: 'absolute',
            right: moderateScale(5),
            top: verticalScale(5),
            justifyContent: 'center',
        }}>
            <Text style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: verticalScale(8)
            }}>{label?.toUpperCase()}</Text>
        </View>
    }


    return <Pressable
        onPress={handleChatStart}
        style={{
            flexDirection: 'row',
            height: moderateScale(65),
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderColor: '#355D9B'
        }}>

        {renderImage()}
        <View
            style={{
                flex: 1,
                paddingLeft: moderateScale(10),
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <View>
                <Text
                    style={{
                        color: '#355D9B',
                        fontSize: verticalScale(13),
                        fontWeight: '500'
                    }}
                >
                    {user?.name}
                </Text>
                {renderLastMessage()}
            </View>
            <View style={{
                marginLeft: 'auto',
                marginRight: moderateScale(20),
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'space-around',
            }}>
                <Text style={{
                    color: '#818E9B',
                    fontWeight: getUnreadNumber() > 0 ? '500' : '400',
                    fontSize: verticalScale(10)
                }}>
                    {getLastMessageTime()
                    }
                </Text>
                {renderUnreadNo()}
            </View>
        </View>
        {renderLabel()}
    </Pressable>
}


export default userListItem