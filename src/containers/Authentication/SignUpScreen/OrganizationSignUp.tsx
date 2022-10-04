import { View, Text } from 'react-native'
import React, { useState } from 'react'
import * as SvgIcons from '../../../assets/svg-icons'
import validator from 'validator'
import AuthInput from '../../../components/AuthUI/AuthInput'
import AppButton from '../../../components/UI/button'
import { register } from '../../../store/actionCreators'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useNavigation } from '@react-navigation/native'

export default function OrganizationSignUp(props) {

   const navigation = useNavigation();

   const [formValues, setFormValues] = useState({
      orgName: {
         label: "Organization Name",
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <FontAwesome name="building-o" size={20} color="#00ADEF" />
      },
      website: {
         label: "Organization Website",
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SimpleLineIcons name="globe" size={20} color="#00ADEF" />
      },
      contactName: {
         label: "Contact Name",
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
   })

   const validate = (key) => {
      let formValue = { ...formValues };

      switch (key) {

         case "orgName":
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
         case "contactName":
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

      return buttonValid
   }
   const submit = async () => {

      let formValue = { ...formValues }

      const data = {
         "email": formValue.email.value,
         "userName": formValue.contactName.value,
         "password": formValue.password.value,
         "confirmPassword": formValue.confirmPassword.value,
         "phone": formValue.phone.value,
         "role": "ORGANIZATION",
         "orgName":formValue.orgName.value,
         "website": formValue.website.value
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

   }

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