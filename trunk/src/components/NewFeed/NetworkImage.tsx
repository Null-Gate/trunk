import React, { useState } from 'react';
import {
    Image,
    Dimensions
} from 'react-native';

import { useEffect } from 'react';

//helper function
import { calculateImageDimensions, ImageDimensions, calculateAspectRatioHeight } from '../../utils/helper';

const windowWidth = Dimensions.get('window').width;

type NetworkImage = {
    imageUrl: string,
    maxHeight?: number
}

const NetworkImage = ({ 
    imageUrl,
    maxHeight
}: NetworkImage) => {
    const [aspectRatio, setAspectRatio] = useState<number>(0);

    useEffect(() => {
        calculateImageDimensions({ uri: imageUrl })
            .then((dimensions: ImageDimensions) => {
                // Successfully obtained image dimensions
                const aspectRatioHeight = calculateAspectRatioHeight(dimensions.width, dimensions.height, windowWidth);
                setAspectRatio(aspectRatioHeight);
            })
            .catch((error: Error) => {
                // Error occurred while fetching image dimensions
                console.error('Error getting image dimensions:', error);
            });
    }, []);

    return (
        <Image
            source={{ uri: imageUrl }}
            width={windowWidth}
            height={aspectRatio > maxHeight ? maxHeight : aspectRatio}
        />
    );
};

export default NetworkImage;
