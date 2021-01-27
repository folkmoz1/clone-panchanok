import NextImage from "next/image";
import { Grid } from "@material-ui/core";
import {useEffect, useState} from "react";

export default function DisplayImage__Post ( props ) {
    const [checkWidth, setCheckWidth] = useState(false)

    const { images } = props

    const ImageLength = images.length

    const object = image => image.width > image.height ? "cover" : "contain"

    useEffect(() => {
        if (ImageLength > 1) {
            const check = images.map(img => img.width > img.height)

            setCheckWidth(!check.includes(false))
        }

    },[])

    return (
        <>
            {
                ImageLength === 1 ? (
                    <div className={"image__container"}>
                        <NextImage
                            src={images[0].url}
                            layout={'fill'}
                            objectFit={object(images[0])}
                            loading={"lazy"}
                            quality={100}
                        />
                    </div>
                )
                    : ImageLength === 2 ? (
                        <div className={`flex flex-nowrap gap-1.5 ${checkWidth && 'flex-col'}`}>
                            {
                                images.map((img, index) => (
                                    <div className={`${checkWidth ? 'w-full' : 'w-1/2'} relative`} style={{paddingBottom: checkWidth ? '40%' : '75%'}} key={index}>
                                        <NextImage
                                            src={img.url}
                                            layout={'fill'}
                                            objectFit={"cover"}
                                            loading={"lazy"}
                                            quality={100}
                                            className={"rounded"}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    ) : null
            }
            <style jsx>{`
              .image__container {
                width: 100%;
                height: 0;
                padding-bottom: 70%;
                position: relative;
                background: #000;
              }
            `}</style>
        </>
    )
}
