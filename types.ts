import { ImageSource } from 'expo-image';

export type ImageTypes = {
    uri: string | ImageSource | null,
    width?: number,
    height?: number
  }