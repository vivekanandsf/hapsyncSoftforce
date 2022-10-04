import * as React from 'react'
import {
    View,
    Image,
    ScrollView,
    ViewStyle,
    StyleSheet,
    Pressable
} from 'react-native';

import AppButton from '../../../components/UI/button'
import Text from '../../../components/UI/AppText'

import AuthInput from '../../../components/AuthUI/AuthInput'
import * as SvgIcons from '../../../assets/svg-icons'

import validator from 'validator'
import { connect } from 'react-redux';
import { loginSuccess } from '../../../store/userSlice';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import { login } from '../../../store/actionCreators';
import { Button } from 'react-native-elements';
import axios from '../../../axios'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Styles = {
    container: ViewStyle,
    horizontalLine: ViewStyle
}


type FormItem = {
    label: string,
    value: string | undefined,
    valid: boolean,
    errorMessage: string | string[] | undefined,
    inputProps: any,
}

type FormState = {
    [key: string]: FormItem
}

type LoginStateType = {
    formValue: FormState,
    otpLogin: any
}

type Props = {

}

class Login extends React.Component<Props, LoginStateType> {

    state: LoginStateType = {
        formValue: {
            // email: {
            //     label: 'Email',
            //     value: undefined,
            //     valid: false,
            //     errorMessage: undefined,
            //     inputProps: {},
            //     icon: <SvgIcons.MailIcon />
            // },
            phone: {
                label: 'Phone',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {},
                icon: <SvgIcons.UserIcon />
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
            
        },
        otpLogin:{
            label: 'Phone',
            value: undefined,
            valid: false,
            errorMessage: undefined,
            inputProps: {
                keyboardType:"numeric",
            },
            icon: <MaterialIcons name="call" size={20} color="#00ADEF" />
        }
    }

    validate = (key) => {
        let formValue = this.state.formValue;

        switch (key) {
            //
            case "phone":
                if (validator.isMobilePhone(String(formValue[key].value),["en-IN","en-US"])) {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                } else {
                    formValue[
                        key
                    ].errorMessage = `Invalid phone number`;
                    formValue[key].valid = false;
                }
                break;
            case "password":
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
            // case "email":
            //     if (!validator.isEmail(formValue[key].value)) {
            //         formValue[key].errorMessage = "Email is not valid";
            //         formValue[key].valid = false;
            //     } else {
            //         formValue[key].errorMessage = undefined;
            //         formValue[key].valid = true;
            //     }
            //     break;
            default:
            // code block
        }
    }

    buildFormInputs = () => {
        const { formValue } = this.state

        return Object.keys(formValue).map((key, index) => {
            return <View key={key} style={{ width: '100%', alignSelf: 'center' }}>
                <AuthInput
                    // label={formValue[key].label}
                    containerStyle={{ marginBottom: 3, marginTop: 2 }}
                    style={{
                        width: '100%',
                    }}
                    placeholder={formValue[key].label}
                    value={formValue[key].value}
                    errorMessage={formValue[key].errorMessage}
                    icon={formValue[key].icon}
                    {...formValue[key].inputProps}

                    onChangeText={(val) => this.handleTextChange(key, val)}
                />
            </View>
        })
    }

    handleTextChange = (key, value) => {
        let formValue = { ...this.state.formValue }
        formValue[key].value = value

        this.setState({ formValue })

        this.validate(key);
    }

    checkSubmitButtonValid = () => {
        let buttonValid = true

        for (let key in this.state.formValue) {
            buttonValid = buttonValid && this.state.formValue[key].valid
        }

        return buttonValid
    }

    submit = () => {
        const { formValue } = this.state;

        const data = {
            phone: formValue.phone.value,
            password: formValue.password.value
        }

        login(data)

    }

    renderSocialIcons = () => {
        const socials = [
            {
                type: 'facebook',
                icon: <SvgIcons.FbIcon />
            },
            {
                type: 'google',
                icon: <SvgIcons.GoogleIcon />
            },
            {
                type: 'twitter',
                icon: <SvgIcons.TwitterIcon />
            }
        ]


        return <View
            style={{
                alignSelf: 'center',
                width: '65%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 61,
                flex: 1,
                marginVertical: 30,
            }}
        >{socials.map(social => {
            return <View
                key={social.type}
                style={{
                    height: 61,
                    width: 61,
                    borderRadius: 35,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center'
                    // marginRight: 30
                }}>
                {social.icon}
            </View>
        })}
        </View>
    }

    render() {
        return <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        >
            <View style={{
                alignSelf: 'center'
            }}>
                <SvgIcons.AppLogo />
            </View>
            {/* <Text
                style={{
                    fontFamily: 'BellMT',
                    marginTop: "auto",
                    marginBottom: 15,
                    fontSize: 23,
                    color: 'rgba(53, 93, 155, 1)',
                    alignSelf: 'center',
                    fontWeight: 'bold'
                }}
            >LOGIN</Text> */}
            <View style={{
                backgroundColor: '#fff',
                borderRadius: moderateScale(15),
                marginHorizontal: moderateScale(40),
                minHeight: verticalScale(200),
                padding: moderateScale(35)
            }}>
                {this.buildFormInputs()}
                <AppButton
                    style={{
                        marginTop: 30
                    }}
                    title="LOGIN"
                    disabled={!this.checkSubmitButtonValid()}
                    clicked={this.submit}
                />
            </View>
           {/*  <View style={{ flexDirection: 'row', justifyContent: 'flex-end',  marginHorizontal: moderateScale(40), paddingHorizontal:10 }}>
                <Button 
                    title={"OTP Login"}
                    type={"clear"}
                    titleStyle={{ color:'rgba(0, 173, 239, 1)', }}
                    onPress={()=>{
                        this.props.navigation.navigate("PhoneLogin")
                    }}
                />
            </View> */}
            
            <View style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 30,
                flexDirection: 'row',
                marginHorizontal: 50
            }}>
                <View
                    style={styles.horizontalLine}
                />
                <Text style={{
                    marginHorizontal: 4,
                    color: 'rgba(53, 93, 155, 1)'
                }}>OR</Text>
                <View
                    style={styles.horizontalLine}
                />
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
                    containerStyle={{ paddingHorizontal:30,paddingBottom:10 }}
                    style={{
                        width: '100%',
                    }}
                    placeholder={this.state.otpLogin.label}
                    value={this.state.otpLogin.value}
                    errorMessage={this.state.otpLogin.errorMessage}
                    icon={this.state.otpLogin.icon}
                    {...this.state.otpLogin.inputProps}

