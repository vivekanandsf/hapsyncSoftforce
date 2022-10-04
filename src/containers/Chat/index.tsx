import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    TextInput,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'

import Text from '../../components/UI/AppText'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import CustomInput from '../../components/Chat/CustomInput'

import * as SvgIcons from '../../assets/svg-icons'

import Feather from 'react-native-vector-icons/Feather'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chat, Channel, KeyboardCompatibleView, MessageList, MessageInput, useChatContext, ChannelList, Message } from 'stream-chat-react-native';

import ChatContext from '../../chatContext'

class ChatScreenChild extends React.Component {
    state = {

    }

    renderHeaderRightComp = () => {
        return <Pressable
            style={{
                marginRight: -moderateScale(4)
            }}
        >
            <Feather
                name="plus"
                style={{
                    color: '#355D9B',
                    fontSize: verticalScale(28)
                }}
            />
        </Pressable>
    }

    renderInput = () => {
        return <View style={{
            height: verticalScale(50),
            borderRadius: verticalScale(44),
            borderWidth: verticalScale(1.5),
            borderColor: '#355D9B',
            marginBottom: verticalScale(20),
            paddingHorizontal: verticalScale(12),
            alignItems: 'center',
            flexDirection: 'row'
        }}>
            <TextInput
                placeholder="Type a message..."
                style={{
                    fontFamily: 'Mulish-Regular',
                    fontSize: verticalScale(15),
                    flex: 1
                }}
            />
            <View style={{
                transform: [{ scale: moderateScale(1) }]
            }}>
                <SvgIcons.SendIcon
                fill="grey"
                />
            </View>
        </View>
    }

    renderMain = () => {
        const { chatClient,
            clientReady
        } = this.props

        const channel = this.props.channel

        if(!channel || !clientReady){
            return <View style={{ flex: 1 }}>
                <View
                style={{flex: 1}}
                >
                    <ActivityIndicator/>
                </View>
                {this.renderInput()}
            </View>
        }

        return <Chat client={chatClient} >
            <Channel channel={channel}
                //KeyboardCompatibleView={CustomKeyboardCompatibleView}
                messageActions={({ deleteMessage, editMessage, copyMessage, quotedReply, messageReactions, isMyMessage })=>
                    isMyMessage
                    ? [
                        quotedReply,
                        editMessage,
                        copyMessage,
                        deleteMessage,
                        messageReactions
                    ]
                    : [
                        quotedReply,
                        copyMessage,
                        messageReactions
                    ]
                }
            >
                <View style={{ flex: 1 }}>
                    <MessageList
                    />
                    <MessageInput
                        Input={CustomInput}
                    />
                </View>
            </Channel>
        </Chat>
    }

    render() {

        let name="chat"

        if(this.props?.route?.params?.name){
            name=this.props?.route?.params?.name
        }

        //console.log(name)

        return <SafeAreaView
            style={{
                flex: 1
            }}
        >
            <ImageBackground
                source={require("../../assets/images/bg-chat-tile-light.png")}
                resizeMode="cover"
                imageStyle={{
                    width: "100%",
                    height: "100%"
                }}
                style={{
                    flex: 1,
                }}
            >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title={name}//"Let's Chat"
                    //rightComponent={this.renderHeaderRightComp()}
                />
                <View style={{
                    marginHorizontal: moderateScale(11),
                    flex: 1
                }}>
                    {this.renderMain()}
                </View>
            </ImageBackground >
        </SafeAreaView>
    }
}

const CustomKeyboardCompatibleView = ({ children }) => {
    const insets = useSafeAreaInsets();

    if (Platform.OS === 'android') {
        return children;
    }

    const iosVerticalOffset = insets.bottom > 0 ? verticalScale(135) : 0;

    return (
        <KeyboardCompatibleView
            keyboardVerticalOffset={iosVerticalOffset}>
            {children}
        </KeyboardCompatibleView>
    );
};

const ChatScreen = props => {
    const { chatClient, channel, clientReady } = React.useContext(ChatContext);

    return <ChatScreenChild
        chatClient={chatClient}
        channel={channel}
        clientReady={clientReady}
        {...props} />
}



const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(22),
        marginVertical: verticalScale(20),
        marginHorizontal: moderateScale(11),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    }
})


export default ChatScreen