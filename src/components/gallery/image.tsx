import { getImageProps } from 'next/image'
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import {FadeInAnimation} from './animation';
import { Fade } from '@mui/material';
/*
next/image: https://nextjs.org/docs/pages/api-reference/components/image
 
*/

type ImageWrapperProps = {
  src: string;
}

export const ImageWrapper: React.FC<ImageWrapperProps> = ({src}) => {
    const { props } = getImageProps({
        src: src,
        alt: "Gallery",
        width: 1200,
        height: 1200,
        // placeholder: "blur",
    });

    return (   
        <FadeInAnimation>
            <img {...props} />
        </FadeInAnimation>
    )
}
// blur
