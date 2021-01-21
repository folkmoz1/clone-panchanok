import { Grid, IconButton, Dialog, Paper } from '@material-ui/core'
import {useState} from "react";
import Image from "next/image";


export default function PictureGrid( props ) {
    const [showImage, setShowImage] = useState('')

    const imgLength = props.images.length

    const displayImage = images => {
        if (imgLength === 1) {

            return (
                <>
                    {
                        props.preview ? (
                            <span className={"flex justify-center"}>
                                <Image
                                    src={images[0]}
                                    width={400}
                                    height={500}
                                    objectFit={'cover'}
                                    onClick={() => {
                                        setShowImage(images[0]);
                                    }}
                                />
                            </span>
                        ) : (
                            <Grid
                                container
                                justify="center"
                                style={{
                                    backgroundImage: `url(${images[0]}`,
                                    backgroundSize: "cover",
                                    width: "100%",
                                    height: 500,
                                    // marginLeft: 20,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                }}
                                onClick={() => {
                                    setShowImage(images[0]);
                                }}
                            ></Grid>
                        )
                    }
                </>
            )
        } else if (imgLength === 2) {
            return  (
                <Grid container spacing={1}>
                    {images.map((image, index) => {
                        return (
                            <Grid item md={6} lg={6} xl={6} xs={6} sm={6} key={index}>
                                {
                                    props.preview ? (
                                        <span className={"flex justify-center md:cursor-pointer"}>
                                            <Image
                                                src={image}
                                                width={400}
                                                height={600}
                                                objectFit={'cover'}
                                                onClick={() => {
                                                    setShowImage(image);
                                                }}
                                                className={'rounded'}
                                            />
                                        </span>
                                    ) : (
                                        <Grid item md={6} lg={6} xl={6} xs={6} sm={6} key={index}>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                style={{
                                                    backgroundImage: `url(${image}`,
                                                    width: "auto",
                                                    height: 400,
                                                    borderRadius: 5,
                                                    marginBottom: 5,
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "center",
                                                }}
                                                onClick={() => {
                                                    setShowImage(image);
                                                }}
                                            ></Grid>
                                        </Grid>
                                    )
                                }
                            </Grid>
                        );
                    })}
                </Grid>
            )
        } else if (imgLength === 3) {

            return  (
                <Grid container spacing={1}>
                    <Grid item md={6} lg={6} xl={6} xs={6} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            style={{
                                backgroundImage: `url(${images[0]}`,
                                // width: 250,
                                height: 400,
                                borderRadius: 5,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                            }}
                            onClick={() => {
                                setShowImage(images[0]);
                            }}
                        ></Grid>
                    </Grid>{" "}
                    <Grid item md={6} lg={6} xl={6} xs={6} sm={6}>
                        {images.map((image, index) =>
                            index !== 0 ? (
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    style={{
                                        backgroundImage: `url(${image}`,
                                        width: "auto",
                                        height: 195,
                                        borderRadius: 5,
                                        marginBottom: index === 1 ? 5 : 0,
                                        marginTop: index === 1 ? 0 : 10 ,
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                    }}
                                    onClick={() => {
                                        setShowImage(image);
                                    }}
                                    key={index}
                                ></Grid>
                            ) : null
                        )}
                    </Grid>
                </Grid>
            )
        } else if (imgLength === 4) {

            return (
                <>
                    <Grid container spacing={1}>
                        <Grid item md={8} lg={8} xl={8} xs={6} sm={6}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                style={{
                                    backgroundImage: `url(${images[0]}`,
                                    // width: 250,
                                    height: '100%',
                                    borderRadius: 5,
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                }}
                                onClick={() => {
                                    setShowImage(images[0]);
                                }}
                            ></Grid>
                        </Grid>{" "}
                        <Grid item md={4} lg={4} xl={4} xs={6} sm={6}>
                            {images.map((image, index) => {
                                if (index != 0) {
                                    return (
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            style={{
                                                backgroundImage: `url(${image}`,
                                                height: 160,
                                                borderRadius: 5,
                                                margin: index === 2 && "5px 0",
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                            }}
                                            onClick={() => {
                                                setShowImage(image);
                                            }}
                                            className={"w-auto"}
                                            key={index}
                                        ></Grid>
                                    )
                                }
                            })}
                        </Grid>
                    </Grid>
                </>
            )
        }
    }

    return (
        <div style={{ width: props.width || '100%', maxWidth: props.maxWidth }}>
            {displayImage(props.images)}
            {showImage && (
                <Dialog
                    scroll={"body"}
                    open={showImage ? true : false}
                    onClose={() => {
                        setShowImage(null);
                    }}
                    style={{
                        zIndex: 1999
                    }}
                >
                    <Grid container direction="row" justify="center">
                        <img style={{ maxWidth: "100%" }} src={showImage}></img>
                    </Grid>
                </Dialog>
            )}
        </div>
    )

}