                    onChangeText={(val) => {
                        /* this.setState({otpLogin:{

                        }}) */
                        if(validator.isMobilePhone(String(val),["en-IN","en-US"])){
                            this.setState({
                                otpLogin:{
                                    ...this.state.otpLogin,
                                    value: val,
                                    valid: true,
                                    errorMessage: undefined,
                                }
                            })
                        }else{
                            this.setState({
                                otpLogin:{
                                    ...this.state.otpLogin,
                                    value: val,
                                    valid: false,
                                    errorMessage: "Please Enter Valid Number",
                                }
                            })
                        }
                    }}
                />
            </View>
            
            <View style={{
                // backgroundColor: '#fff',
                // borderRadius: moderateScale(15),
                marginHorizontal: moderateScale(40),
                //minHeight: verticalScale(200),
                paddingHorizontal: moderateScale(35),
                paddingTop:10,
                paddingBottom:35
            }}>
                
                <AppButton
                    title="OTP LOGIN"
                    disabled={!this.state.otpLogin.valid}
                    clicked={()=>{
                        axios.post(
                            "/sms/sendOtp",
                            { 
                              phoneNumber: this.state.otpLogin.value
                            }
                          ).then(r=>{
                            console.log(r.data.status)
                            if(r.data.status=="success"){
                              this.props.navigation.navigate("OtpValidate", 
                              { 
                                phoneNumber: this.state.otpLogin.value,
                              });
                            }else if(r.data.status=="failed"){
                                this.setState({
                                    otpLogin:{
                                        ...this.state.otpLogin,
                                        valid: false,
                                        errorMessage: "User does not exist with this Number",
                                    }
                                })
                            }
                          }).catch(e=>{
                            console.log(e)
                            this.setState({
                                otpLogin:{
                                    ...this.state.otpLogin,
                                    errorMessage: "Faild Service",
                                }
                            })
                          })
                    }}
                />
            </View>
            
            {//this.renderSocialIcons()
            }
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                alignSelf: 'center',
                marginBottom: 25
            }}>
                <Text style={{ color: 'rgba(53, 93, 155, 1)' }}>Don't have an account?</Text>
                <Pressable
                    onPress={() => this.props.navigation.navigate("SignUpScreen")}
                ><Text style={{
                    marginLeft: moderateScale(3),
                    color: 'rgba(0, 173, 239, 1)'
                }}>Sign Up</Text></Pressable>
            </View>
        </KeyboardAwareScrollView>
    }
}

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFBFB',
        // alignItems: 'center'
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'rgba(53, 93, 155, 1)',
        flex: 1
    }
})



export default Login