import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from '../../../axios'

import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/userSlice";
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale, verticalScale } from "../../../utils/scalingUnits";
import AppButton from "../../../components/UI/button";
import AuthInput from "../../../components/AuthUI/AuthInput";

const OtpValidate = ({ route, navigation }) => {

   const { phoneNumber } = route.params;
   const [otp, setOtp] = useState("")

   const [displayMsg, setDisplayMsg] = useState("")

   const [errMsg, setErrMsg] = useState("");

   const dispatch = useDispatch()

   useEffect(() => {
      setDisplayMsg(`OTP Sent to Your phone  ${phoneNumber} `)
   }, [])
   

   return (<>


      {/* <ScrollView
            contentContainerStyle={styles.container}
        >
         <SafeAreaView style={styles.wrapper}>
            <View style={{
                alignSelf: 'center'
            }}>
                <SvgIcons.AppLogo />
            </View>
         <Text style={styles.prompt}>Enter the OTP</Text>
         <Text style={styles.message}>
            {`Sent to Your phone (${phoneNumber}) `}
         </Text>
         <Button
            title="Edit Phone Number"
            type="clear"
            onPress={() => navigation.pop()}
         />
         <OTPInputView
            style={{ width: "80%", height: 200 }}
            pinCount={6}
            onCodeChanged={()=>{setInvalidCode(false)}}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
               /* checkVerification(phoneNumber, code).then((success) => {
                 if (!success) {
                   setInvalidCode(true);
                 }
                 success && navigation.replace("Gated");
               });
               
               axios.post(
                  "/sms/validateOtp",
                  {
                     mobileNumber:phoneNumber,
                     otp:code
                  }
               ).then(r=>{
                  
                  if(r.data.status=="success"){
                     dispatch(loginSuccess(r.data))
                  }else{
                     setInvalidCode(true)
                  }
               }).catch(e=>{
                  console.log(e)
               })

            }}
         />
         {invalidCode && <Text style={styles.error}>Incorrect OTP</Text>}
         
      </SafeAreaView>
      </ScrollView> */}
      <ScrollView
         contentContainerStyle={styles.container}
         keyboardShouldPersistTaps='handled'
      >
         <View style={{
            alignSelf: 'center'
         }}>
            <SvgIcons.AppLogo />
            <Text style={styles.message}>
               {displayMsg}
            </Text>
            <Button
               title="Edit Phone Number"
               type="clear"
               onPress={() => navigation.pop()}
            />
         </View>
         <View
            style={{ height: 30 }}
         >

         </View>
         <View style={{
            backgroundColor: '#fff',
            borderRadius: moderateScale(15),
            marginHorizontal: moderateScale(40),
            minHeight: verticalScale(10),
            //padding: moderateScale(35)
         }}>
            <AuthInput
               // label={formValue[key].label}
               containerStyle={{ paddingHorizontal: 30,  }}
               style={{
                  width: '100%',
               }}
               placeholder={"Enter OTP"}
               value={otp}
               errorMessage={errMsg}
               icon={undefined}
               keyboardType="numeric"
               onChangeText={(val) => {
                  setOtp(val)
               }}
            />
            <Button
               containerStyle={{alignSelf:'flex-end',padding:10 }}
               title="RESEND OTP"
               type="clear"
               onPress={() => {
                  axios.post(
                     "/sms/sendOtp",
                     { 
                       phoneNumber: phoneNumber
                     }
                   ).then(r=>{
                     console.log(r.data.status)
                     if(r.data.status=="success"){
                        setDisplayMsg(`OTP Resent to Your phone  ${phoneNumber} `)
                     }else {
                        setDisplayMsg(`Failed - Resent OTP to Your phone  ${phoneNumber} `)
                     }
                   }).catch(e=>{
                     console.log(e)
                     setDisplayMsg(`Failed - Resent OTP to Your phone  ${phoneNumber} `)
                   })
               }}
            />
         </View>

         <View style={{
            // backgroundColor: '#fff',
            // borderRadius: moderateScale(15),
            marginHorizontal: moderateScale(40),
            //minHeight: verticalScale(200),
            padding: moderateScale(35),
         }}>

            <AppButton
               title="Validate"
               disabled={false}
               clicked={() => {
                  if(otp.length>0){
                     axios.post(
                        "/sms/validateOtp",
                        {
                           mobileNumber: phoneNumber,
                           otp: otp
                        }
                     ).then(r => {

                        if (r.data.status == "success") {
                           dispatch(loginSuccess(r.data))
                        } else {
                           setErrMsg('Incorrect OTP')
                        }
                     }).catch(e => {
                        console.log(e)
                        setErrMsg("Service Failed")
                     })
                  }else{
                     setErrMsg("OTP cannot be Empty")
                  }
               }}
            />
         </View>
      </ScrollView>
   </>

   );
};

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      backgroundColor: '#FFFBFB',
      // alignItems: 'center'
   },
   wrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },

   underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: 'black',
      color: "black",
      fontSize: 20,
   },

   underlineStyleHighLighted: {
      borderColor: "#03DAC6",
   },

   prompt: {
      fontSize: 24,
      paddingHorizontal: 30,
      paddingBottom: 20,
   },

   message: {
      fontSize: 16,
      paddingHorizontal: 30,
   },

   error: {
      color: "red",
      fontSize: 20
   },
});

export default OtpValidate;