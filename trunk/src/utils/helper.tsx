import { Image, ImageURISource } from 'react-native';

export interface ImageDimensions {
    width: number;
    height: number;
}

export const calculateImageDimensions = (imageUrl: ImageURISource): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
        Image.getSize(imageUrl.uri, (width, height) => {
            const dimensions: ImageDimensions = { width, height };
            resolve(dimensions);
        }, (error) => {
            reject(error);
        });
    });
}

export const calculateAspectRatioHeight = (originalWidth: number, originalHeight: number, desiredWidth: number): number => {
    return (desiredWidth * originalHeight) / originalWidth;
}
