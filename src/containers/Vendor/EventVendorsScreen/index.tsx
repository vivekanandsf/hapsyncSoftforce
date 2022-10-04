import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    TextInput,
    Text,
    Image
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import VendorEntry from '../../../components/Vendor/NewVendorEntry'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux'

class VendorsScreen extends React.Component {
    state = {

    }

    renderHeaderRightComp = () => {
        return <Pressable
            onPress={() => this.props.navigation.navigate("VendorManager")}
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

    renderSearchField = () => {
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            height: verticalScale(50),
            borderRadius: verticalScale(10),
            paddingHorizontal: moderateScale(9)
        }}>
            <Feather
                name="search"
                style={{
                    fontSize: verticalScale(23),
                    color: '#355D9B'
                }}
            />
            <TextInput
                placeholderTextColor="#404A69"
                placeholder="Search"
                style={{
                    fontSize: verticalScale(15),
                    color: '#404A69',
                    fontFamily: 'Mulish-Light',
                    flex: 1,
                    marginLeft: moderateScale(5)
                }}
            />
        </View>
    }

    renderStatus = (data) => {
        const status = data?.status

        let bgColor = {
            bg: "#fff",
            c: "grey"
        }

        const hashmap = new Map([
            ["EVALUATING", { bg: "rgba(26, 165, 77, 0.15)", c: "#1AA54D" }],
            ["HIRED", { bg: "rgba(37, 150, 215, 0.15)", c: "#2596D7" }],
            ["NOTAVAILABLE", { bg: "rgba(227, 0, 0, 0.15)", c: "#E30000" }],
            ["REJECTED", { bg: "rgba(239, 115, 0, 0.15)", c: "#EF7300" }]
        ]);
        bgColor = hashmap.get(data.status)

        return <View
            style={{
                backgroundColor: bgColor.bg,
                height: verticalScale(20),
                width: verticalScale(80),
                borderRadius: verticalScale(4),
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text style={{
                color: bgColor.c,
                fontSize: verticalScale(10)
            }}>{status}</Text>
        </View>
    }

    renderVendors = () => {

        let tasks = this.props.currentEvent.activities

        return <>
            <View style={{
                marginTop: verticalScale(20)
            }}>
                {tasks.map((each, index) => {
                    return <>
                        <View style={styles.container}>
                            <View
                                style={{
                                    flexDirection: 'row'
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    marginLeft: 20,
                                }}
                                >
                                    <AppText style={{
                                        color: '#355D9B',
                                        fontWeight: 'bold',
                                        fontFamily: 'Mulish-Bold'
                                    }}>
                                        {each?.name}
                                    </AppText>
                                    <AppText style={{
                                        fontSize: verticalScale(10),
                                        color: '#9F9FB9'
                                    }}>{each?.activityTypeName}</AppText>
                                </View>
                            </View>

                            <View
                                style={{
                                    borderTopColor: '#88879C1A',
                                    borderWidth: verticalScale(1),
                                    borderColor: 'white',
                                    marginTop: verticalScale(15),
                                    paddingTop: verticalScale(15),
                                }}
                            >
                                {
                                    each.vendors?.map((user, index) => {
                                        return <Pressable
                                            onPress={() => {
                                                /* this.props.navigation.navigate("VendorDetails", {
                                                    data: user
                                                }) */
                                            }}
                                            key={index}
                                            style={{
                                                flexDirection: 'row',
                                                height: moderateScale(65),
                                                alignItems: 'center',
                                            }}>

                                            <Image
                                                style={{
                                                    width: moderateScale(54),
                                                    height: moderateScale(54),
                                                    borderRadius: moderateScale(27),
                                                    borderWidth: 1,
                                                    borderColor: "grey"
                                                }}
                                                source={{ uri: user.url }}
                                            />
                                            <View
                                                style={{
                                                    flex: 0.6,
                                                    paddingLeft: moderateScale(10)
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: moderateScale(13),
                                                    //fontWeight: 'bold',
                                                    color: '#355D9B'
                                                }}>
                                                    {user.name}
                                                </Text>
                                                <Text style={{
                                                    fontSize: moderateScale(10),
                                                    color: '#88879C'
                                                }}>
                                                    {user.phone}
                                                </Text>
                                            </View>
                                            <View style={{
                                                marginLeft: 'auto',
                                            }}>
                                                {this.renderStatus(user)}
                                            </View>
                                        </Pressable>
                                    })
                                }
                            </View>
                        </View>
                    </>
                })}
            </View>
        </>
    }

    render() {
        const data = this.props.route.params?.data

        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                // flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title={"Event Vendors"}
            //rightComponent={this.renderHeaderRightComp()}
            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: moderateScale(50)
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(11)
                }}>
                    {//this.renderSearchField()
                    }
                    {this.renderVendors()}
                </View>
            </ScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    container: {
        padding: verticalScale(20),
        backgroundColor: '#fff',
        elevation: 1,
        minHeight: verticalScale(80),
        borderRadius: verticalScale(15),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: "#88879C1A"
    }
})

const mapStateToProps = state => {

    const { currentEvent } = state.events

    return {
        currentEvent,
    }
}

export default connect(mapStateToProps)(VendorsScreen)
