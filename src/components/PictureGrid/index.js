import {Dialog, Grid} from '@material-ui/core'
import {useState} from "react";
import DisplayImage from "./displayImage";


export default function PictureGrid( props ) {
    const [showImage, setShowImage] = useState('')


    return (
        <>
            <div style={{width: props.width || '100%', maxWidth: props.maxWidth}}>
                <DisplayImage
                    preview={props.preview}
                    deletePreviewImage={props.deletePreviewImage}
                    setShowImage={setShowImage}
                    images={props.images}
                />
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


