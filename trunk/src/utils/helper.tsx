import { Image, ImageURISource } from 'react-native';

export interface ImageDimensions {
  width: number;
  height: number;
}

export const calculateImageDimensions = (imageUrl: ImageURISource): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    if (imageUrl.uri) {
      Image.getSize(
        imageUrl.uri,
        (width, height) => {
          const dimensions: ImageDimensions = { width, height };
          resolve(dimensions);
        },
        (error) => {
          reject(`Failed to get image dimensions: ${error}`);
        }
      );
    } else {
      reject('Invalid image URL');
    }
  });
};


