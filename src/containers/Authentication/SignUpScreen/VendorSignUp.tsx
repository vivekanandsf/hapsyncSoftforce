import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SvgIcons from '../../../assets/svg-icons'
import validator from 'validator'
import AuthInput from '../../../components/AuthUI/AuthInput'
import AppButton from '../../../components/UI/button'
import { getAllActivityTypes, register } from '../../../store/actionCreators'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import MultiSelectDropdown from '../../../components/MultiSelectDropdown'
import { moderateScale } from '../../../utils/scalingUnits'
import { useSelector } from 'react-redux'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Config from 'react-native-config'

export default function VendorSignUp(props) {

   const navigation = useNavigation();

   const [formValues, setFormValues] = useState({
      name: {
         label: "Vendor Name",
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SvgIcons.UserIcon />
      },
      email: {
         label: 'Email',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SvgIcons.MailIcon />
      },
      phone: {
         label: 'Mobile Number',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {
            keyboardType: "numeric",
         },
         icon: <MaterialIcons name="call" size={20} color="#00ADEF" />
      },
      password: {
         label: 'Password',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {
            secureTextEntry: true
         },
         icon: <SvgIcons.KeyIcon />
      },
      confirmPassword: {
         label: 'Confirm Password',
         value: undefined,
         valid: false,
         touched: false,
         errorMessage: undefined,
         inputProps: {
            secureTextEntry: true
         },
         icon: <SvgIcons.KeyIcon />
      },
      website: {
         label: 'Vendor Website',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SimpleLineIcons name="globe" size={20} color="#00ADEF" />
      },
      /* address: {
         label: 'Vendor Address',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <MaterialCommunityIcons name="map-marker-radius" size={20} color="#00ADEF" />
      }, */
      /*  type: {
          label: 'Vendor Type',
          value: undefined,
          valid: false,
          errorMessage: undefined,
          inputProps: {},
          icon: <Feather name="type" size={20} color="#00ADEF" />
       }, */
   })

   const validate = (key) => {
      let formValue = { ...formValues };

      switch (key) {
         //
         case "name":
            if (validator.isEmpty(formValue[key].value)) {
               formValue[
                  key
               ].errorMessage = `${formValue[key].label} cannot be empty`;
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         //
         case "email":
            if (!validator.isEmail(formValue[key].value)) {
               formValue[key].errorMessage = "Email is not valid";
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;

         case "phone":
            if (!validator.isMobilePhone(formValue[key].value, ['en-IN', 'en-US'])) {
               formValue[key].errorMessage = "Invalid Phone Number";
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         case "password":
            let error = [];
            if (!validator.matches(formValue[key].value, "[A-Za-z]")) {
               error.push("At least one letter");
               formValue[key].valid = false;
            }
            if (!validator.matches(formValue[key].value, "^.{6,}$")) {
               error.push("At least 6 characters");
               formValue[key].valid = false;
            }
            // if there are no errors in password
            if (error.length === 0) {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            formValue[key].errorMessage = error;

            // check confirm password equality if only confirm password has been touched
            if (formValue.confirmPassword.touched === true) {
               if (
                  formValue[key].value !== formValue.confirmPassword.value
               ) {
                  formValue.confirmPassword.errorMessage = "Passwords do not match";
                  formValue.confirmPassword.valid = false;
               } else {
                  formValue.confirmPassword.errorMessage = undefined;
                  formValue.confirmPassword.valid = true;
               }
            }
            break;
         case "confirmPassword":
            // set touched to true
            formValue[key].touched = true;

            if (formValue[key].value !== formValue.password.value) {
               formValue[key].errorMessage = "Passwords do not match";
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         case "website":
            if (!validator.isURL(formValue[key].value, { protocols: ['http', 'https'], require_protocol: true })) {
               formValue[
                  key
               ].errorMessage = `Enter a valid url`;
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         case "address":
            if (validator.isEmpty(formValue[key].value)) {
               formValue[
                  key
               ].errorMessage = `${formValue[key].label} cannot be empty`;
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         default:
         // code block
      }
   }

   const handleTextChange = (key, value) => {
      let formValue = { ...formValues }
      formValue[key].value = value

      setFormValues(formValue)

      validate(key);
   }

   const checkSubmitButtonValid = () => {
      let buttonValid = true
      let formValue = { ...formValues }

      for (let key in formValue) {
         buttonValid = buttonValid && formValue[key].valid
      }
      if (selectedTypes.length && currentInputVal == location?.address && buttonValid) {
         buttonValid = true
      } else {
         buttonValid = false
      }

      return buttonValid
   }

   const submit = async () => {

      let formValue = { ...formValues }

      let arr = [...selectedTypes].map(i => {
         return {
            activityTypeId: i.id
         }
      })

      const data = {
         "email": formValue.email.value,
         "userName": formValue.name.value,
         "password": formValue.password.value,
         "confirmPassword": formValue.confirmPassword.value,
         "phone": formValue.phone.value,
         "role": "VENDOR",
         "website": formValue.website.value,
         "address": location.address,
         "latitude": location.latitude,
         "longitude": location.longitude,
         "placeId": location.placeId,
         "vendorActivityTypes": arr
      }

      await register(data, navigation)

      // clear form
      let formVal = { ...formValue }
      for (let key in formVal) {
         formVal[key].value = undefined
         formVal[key].valid = false
         formVal[key].errorMessage = undefined
      }
      setFormValues(formVal)
      setLocation(null)
      setCurrentInputVal("")
      setSelectedTypes([])
      setkey(key + 1)
   }

   const [selectedTypes, setSelectedTypes] = useState([])

   const [location, setLocation] = useState(null)
   const [currentInputVal, setCurrentInputVal] = useState("")
   const [key, setkey] = useState(1)


   useEffect(() => {
      getAllActivityTypes()
   }, [])

   const activityTypes = useSelector(state => state.events.activityTypes)

   let items = []
   activityTypes.map(i => {
      items.push({
         name: i.activityTypeName,
         id: i.id
      })
   })


   return (
      <View style={{ padding: 25 }}>
         {
            Object.keys(formValues).map((key, index) => {
               let formValue = { ...formValues }
               let label = formValue[key].label;

               return <View key={key} style={{
                  width: '100%',
                  minHeight: 60,
                  alignSelf: 'center'
               }}>
                  <AuthInput
                     // label={formValue[key].label}
                     containerStyle={{ marginBottom: 3, marginTop: 2 }}
                     placeholder={label}
                     value={formValue[key].value}
                     errorMessage={formValue[key].errorMessage}
                     icon={formValue[key].icon}
                     {...formValue[key].inputProps}

                     onChangeText={(val) => handleTextChange(key, val)}
                  />
               </View>
            })
         }
         <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ marginRight: 16, marginTop: 10 }}>
               <MaterialCommunityIcons name="map-marker-radius" size={20} color="#00ADEF" />
            </View>
            <View style={{ flex: 1 }}>

               <GooglePlacesAutocomplete
                  placeholder='Vendor Address'
                  enablePoweredByContainer={false}
                  fetchDetails={true}
                  onPress={(data, details) => {
                     // 'details' is provided when fetchDetails = true
                     //console.log(data, details);
                     let l = {
                        "address": data.description,
                        "latitude": details?.geometry.location.lat,
                        "longitude": details?.geometry.location.lng,
                        "placeId": data.place_id
                     }
                     setLocation(l)
                     setCurrentInputVal(data.description)
                  }}
                  query={{
                     key: Config.GOOGLE_PLACE_API_KEY,
                     language: 'en',
                  }}
                  styles={{
                     textInput: {
                        //color: '#000',
                        borderRadius: moderateScale(10),
                        borderColor: 'rgba(53, 93, 155, 1)',
                        color: 'rgba(53, 93, 155, 1)',
                        padding: 6,
                        height: moderateScale(42),
                        borderWidth: 0.5,
                        //margin: moderateScale(6)
                     },
                  }}
                  textInputProps={{
                     onChangeText: (val) => setCurrentInputVal(val),
                     value: currentInputVal // undefined value
                  }}
                 //keyboardShouldPersistTaps="handled"
               />
            </View>
         </View>

         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ marginRight: 16 }}>
               <Feather name="type" size={20} color="#00ADEF" />
            </View>
            <View key={key} style={{ flex: 1 }}>
               <MultiSelectDropdown
                  data={items}
                  onConfirm={(selected) => {
                     setSelectedTypes(selected)
                  }}
               />
            </View>
         </View>


         <AppButton
            style={{
               marginTop: 22
            }}
            title="SIGNUP"
            clicked={() => submit()}
            disabled={!checkSubmitButtonValid()}
         />
      </View>
   )
}