import { View, Text, ImageBackground, Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar';
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits';
import moment from 'moment';
import { each } from 'immer/dist/internal';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function EndDatePolling({ route, navigation }) {

   const { pollDates, pollLocations, eventId } = route.params;

   const [selectedDate, setSelectedDate] = useState(null)

   //console.log(pollDates)
   const renderBackIcon = () => {
      return <>
         <Pressable
            onPress={() => navigation.goBack()}
            style={{
               position: 'absolute',
               left: moderateScale(10),
               zIndex: 20,
               padding: moderateScale(10),
               paddingRight: moderateScale(15),
               // marginLeft: moderateScale(20),
            }}
         >
            <Ionicons name="ios-arrow-back-circle-outline" size={36} color="rgba(53, 93, 155, 1)" />

         </Pressable>
         {/* <Pressable
            onPress={() => navigation.goBack()}
            style={{
               position: 'absolute',
               left: moderateScale(17),
               zIndex: 20,
               padding: moderateScale(3)
               // marginLeft: moderateScale(20),
            }}
         >
            {
               <SvgIcons.BackIcon />
            }
         </Pressable> */}
      </>
   }

   const RightHeader = () => {
      return <Pressable
         onPress={() => {
            if (selectedDate == null) {

            } else {
               navigation.navigate('EndLocationPolling', {
                  finalDate: selectedDate,
                  pollLocations: pollLocations,
                  eventId: eventId
               })
            }
         }}
         style={{ padding: 5, }}>
         <Text style={{
            color: selectedDate == null ? 'grey' : 'rgba(53, 93, 155, 1)',
            fontSize: moderateScale(20),
            fontFamily: 'Mulish-ExtraBold'
         }}>Next</Text>
      </Pressable>
   }

   const Block = ({ each }) => {
      let yes = 0
      let no = 0
      let maybe = 0

      each.polling.map(item => {
         //console.log(item.vote)
         if (item.vote == 'LIKE') {
            yes = yes + 1
         } else if (item.vote == 'DISLIKE') {
            no = no + 1
         } else if (item.vote == 'PENDING') {
            maybe = maybe + 1
         }
      })
      return <Pressable style={[styles.block, selectedDate ? each.id == selectedDate.id ? { backgroundColor: '#A7ECC1' } : {} : {}]}
         onPress={() => {
            setSelectedDate(each)
         }}>
         <View style={{ justifyContent: 'center', padding: 10, margin: 5 }}>
            <Text style={{ color: '#00ADEF', fontFamily: 'Mulish-Bold', fontSize: 13 }}>
               {moment(each.slot).format("DD MMM YYYY").toUpperCase()}
               {each.startTime ? moment(each.startTime, "hh:mm").format(" , LT") : ''}
            </Text>
         </View>
         <View style={styles.hline}></View>
         <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.innerBlock}>
               <Text style={styles.text1}>{yes}</Text>
               <Text style={styles.text2}>YES</Text>
            </View>
            <View style={styles.innerBlock}>
               <Text style={styles.text1}>{no}</Text>
               <Text style={styles.text2}>NO</Text>
            </View>
            <View style={styles.innerBlock}>
               <Text style={styles.text1}>{maybe}</Text>
               <Text style={styles.text2}>MAY BE</Text>
            </View>
         </View>

      </Pressable>
   }

   return (
      <View>
         <ImageBackground
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
               //leftComponent={renderBackIcon()}
               style={{ backgroundColor: 'transparent' }}
               title="Choose Time"
               rightComponent={<RightHeader />}
            />
            <ScrollView
               style={{ flex: 1, marginHorizontal: moderateScale(15) }}
               showsVerticalScrollIndicator={false}
            >
               {pollDates.map((each, i) => <Block each={each} key={i} />)}
               <View style={{ margin: 5 }}></View>
            </ScrollView>
         </ImageBackground>
      </View>
   )
}

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
   container: {
      marginTop: 50,
   },
   text1: {
      fontFamily: 'Mulish-Bold', fontSize: 24, color: '#88879C'
   },
   text2: {
      fontFamily: 'Mulish-Bold', fontSize: 9, color: '#355D9B'
   },
   innerBlock: {
      justifyContent: 'center', alignItems: 'center', flex: 1
   },
   hline: {
      width: '90%', height: 1, backgroundColor: '#355D9B', margin: 7
   },
   block: {
      flex: 1, borderRadius: moderateScale(10), backgroundColor: 'white',
      height: 'auto', marginTop: 15, padding: 10, alignItems: 'center',
   },
   heading: {
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      fontSize: moderateScale(15.5)
   },
})