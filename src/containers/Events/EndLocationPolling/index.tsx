import { View, Text, ImageBackground, Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar';
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits';

import { endVoting } from '../../../store/actionCreators';
import AppButton from '../../../components/UI/button'

export default function EndLocationPolling({ route, navigation }) {

   const { finalDate, pollLocations, eventId } = route.params;
   const [selectedLoc, setSelectedLoc] = useState(null)

   //  console.log(finalDate)
   //  console.log(pollLocations)
   const renderBackIcon = () => {
      return <>
         <Pressable
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
         </Pressable>
      </>
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
      return <Pressable style={[styles.block, selectedLoc ? each.id == selectedLoc.id ? { backgroundColor: '#A7ECC1' } : {} : {}]}
         onPress={() => {
            setSelectedLoc(each)
            //navigation.pop(2)
            //endVoting(finalDate,each,eventId)
         }}>
         <View style={{ justifyContent: 'center', padding: 10, margin: 5 }}>
            <Text style={{ color: '#88879C', fontFamily: 'Mulish-Bold', fontSize: 13 }}>
               {each.name}
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
               flex: 1,
               minWidth: "100%",
               minHeight: "100%"
            }}
         >

            <TopBar
               //leftComponent={renderBackIcon()}
               style={{ backgroundColor: 'transparent' }}
               title="Choose Location"
            />
            <ScrollView
               style={{ flex: 1, marginHorizontal: moderateScale(15) }}
               showsVerticalScrollIndicator={false}
            >
               {pollLocations.map((each, i) => <Block each={each} key={i} />)}
               <View style={{ margin: 5 }}></View>
            </ScrollView>
            <View style={{ flexDirection: 'column', margin: moderateScale(15) }}>
               <AppButton
                  title="END POLLING"
                  style={{ backgroundColor: selectedLoc == null ? 'grey' : '#CF6364' }}
                  clicked={() => {
                     if (selectedLoc == null) {

                     } else {
                        navigation.pop(2)
                        endVoting(finalDate, selectedLoc, eventId)
                     }
                  }}
               />
            </View>
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
      height: 'auto', marginTop: 15, padding: 10, alignItems: 'center'
   },
   heading: {
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      fontSize: moderateScale(15.5)
   },
})