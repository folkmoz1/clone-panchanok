import {Dialog, Grid} from '@material-ui/core'
import {useState} from "react";
import displayImage from "./displayImage";


export default function PictureGrid( props ) {
    const [showImage, setShowImage] = useState('')


    return (
        <>
            <div style={{width: props.width || '100%', maxWidth: props.maxWidth}}>
                {displayImage(props.images, props, setShowImage)}
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
                            <img style={{maxWidth: "100%"}} src={showImage}></img>
                        </Grid>
                    </Dialog>
                )}
            </div>
        </>
    )

}


