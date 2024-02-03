import Marker, { Position, ImageFormat } from "react-native-image-marker"
import { ImageSource } from 'expo-image';

const wmImage = require('./assets/wm.png');

export const imageWithMark = async (bgImage: string | ImageSource | null) => {
    if (!bgImage)
        return null;


    const url = await Marker.markImage({
        backgroundImage: {
            src: bgImage,
        },
        watermarkImages: [{
            src: wmImage,
            alpha: 0.5,
            position: {
                position: Position.center,
            },
        }],
        saveFormat: ImageFormat.jpg
    })

    return `file:${url}`;
};