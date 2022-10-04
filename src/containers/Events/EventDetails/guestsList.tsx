import { View, Text, StyleSheet, ViewStyle, TextStyle, Image, Pressable, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import { ButtonGroup } from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

export default function GuestsList({ data, userEditAccess }) {

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [list, setList] = useState([])

    const [all, setAll] = useState([])
    const [tentative, setTentative] = useState([])
    const [accepted, setAccepted] = useState([])
    const [declined, setDeclined] = useState([])

    const navigation = useNavigation()

    useEffect(() => {

        const guestsData = data.invitees ? data.invitees : []
        const all = guestsData
        let tentative = []
        let accepted = []
        let declined = []

        guestsData.forEach(element => {
            if (element.response == 'PENDING') {
                tentative.push(element)
            } else if (element.response == 'ACCEPTED') {
                accepted.push(element)
            } else if (element.response == 'DECLINED') {
                declined.push(element)
            }
        });
        setAll(all)
        setTentative(tentative)
        setAccepted(accepted)
        setDeclined(declined)
        let value = selectedIndex
        if (value == 0) {
            setList(all)
        } else if (value == 1) {
            setList(accepted)
        } else if (value == 2) {
            setList(declined)
        } else if (value == 3) {
            setList(tentative)
        }
    }, [data])

    return <View style={{
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        marginVertical: moderateScale(15),
        padding: moderateScale(10),
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
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: moderateScale(5),
            backgroundColor: 'rgba(238, 215, 255, 0.27)'
        }}>
            <Text style={[styles.heading, { marginHorizontal: 5 }]}>Guests</Text>
            {userEditAccess && <Pressable
                onPress={() => {
                    navigation.navigate("InviteFriend", {
                        editingEvent: true,
                        eventData: data
                    })
                }
                }
            >
                <MaterialCommunityIcons
                    name="plus"
                    style={{
                        color: '#00ADEF',
                        fontSize: moderateScale(23)
                    }}
                />
            </Pressable>
            }
        </View>
        <View style={{height:moderateScale(7)}}></View>
        <ButtonGroup
            buttons={['All( ' + all.length + ' )',
            'Accepted( ' + accepted.length + ' )',
            'Declined( ' + declined.length + ' )',
            'Tentative( ' + tentative.length + ' )']
            }
            selectedIndex={selectedIndex}
            onPress={(value) => {
                setSelectedIndex(value);
                if (value == 0) {
                    setList(all)
                } else if (value == 1) {
                    setList(accepted)
                } else if (value == 2) {
                    setList(declined)
                } else if (value == 3) {
                    setList(tentative)
                }
            }}
            buttonStyle={{
                alignContent: 'center', borderRadius: 4, backgroundColor: 'white',
                borderColor: '#355D9B', borderWidth: 0.5,
            }}
            textStyle={{
                textAlign: 'center', color: 'black', fontFamily: 'Mulish-Bold',
                fontSize: moderateScale(10),
            }}

            innerBorderStyle={{ color: 'white', width: 5 }}
            containerStyle={{ marginHorizontal: moderateScale(-1), height: 40, borderColor: 'white', }}

            selectedButtonStyle={{ backgroundColor: "#355D9B", borderColor: 'black', }}
            selectedTextStyle={{ fontFamily: 'Mulish-Bold', fontSize: moderateScale(10) }}
        />
        <View style={{ paddingVertical: 0 }}>
            {list.map((each, index) => {
                return <View
                    key={each.id}
                    style={{
                        flexDirection: 'row',
                        padding: moderateScale(10),
                        alignItems: 'center',
                        borderBottomWidth: list.length == index + 1 ? 0 : 0.5,
                        borderColor: '#cccccc'
                    }}>

                    <Image
                        style={{
                            width: moderateScale(52),
                            height: moderateScale(52),
                            borderRadius: moderateScale(27),
                            borderWidth: 0.5,
                            borderColor: "black"
                        }}

                        source={
                            each.imageUrl
                                ? {
                                    uri: each.imageUrl
                                }
                                : require("../../../assets/images/event.png")
                        }
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: moderateScale(10),
                            flexDirection: "row"
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: moderateScale(15), color: '#355D9B' }}>{each.name}</Text>
                            <Text style={{
                                fontSize: moderateScale(12),
                                color: '#88879C'
                            }}>
                                {each.phone}
                            </Text>
                        </View>
                        {/* { !each.name && <View style={{   flex:1,}}>
                            <View
                                style={{
                                    borderRadius: verticalScale(4),
                                    backgroundColor: "rgba(239, 115, 0, 0.15)",
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                 
                                    padding:10
                                }}
                            >
                                <Text style={{
                                    fontSize: moderateScale(10),
                                    color: "#EF7300",
                                    fontFamily: 'Mulish-Bold'
                                }}>
                                    {"Not Registered"}
                                </Text>
                            </View>
                        </View>} */}
                    </View>
                    {/* <MaterialCommunityIcons
                   name="minus"
                   style={{
                       color: '#E14F50',
                       fontSize: moderateScale(23),
                       marginLeft: 'auto'
                   }}
               /> */}

                </View>
            })
            }
        </View>
    </View >
}
type Styles = {
    container: ViewStyle,
    heading: TextStyle
}


const styles = StyleSheet.create<Styles>({
    heading: {
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        fontSize: moderateScale(15.5)
    }
});