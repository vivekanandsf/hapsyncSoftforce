import * as React from 'react'
import { View, Pressable, Text, StyleSheet, ViewStyle, Image, Platform } from 'react-native'

import { useNavigation } from '@react-navigation/core';
import { moderateScale } from '../../../utils/scalingUnits';
import { inviteeEventConfirmation } from '../../../store/actionCreators';


type Styles = {
    container: ViewStyle
}
const InvitationItem = (props) => {
    const navigation = useNavigation()
    const { data, userId } = props

    return <View
        style={styles.container}
    >
        <Pressable
            onPress={() =>
                navigation.navigate("InviteeEventDetails", {
                    data
                })
            }
            style={{ paddingBottom: moderateScale(10) }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    minHeight: moderateScale(60),
                    alignItems: 'center',
                    borderColor: '#355D9B'
                }}>

                <Image
                    style={{
                        width: moderateScale(52),
                        height: moderateScale(52),
                        borderRadius: moderateScale(27),
                        margin: moderateScale(5)
                    }}

                    source={require("../../../assets/images/event.png")}
                />
                <View
                    style={{
                        flex: 1,
                        paddingLeft: moderateScale(10),
                        //position: 'relative'
                    }}
                >
                    <Text style={{
                        fontSize: moderateScale(14),
                        color: '#88879C',
                        fontFamily: 'Mulish',
                        fontWeight: '600',
                        lineHeight: moderateScale(18),
                        letterSpacing: moderateScale(0.4)
                    }}>
                        {data.hostName} has invited you to join the event {data.name}.</Text>
                </View>
            </View>
        </Pressable>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center'
            //minHeight: moderateScale(38),
        }}>
            <Pressable onPress={() => {
                inviteeEventConfirmation(userId, data.id, 'DECLINED', navigation)
            }}
                style={{
                    //backgroundColor: '#C8C5C5',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#00ADEF",
                    paddingVertical: moderateScale(10)
                }} >
                <Text style={{
                    fontFamily: 'Mulish',
                    color: '#00ADEF',
                    fontSize: moderateScale(15),
                    fontWeight: "600",
                }}>Decline</Text>
            </Pressable>
            <View style={{ width: 10 }}></View>
            <Pressable onPress={() => {
                inviteeEventConfirmation(userId, data.id, 'ACCEPTED', navigation)
            }}
                style={{
                    flex: 1,
                    backgroundColor: '#00ADEF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    paddingVertical: moderateScale(10),
                }}>
                <Text style={{
                    fontFamily: 'Mulish',
                    fontSize: moderateScale(15),
                    fontWeight: "600",
                    color: "white"
                }}>Accept</Text>
            </Pressable>
        </View>
    </View>
}

const styles = StyleSheet.create<Styles>({
    container: {
        minHeight: 75,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: moderateScale(10),
        marginBottom: moderateScale(10),
        justifyContent: 'space-around',
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
    }
})

export default InvitationItem