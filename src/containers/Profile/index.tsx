import { View, Text, ImageBackground, ScrollView, Image, Pressable } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import { useDispatch, useSelector } from 'react-redux'
import { logoutSuccess } from '../../store/userSlice'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import ChatContext from '../../chatContext'
import LinearGradient from 'react-native-linear-gradient'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { clearAllEvents } from '../../store/eventsSlice'
import { clearAllDrafts } from '../../store/draftsSlice'
export default function Profile(props) {

    const data = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const {
        chatClient,
        clientReady,
        disconnectClient,
        setupChatClient,
        clientSetupLoading,
        setChannel,
    } = React.useContext(ChatContext);

    const list = [
        {
            label: 'Account',
            imgIcon: <MaterialCommunityIcons name="account" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("Account")
            }
        },
        {
            label: 'Notifications',
            imgIcon: <Ionicons name="notifications" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("NotificationSetting")
            }
        },
        {
            label: 'Send Feedback',
            imgIcon: <MaterialIcons name="feedback" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("SendFeedback")
            }
        },
        {
            label: 'Change Password',
            imgIcon: <MaterialCommunityIcons name="lock-question" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("ChangePassword")
            }
        },
        {
            label: 'Logout',
            imgIcon: <Entypo name="log-out" size={28} color="#00ADEF" />,
            onPress: async () => {
                dispatch(clearAllEvents())
                dispatch(clearAllDrafts())
                dispatch(logoutSuccess(null))
                await disconnectClient()
            }
        },
    ]

    const renderPersonalDetails = () => {
        return <>
            <View style={{
                backgroundColor: '#fff',
                minHeight: verticalScale(250),
                borderRadius: verticalScale(15),
                padding: moderateScale(25),
                justifyContent: 'space-around'
            }}>
                <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    <Image
                        source={
                            data.userData.imageUrl
                                ? { uri: data.userData.imageUrl }
                                : require("../../assets/images/splashscreen.png")
                        }
                        style={{
                            height: verticalScale(126),
                            width: verticalScale(126),
                            borderRadius: verticalScale(80),
                            marginBottom: verticalScale(10),
                            borderWidth:0.5
                        }}
                    />
                    <Text style={{
                        color: '#355D9B',
                        fontWeight: 'bold',
                        fontSize: verticalScale(16)
                    }}>{data.userData.name}</Text>

                    {data.userData.role == "ORGANIZATION" &&
                        <Text style={{
                            fontSize: verticalScale(13), color: "rgba(53, 93, 155, 0.4)"
                        }}>{"#" + data.userData.orgId}</Text>}

                    {data.userData.role != "USER" && <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={['#00ADEF', '#355D9B']}
                        style={{
                            height: verticalScale(35),
                            minWidth: moderateScale(140),
                            marginTop: verticalScale(15),
                            borderRadius: verticalScale(5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        <SimpleLineIcons name="globe" size={25} color="#fff" />
                        <Text style={{
                            color: '#fff',
                            marginLeft: moderateScale(6),
                            fontFamily: "Mulish"
                        }}>
                            {String(data.userData.website).toLowerCase()}
                        </Text>
                    </LinearGradient>
                    }

                </View>
                <View style={{ margin: 10 }}>
                    {
                        list.map((l, i) => (
                            <View key={i}>
                                <Pressable
                                    onPress={l.onPress}
                                    style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                    <View>
                                        {l.imgIcon}
                                    </View>
                                    <View style={{ marginLeft: 15 }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Mulish',
                                                color: "#355D9B",
                                                fontSize: 17
                                            }}
                                        >{l.label}</Text>
                                    </View>
                                </Pressable>
                                <View
                                    style={{
                                        borderBottomColor: "#00ADEF", opacity: 0.5, borderBottomWidth: 1, marginVertical: 4
                                    }}
                                ></View>
                            </View>
                        ))
                    }
                </View>
            </View>
        </>
    }
    return (
        <ImageBackground
            source={require("../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Profile"
                rightComponent={<><Text>v0.1.34</Text></>}
            />
            <ScrollView contentContainerStyle={{
                flexGrow: 1,

            }}>
                <View style={{
                    flex: 1,
                    marginHorizontal: moderateScale(20),
                    paddingBottom: verticalScale(40)
                }}>
                    {renderPersonalDetails()}
                </View>
            </ScrollView>
        </ImageBackground>
    )
}