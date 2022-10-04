import * as React from 'react'
import { View, Pressable, Text, StyleSheet, ViewStyle, Image, Linking, Platform } from 'react-native'

import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits'

import DashedLine from 'react-native-dashed-line';
import { useNavigation } from '@react-navigation/core';

import moment from 'moment'
import { showLocation } from 'react-native-map-link';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import ChatContext from '../../../chatContext';

/* 
type Styles = {
    container: ViewStyle
} */

const InterestedItem = (props) => {
   const navigation = useNavigation()

   const { userData } = useSelector(state => state.user)

   const data = props.data.event


   /* const {
      chatClient,
      setupChatClient,
      clientReady,
      disconnectClient,
      setChannel
   } = React.useContext(ChatContext)

   //const [channelInEntry, setChannelInEntry] = React.useState(undefined);

   const [unreadCount, setUnreadCount] = React.useState(0)

   let task = props.data
   let hostId = data.userId
   let channelPrefix = "task" + task.id

   let channelListener = undefined
   const groupName = `task-group-${task?.id}_vendor-${userData?.id}`;

   React.useEffect(() => {

      const startup = async () => {
         if (!clientReady) {
            await setupChatClient()
         }
         const assignees = task?.assignees

         let guestIds = []
         if (assignees) {
            guestIds = assignees?.map((assignee) => `${assignee?.userId}_user`);
            //adding vendor to assignees
            guestIds.push(`${userData?.id}_user`)
         }

         let channelId = groupName

         let filter = {
            type: 'messaging',
            members: { $in: [...guestIds] },
            id: { $eq: groupName }
         }

         const channel = chatClient.channel("messaging", channelId,
            {
               members: guestIds, name: channelId
            });
         await channel.create();

         let queryRes;
         if (guestIds?.length > 0) {
            queryRes = await chatClient.queryChannels(filter, {}, {
               watch: true, // this is the default
               state: true,
            });


            const channelWithState = queryRes[0]

            //console.log(channelWithState)

            if (!channelWithState) {
               return;
            }

            //setChannel(channelWithState);
            //setChannelInEntry(channelWithState)
            setUnreadCount(channelWithState.countUnread())
            channelListener = channel.on(event => {
               if (event.unread_count) {
                  //console.log(event)
                  setUnreadCount(channelWithState.countUnread())
               }
            })

         }
      };
      startup();

      return () => {
         channelListener?.unsubscribe();
      }


   }, []) */


   const renderGuestsCount = () => {

      const { invitees } = data;

      let accepted = 0, tentative = 0, declined = 0
      if (Array.isArray(invitees)) {
         accepted = invitees.filter((each) => each.response == "ACCEPTED").length
         declined = invitees.filter((each) => each.response == "DECLINED").length
         tentative = invitees.filter((each) => each.response == "PENDING").length
      }

      let task = props.data

      return <View style={{ flexDirection: "row" }}>
         <View style={{ width: "30%", }}>
            <Text style={styles.guestcount} >No of Guests</Text>
            <Text style={styles.guestcount} >Activity Name</Text>
         </View>
         <View>
            <Text style={styles.guestcount} >{invitees.length}</Text>
            <Text style={styles.guestcount} >{task?.name}</Text>
         </View>
      </View>
   }



   const renderBottomSection = () => {
      return <View style={{
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         marginTop: 5
      }}>
         <View style={{
            flexDirection: 'row',
            alignItems: 'center'
         }}>
            <Text style={{
               color: 'rgba(53, 93, 155, 1)',
               fontSize: 10,
               fontFamily: "Mulish-Bold"
            }}>{moment(data.timings[0].slot).format("DD MMM YYYY")}</Text>
            {data.timings[0].startTime &&
               <Text style={{
                  color: 'rgba(53, 93, 155, 1)',
                  fontSize: 10,
                  fontFamily: "Mulish-Bold"
               }}>{" , " + moment(data.timings[0].startTime, "hh:mm").format("LT")}</Text>
            }
         </View>
         <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Pressable
               onPress={() => {
                  navigation.navigate("EventTabsForVendor", { screen: 'Chat', data: props.data })
                  //setUnreadCount(0)
               }}
               style={{ marginRight: 30, }}
            >
               <View
                  style={{ flexDirection: 'row' }}
               >
                  <SvgIcons.CommentIcon />
                  {/* <Text style={{
                     color: '#00ADEF',
                     fontSize: 11,
                     marginLeft: 2
                  }}>{unreadCount}</Text> */}
               </View>
            </Pressable>

            <View
               style={{ transform: [{ scale: moderateScale(0.8) }] }}
            >
               <SvgIcons.GoButton
               />
            </View>
         </View>
      </View>
   }

   return <Pressable
      onPress={() => {
         navigation.navigate("EventTabsForVendor", { data: props.data })
      }}
      style={styles.container}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
         <View style={{ width: '50%', }}>
            <Text style={{
               fontSize: 14,
               fontFamily: 'Mulish-ExtraBold',
               color: 'rgba(53, 93, 155, 1)'
            }}>{data?.name}</Text>
            <Text style={{
               fontSize: 10,
               color: '#87899C',
               fontFamily: "Mulish-Bold",
               marginTop: 5
            }}>{data?.locations[0].name}</Text>

         </View>
         <View style={{ flex: 1, alignItems: "center", }}>
            <Text style={styles.contactname}>Contact Name: {data.hostName}</Text>
            <Text style={styles.contactname}>Contact Phone #: {data.hostPhone}</Text>
         </View>
      </View>

      {renderGuestsCount()}

      {renderBottomSection()}
   </Pressable>
}

const styles = StyleSheet.create<Styles>({
   container: {
      minHeight: 170,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 10,
      padding: 17,
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
      justifyContent: 'space-around',
   },
   iconStyle: {
      flex: 1,
      padding: 10,
   },
   greenBg: {
      backgroundColor: 'rgba(26, 165, 77, 0.15)',
      color: 'rgba(26, 165, 77, 1)',
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderRadius: 4,
      marginRight: 8,
      fontSize: 10
   },
   guestcount: {
      color: "#474752",
      fontFamily: "Mulish",
      fontSize: 11
   },
   contactname: {
      fontSize: 11,
      color: "#474752",
      fontFamily: 'Mulish-Regular',
      fontStyle: 'italic',
   }
})

export default InterestedItem