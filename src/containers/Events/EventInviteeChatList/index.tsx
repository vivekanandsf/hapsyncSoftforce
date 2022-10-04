import * as React from 'react';

import {
    FlatList,
    View,
    ImageBackground,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';

import ChatListItem from '../../../components/Chat/chatListItem'
import GroupChatItem from '../../../components/Chat/GroupListItem'
import TopBar from '../../../components/TopBar'
import Text from '../../../components/UI/AppText'

import ChatContext from '../../../chatContext'

import Toast from 'react-native-toast-message'
import { Chat } from 'stream-chat-react-native';
import { connect } from 'react-redux'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import { getCurrentEventDetails } from '../../../store/actionCreators';

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class EventInviteeChatListChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,
            refreshing: false,
            loading: false,
        }

        this.unmountedRef = React.createRef()
        this.unmountedRef.current = false
    }



    async componentDidMount() {
        const { chatClient, clientReady } = this.props;

        this.initializeChats();

        if (clientReady) {
            this.clientListener = chatClient.on(event => {
                if (!this.unmountedRef.current) {
                    // if component is not unmounted
                    if (
                        event.type == "message.read" ||
                        event.type == "user.watching.start" ||
                        event.type == "user.watching.stop"
                    ) {
                        this.updateChannelPerEvent()
                    }
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentEvent?.invitees !== this.props.currentEvent?.invitees) {
            this.initializeChats();
        }
    }

    componentWillUnmount() {
        this.unmountedRef.current = true
        this.clientListener?.unsubscribe();
    }

    initializeChats = async () => {
        const { chatClient,
            setupChatClient,
            clientReady,
            disconnectClient,
            userData
        } = this.props

        try {
            this.setState({ loading: true });

            let invitees = this.props?.currentEvent?.invitees.filter(i => i.response == "ACCEPTED");
            let owner = this.props?.currentEvent?.owner;

            // users
            let allowedChatIds = []
            if (invitees) {
                // remove current logged in user
                invitees = invitees.filter((invitee) => invitee?.userId !== userData?.id)
                allowedChatIds = invitees?.map((invitee) => `${invitee?.userId}_user`)
            }

            // Add owner to list
            if (owner !== userData?.id) {
                allowedChatIds.push(`${owner}_user`)
            }

            let userFilter = { id: {} }
            if (allowedChatIds?.length > 0) {
                userFilter = { id: { $in: allowedChatIds } }
            }

            let users = {};
            if (allowedChatIds?.length > 0) {
                users = await chatClient.queryUsers(userFilter);
            }
            //console.log(users)

            this.setState({
                users: users?.users, loading: false
            })
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error while loading chats'
            })
            console.log('chat load err ', error)
            this.setState({ loading: false })

            // for every chat error , logout user and relogin
            await disconnectClient()
            await setupChatClient()
        }
    }

    updateChannelPerEvent = async () => {
        const { chatClient,
            userData
        } = this.props

        // users
        let allowedChatIds = [];
        let invitees = this.props?.currentEvent?.invitees.filter(i => i.response == "ACCEPTED");
        let owner = this.props?.currentEvent?.owner;

        if (invitees) {
            // remove current logged in user
            invitees = invitees.filter((invitee) => invitee?.userId !== userData?.id)
            allowedChatIds = invitees?.map((invitee) => `${invitee?.userId}_user`)
        }

        // Add owner to list
        if (owner !== userData?.id) {
            allowedChatIds.push(`${owner}_user`)
        }

        let userFilter = { id: {} }
        if (allowedChatIds?.length > 0) {
            userFilter = { id: { $in: allowedChatIds } }
        }

        let users = {};
        if (allowedChatIds?.length > 0) {
            users = await chatClient.queryUsers(userFilter);
        }

        this.setState({ users: users?.users })
    }

    refreshScreen = () => {
        this.setState({ refreshing: true }, () => {
            setTimeout(() => {
                this.setState({ refreshing: false })
            }, 600)
        })
        this.initializeChats();
    }

    formatUserList = (_users) => {
        let owner = this.props?.currentEvent?.owner;

        const {
            userData
        } = this.props

        let users = _users || [];
        users = _users?.map((user) => {
            if (user?.id == `${owner}_user`) {
                return {
                    ...user,
                    label: 'OWNER'
                }
            }
            else {
                return user
            }
        })

        return users
    }

    renderGroupChatHeading = () => {
        const eventData = this.props?.currentEvent;
        const { clientSetupLoading } = this.props;
        const { loading } = this.state

        return <View>
            <GroupChatItem
                eventData={eventData}
            />
            {/* <View
                style={{
                    height: verticalScale(40),
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: moderateScale(16),
                        color: '#355D9B'
                    }}
                >Attendees</Text>
            </View>
            {(clientSetupLoading || loading) && <ActivityIndicator
                size="small"
            />} */}
        </View>
    }

    renderInviteeList = () => {
        const {
            refreshing
        } = this.state;

        const { chatClient,
            setupChatClient,
            clientReady,
            disconnectClient,
            setChannel
        } = this.props
        const eventData = this.props?.currentEvent;

        let users = this.state.users || [];
        users = this.formatUserList(users)

        const channelPrefix = 'event' + eventData?.id

        return <FlatList
            data={users}
            ListHeaderComponent={this.renderGroupChatHeading}
            renderItem={({ item }) => {}/* <ChatListItem
                channelPrefix={channelPrefix}
                data={item}
            /> */}
            keyExtractor={(item, index) => {
                return item?.id
            }}
            contentContainerStyle={{
                paddingHorizontal: moderateScale(20),
                flexGrow: 1
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.refreshScreen}
                />
            }
        />

    }

    render() {
        const { clientSetupLoading, currentEvent } = this.props
        if(!currentEvent){
            return <></>
        }
        return <ImageBackground
            source={require("../../../assets/images/bg-chat-tile-light.png")}
            resizeMode="cover"
            imageStyle={{
                width: deviceWidth,
                height: deviceHeight
            }}
            style={{
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Guests chat"
            />
            {clientSetupLoading && <ActivityIndicator
                size="small"
            />}
            <View style={{height:20}}></View>
            {this.renderInviteeList()}
        </ImageBackground>
    }
}

const EventInviteeChatList = props => {

    const {
        chatClient,
        clientReady,
        disconnectClient,
        setupChatClient,
        clientSetupLoading,
        setChannel,
    } = React.useContext(ChatContext);

    /* React.useEffect(() => {
        (async()=>{
            setLoading(true)
            await getCurrentEventDetails(props.route?.params.data.id, true).then(()=>{
                setLoading(false)
            })
        })()
        
    }, [])
    const [loading, setLoading] = React.useState(false) */
    

    return <>
    <EventInviteeChatListChild
        chatClient={chatClient}
        clientReady={clientReady}
        setupChatClient={setupChatClient}
        disconnectClient={disconnectClient}
        clientSetupLoading={clientSetupLoading}
        setChannel={setChannel}
        {...props}
    />
    </>
}

const mapStateToProps = state => {
    const { userData } = state.user
    const { currentEvent } = state.events
    return {
        userData,
        currentEvent
    }
}

export default connect(mapStateToProps)(EventInviteeChatList);