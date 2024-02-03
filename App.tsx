//imports
import React, { useState } from 'react';
import { ImageTypes } from './types';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image as RnImage
} from 'react-native';

import {
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';

import { imageWithMark } from './WatermarkTest';
import { Image, ImageSource } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';

//save temp file to device
const saveToDevice = async (item: string) => {
  const asset = await MediaLibrary.createAssetAsync(item);
  return asset;
}

//default background image
const bgImage = require('./assets/bg-default.jpg');

export default function App() {

  //get default image details
  const defaultSource = RnImage.resolveAssetSource(bgImage);
  const { uri, width, height } = defaultSource;

  //various variables
  const [background, setBackground] = useState<ImageTypes>({ uri, width, height });
  const [withWatermark, setWithWatermark] = useState<ImageTypes | null>(null);
  const [disableWatermarkButton, setDisableWatermarkButton] = useState<boolean>(false);

  //pick image from device storage
  async function pickImage() {
    const response = await launchImageLibraryAsync({
      quality: 0.5,
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: false,
      selectionLimit: 1,
    });

    if (response.canceled) {
      console.log('User cancelled photo picker');
    } else {

      const asset = response.assets?.[0];
      const { uri, width, height } = asset;
      setBackground({ uri, width, height });
      setWithWatermark(null);
      setDisableWatermarkButton(false)
    }
  }

  //add watermark to current background image
  const addWatermark = async () => {
    if (background?.uri) {

      const wMarked = await imageWithMark(background.uri);

      if (wMarked) {
        //only reliable way to get correct image dimensions
        const asset = await saveToDevice(wMarked);
        const { uri, width, height } = asset;
        /*************************/
        setWithWatermark({ uri, width, height });
        setDisableWatermarkButton(true)
      }

    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.pressableStyle} onPress={pickImage}><Text style={styles.pressableTextStyle}>Pick image</Text></Pressable>
        <Pressable disabled={disableWatermarkButton} style={[styles.pressableStyle, { opacity: disableWatermarkButton ? 0.5 : 1 }]} onPress={addWatermark}><Text style={styles.pressableTextStyle}>Add mark</Text></Pressable>
      </View>
      <View style={styles.expand}>
        {background && <View style={[styles.expand, { backgroundColor: '#eee' }]}>
          <Image
            source={background?.uri}
            style={styles.imageStyle}
            contentFit={'contain'}
            transition={500}
          />
          <View style={styles.infoContainerStyle}><Text style={styles.centerStyle}>{`w/o watermark: w:  ${background.width}, h:  ${background.height}`}</Text></View>
        </View>}
      </View>
      <View style={styles.expand}>
        {withWatermark && <View style={[styles.expand, { backgroundColor: '#eee' }]}>
          <Image
            source={withWatermark?.uri}
            style={styles.imageStyle}
            contentFit={'contain'}
            transition={800}
          />
          <View style={styles.infoContainerStyle}><Text style={styles.centerStyle}>{`with watermark: w:  ${withWatermark.width}, h:  ${withWatermark.height}`}</Text></View>
        </View>}
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  expand: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginVertical: 10
    // alignItems:'center'
  },
  container: {
    flex: 1,
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  pressableStyle: {
    backgroundColor: 'cornflowerblue',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 1000,
    width: '40%',
    marginHorizontal: 5
  },
  pressableTextStyle: {
    color: '#fff',
    textAlign: 'center'
  },
  imageStyle: {
    flex: 1
  },
  infoContainerStyle: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10
  },
  centerStyle: {
    textAlign: 'center'
  },

});

