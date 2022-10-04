import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import {
    View,
    Pressable,
    Image,
    StyleSheet,
    Platform
} from 'react-native'

import { useSelector } from 'react-redux';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import Text from '../../UI/AppText'

import moment from 'moment'

import ChatContext from '../../../chatContext';

const TaskGroupAssigneesItem = props => {
    const {
        taskData,
    } = props;

    const {
        chatClient,
        setupChatClient,
        clientReady,
        disconnectClient,
        setChannel
    } = React.useContext(ChatContext)

    const navigation = useNavigation();
    const userReducer = useSelector(state => state.user);

    const channel_id = React.useRef(undefined)
    const [channelInEntry, setChannelInEntry] = React.useState(undefined);
    const channelMessages = channelInEntry?.state?.messages || [];


    const [isTyping, setIsTyping] = React.useState(false);
    const [typingUser, setTypingUser] = React.useState("");

    const [unmounted, setUnmounted] = React.useState(false)

    let assignees = taskData.assignees;

    const groupName = `task-groupchat-${taskData?.id}`;

    let guestIds = []
    if (assignees) {
        guestIds = assignees?.map((assignee) => `${assignee?.userId}_user`);
        // add owner to group
    }
    let channelListener = undefined;

    React.useEffect(() => {
        setUnmounted(false);
        const startup = async () => {
            try {
                if (!clientReady) {
                    await setupChatClient()
                }

                const channel = chatClient.channel("messaging", groupName,
                    {
                        members: [
                            ...guestIds
                        ], name: groupName
                    });
                await channel.create();

                // use CID to get channel data with full state
                const filter = {
                    type: 'messaging',
                    members: { $in: [...guestIds] },
                    id: { $eq: groupName }
                };

                let members = await channel.queryMembers({})
                members = members.members.map(i => i.user_id)

                if (members.length < guestIds.length) {
                    let difference = guestIds?.filter(x => !members.includes(x))
                    if (difference.length > 0) {
                        await channel.addMembers(difference);
                    }
                }

                let queryRes;
                if (guestIds?.length > 0) {
                    queryRes = await chatClient.queryChannels(filter, {}, {
                        watch: true, // this is the default
                        state: true,
                    });


                    const channelWithState = queryRes[0]
                    //console.log(channelWithState)

                    setChannelInEntry(channelWithState);

                    channelListener = channel.on(channelEventHandler)

                }
            } catch (e) {
                console.log(e)
            }
        };
        startup();

        return () => {
            channelListener?.unsubscribe();
            setUnmounted(true)
        }
    }, []);


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
            type: 'messaging', members: { $in: [...guestIds] },
            id: { $eq: groupName }
        };

        if (guestIds?.length > 0) {
            const queryRes = await chatClient.queryChannels(filter, {}, {
                watch: true, // this is the default
                state: true,
            });


            const channelWithState = queryRes[0]

            if (channelWithState) {
                setChannelInEntry(channelWithState);
            }

        }
    }

    const handleChatStart = () => {
        if (!channelInEntry) {
            return;
        }

        setChannel(channelInEntry);

        navigation.navigate("ChatScreen", {
            name: "Task Group Chat"
        })
    }

    const dateIsToday = (date) => {
        return moment.unix(date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")
    }

    const getUnreadNumber = (_channel) => {
        if (!_channel) {
            return -1
        }
        const unread = _channel.countUnread();
        return unread
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

    const renderImage = () => {
        return <View style={{
            backgroundColor: '#dfe5e7',
            alignItems: "center", justifyContent: 'center',
            width: 60, height: 60, borderRadius: moderateScale(100),
        }}>
            <Image
                style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                }}
                source={require("../../../assets/images/group.png")}
            />
            <View style={{ position: 'absolute', top: -4, right: -4 }}>
                {renderUnreadNo()}
            </View>
        </View>
    }

    const renderLastMessage = () => {
        let message = channelMessages?.length > 0 && channelMessages[channelMessages.length - 1]?.text;
        if (message?.length > 40) {
            message = message?.substring(0, 40) + '...'
        }

        if (isTyping) {
            return <Text style={{
                color: '#818E9B',
                fontSize: verticalScale(13),
                marginTop: verticalScale(5),
                fontStyle: 'italic'
            }}>
                {typingUser} is typing...
            </Text>
        }

        return <Text style={{
            color: '#818E9B',
            fontSize: verticalScale(13),
            marginTop: verticalScale(5),
        }}>
            {message}
        </Text>
    }


    const getLastMessageTime = () => {
        const lastMessage = channelMessages?.length > 0 ? channelMessages[channelMessages.length - 1] : undefined;

        if (lastMessage) {
            let lastMessageTime = lastMessage?.created_at && dateIsToday(lastMessage?.created_at) ?
                moment(lastMessage?.created_at).format("HH:mm") :
                moment(lastMessage?.created_at).format("HH:mm")

            return lastMessageTime
        }
    }

    const renderLabel = () => {
        const label = 'Assigness'

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
            //height: moderateScale(65),
            alignItems: 'center',
            //borderBottomWidth: 0.5,
            backgroundColor: 'white',
            borderColor: '#355D9B',
            padding: 15,
            borderRadius: 6,
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1
                },
                android: {
                    elevation: 1
                }
            }),
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
                    style={[{
                        color: '#355D9B',
                        fontSize: verticalScale(13),
                        fontWeight: '500'
                    }]}
                >
                    Task Group Chat {/* #{eventData?.id} */}
                </Text>
                {renderLastMessage()}
            </View>
            {/* <View style={{
                marginLeft: 'auto',
                marginRight: moderateScale(20),
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                flexDirection: 'row'
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
            </View> */}
        </View>
        <Text style={{
            color: '#818E9B',
            fontWeight: getUnreadNumber() > 0 ? '500' : '400',
            fontSize: verticalScale(10),
            alignSelf: 'flex-start'
        }}>
            {getLastMessageTime()
            }
        </Text>
        {//renderLabel()
        }
    </Pressable>
}


export default TaskGroupAssigneesItem