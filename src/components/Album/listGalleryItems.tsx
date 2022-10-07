import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {moderateScale} from '../../utils/scalingUnits';

const VideoItem = ({uri}) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <ActivityIndicator color="#355D9B" />}
      <ImageBackground
        style={{width: '100%', height: 140}}
        source={{uri: uri}}
        imageStyle={{borderRadius: moderateScale(4)}}
        onLoadEnd={() => setLoading(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/playIcon.jpg')}
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0,
              borderColor: '#fff',
              borderRadius: 30,
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const ImageItem = ({uri}) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <ActivityIndicator color="#355D9B" />}
      <Image
        style={{
          width: '100%',
          height: 140,
          //borderWidth: 0.5,
          borderRadius: moderateScale(4),
        }}
        source={{uri: uri}}
        onLoadEnd={() => setLoading(false)}
      />
    </>
  );
};

export default function ListGalleryItems({DATA}) {
  const galleryData = DATA.map(item => {
    return {
      url: item.filePath,
      fileType: item.fileType,
      thumbnail: item.thumbnailUrl,
    };
  });
  const imageData = galleryData.filter(item => {
    if (item.fileType == 'image') {
      return item;
    }
  });

  const navigation = useNavigation();

  const _renderItem = ({item, index}) => (
    <View
      style={[
        {flex: 1, marginHorizontal: 20, marginBottom: 20},
        {marginLeft: index % 2 == 0 ? 20 : 0},
      ]}>
      <TouchableHighlight
        onPress={() => {
          if (item.fileType == 'image') {
            var videoCount = 0;
            galleryData.map((i, j) => {
              if (i.fileType == 'video' && j <= index) {
                videoCount++;
              }
            });
            navigation.navigate('ImageGalleryDisplay', {
              imageData: imageData,
              currentIndex: index - videoCount,
            });
          } else if (item.fileType == 'video') {
            navigation.navigate('VideoDisplay', {
              uri: item.url,
            });
          }
        }}
        underlayColor="white">
        {item.fileType == 'video' ? (
          <VideoItem uri={item.thumbnail} />
        ) : item.fileType == 'image' ? (
          <ImageItem uri={item.url} />
        ) : (
          <></>
        )}
      </TouchableHighlight>
      {/*  <Text style={{ textAlign: "center", marginTop: 8 }}>{item.fileType}</Text>  */}
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, paddingBottom: 40}}>
      <FlatList
        data={galleryData}
        renderItem={(item, index) => _renderItem(item, index)}
        keyExtractor={(item, index) => index}
        numColumns={2}
        style={{flex: 1}}
        contentContainerStyle={{paddingVertical: 20}}
      />
    </SafeAreaView>
  );
}
