import * as React from 'react';
import {
    View,
    StyleSheet,
    Pressable
} from 'react-native';

import {
    Channel,
    Chat,
    OverlayProvider,
    AutoCompleteInput,
    useMessageInputContext,
    ImageUploadPreview,
    FileUploadPreview
} from 'stream-chat-react-native';

import * as SvgIcons from '../../../assets/svg-icons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

const CustomInput = props => {
    const { sendMessage, text, imageUploads, fileUploads, toggleAttachmentPicker, closeAttachmentPicker, openCommandsPicker } = useMessageInputContext();

    const isDisabled = !text && !imageUploads.length && !fileUploads.length;

    return (
        <View style={{
            width: '100%'
        }}>
            <ImageUploadPreview />
            <FileUploadPreview />
            <View style={{
                height: verticalScale(50),
                borderRadius: verticalScale(44),
                borderWidth: verticalScale(1.5),
                borderColor: '#355D9B',
                marginBottom: verticalScale(20),
                paddingHorizontal: verticalScale(9),
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <Pressable
                    onPress={toggleAttachmentPicker}
                    style={{
                        transform: [{ scale: moderateScale(1) }]
                    }}>
                    <Ionicons
                        name="attach"
                        style={{
                            fontSize: verticalScale(20),
                            color: 'grey'
                        }}
                    />
                </Pressable>
                <AutoCompleteInput
                    placeholder="Type a message..."
                    style={{
                        fontFamily: 'Mulish-Regular',
                        fontSize: verticalScale(13),
                        flex: 1
                    }}
                />
                <Pressable
                    onPress={()=>{
                        sendMessage()
                        closeAttachmentPicker()
                    }}
                    disabled={isDisabled}
                    style={{
                        transform: [{ scale: moderateScale(1) }]
                    }}>
                    <SvgIcons.SendIcon
                        fill={isDisabled ? 'grey' : '#355D9B'}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default CustomInput