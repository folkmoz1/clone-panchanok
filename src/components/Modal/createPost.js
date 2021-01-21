import {Paper} from "@material-ui/core";
import {useState} from "react";
import PictureGrid from "../PictureGrid";
import {CloseRounded, ImageRounded} from "@material-ui/icons";
import Image from "next/image";

export const fileToDataUri = (image) => {
    return new Promise((res) => {
        const reader = new FileReader();
        const {type, name, size} = image;
        reader.addEventListener("load", () => {
            res(reader.result);
        });
        reader.readAsDataURL(image);
    });
};

const CreatePost = ({ loading, setOpen }) => {
    const [images, setImages] = useState([])
    const [error, setError] = useState({status: false, message: ''})
    const [previewImage, setPreviewImage] = useState([])

    const handlePicture = async (e) => {
        if (previewImage.length >= 4 || images.length >= 4) {
            setError({
                status: true,
                message: 'maximum picture select.'
            })
            return
        }

        const files = e.target.files


        if (files.length > 0 && files.length <= 4 && files.length + previewImage.length <= 4) {
            if (error) {
                setError({
                    status: false,
                    message: ''
                })
            }

            const newImagesPromise = []
            for (let i = 0; i < files.length; i++) {
                setImages(pic => [...pic, files[i]])
                newImagesPromise.push(fileToDataUri(files[i]))
            }

            const newImages = await Promise.all(newImagesPromise)
            setPreviewImage(prev => [...prev, ...newImages])

        } else {
            setError({
                status: true,
                message: 'maximum picture select.'
            })
            return
        }
    }


    return (
        <>
            <Paper elevation={0}>
                <div className={"flex flex-col pt-6 px-4 md:py-10 md:px-16 relative"}>
                    <div className={"text-center font-bold text-2xl "}>
                        <h1>สร้างโพสต์</h1>
                    </div>
                    <hr className={"my-2"}/>
                    <div>
                        <div className={'w-auto'}>
                            <div
                                className={`content-editable break-all bg-gray-200 rounded-2xl outline-none p-1 px-4 font-sans inline-block whitespace-pre-wrap cursor-text `}
                                contentEditable
                                data-placeholder={'บอกอะไรหน่อยสิ...'}
                                suppressContentEditableWarning
                            />
                        </div>
                    </div>
                    <div className={`my-2 flex justify-center`} style={{minHeight: 300}}>
                        {
                            images.length > 0 ? (
                                <PictureGrid images={previewImage} preview={true} maxWidth={'100%'} />
                            ) : (
                                <div className={"mx-auto"}>
                                    <Image
                                        src={'/images/svg/svg--photos.svg'}
                                        width={300}
                                        height={300}
                                        alt={'demo picture'}
                                        objectFit={"contain"}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <hr className={"my-2"}/>
                    <div className={"flex"}>
                        <span className={"w-full"}>
                            <input
                                multiple
                                type="file"
                                id={'upload-image'}
                                className={'d-none'}
                                onChange={handlePicture}
                            />
                            <label htmlFor={'upload-image'}>
                                <span
                                    type={"button"}
                                    className={`text-center md:cursor-pointer px-12 py-2 bg-gray-700  w-full font-bold uppercase  rounded hover:bg-gray-900`}
                                >
                                    <ImageRounded className={"text-white"} />
                                </span>
                            </label>
                        </span>
                    </div>
                    <span
                        className={'close--btn'}
                        onClick={() => setOpen(false)}
                    >
                        <CloseRounded color={"disabled"} fontSize={"large"} />
                    </span>
                </div>
            </Paper>
            <style jsx>{`
              .content-editable:empty:before {
                    content: attr(data-placeholder);
                    color: rgba(0, 0, 0, 0.42);
                }
                
                .close--btn {
                position: absolute;
                top: 12px;
                right: 10px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s background-color;
              }

              .close--btn:active {
                background-color: #fcfcfc;
              }
            `}</style>
        </>
    )
}

export default CreatePost
