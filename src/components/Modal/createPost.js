import {Paper} from "@material-ui/core";
import {useEffect, useRef, useState} from "react";
import PictureGrid from "../PictureGrid";
import {CloseRounded, ImageRounded} from "@material-ui/icons";
import Image from "next/image";
import {useAuthState} from "../../context/auth";
import {gql, useMutation} from "@apollo/client";
import { NProgress } from '../../../utils/NProgress'
import {GET_POSTS} from "../../pages";

const CREATE_POST = gql`
    mutation CREATE_POST($images: [ImageFileInput]! $desc: String!) {
        createPost (
            images: $images
            desc: $desc
        ) {
            success
            message
        }
    }
`

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



const CreatePost = ({ setOpen, setSSC }) => {
    const [images, setImages] = useState([])
    const [error, setError] = useState({status: false, message: ''})
    const [previewImage, setPreviewImage] = useState([])
    const [uploaded, setUploaded] = useState([])

    const [createPost, { loading:createLoading }  ] = useMutation(CREATE_POST, {
        refetchQueries: [
            {
                query: GET_POSTS
            }
        ]
    })

    const inputRef = useRef()

    const desc = inputRef.current?.innerText

    const { user } = useAuthState()

    const uploadImage = async (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'uploadImage')
        data.append('timestamp', `${Date.now()}`)

        const resp = await fetch('https://api.cloudinary.com/v1_1/panchanok/image/upload',{
            method: 'POST',
            body: data
        })

        const { public_id, url } = await resp.json()

        setUploaded(prev => [...prev, {public_id, url}])

        return
    }

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

    const deletePreviewImage = index => {
        if (error) setError({
            status: false,
            message: error.message
        })
        setPreviewImage(previewImage.filter((img, i) => i !== index))
        setImages(images.filter((img, i) => i !== index))
    }

    const submitForm = async (e) => {
        e.preventDefault()
        if (desc === '' || images.length < 0) return
        try {
            NProgress.start()
            await images.map(file => uploadImage(file))

        } catch (e) {
            NProgress.done()
            setError({
                status: true,
                message: 'อ๊ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะครับ!'
            })
            console.log(e)
        }
    }

    useEffect(() => {
        const uploadLength = uploaded.length

        const fetcher = async () => {
            try {

                const resp = await createPost({variables: {
                    images: uploaded,
                    desc
                }})
                setSSC(true)
                setOpen(false)

            } catch (e) {
                NProgress.done()
                setError({
                    status: true,
                    message: 'อ๊ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะครับ!'
                })
                console.log(e)
            }
        }

        if ( uploadLength > 0 && uploadLength === previewImage.length ) {
            fetcher()
        }


    },[uploaded])


    return (
        <>
            <Paper elevation={0} component={"form"} onSubmit={submitForm}>
                <div className={"flex flex-col pt-6 px-4 md:py-10 md:px-16 relative"}>
                    <div className={"text-center font-bold text-2xl "}>
                        <h1>สร้างโพสต์</h1>
                    </div>
                    <hr className={"my-2"}/>
                    <div className={"flex gap-4"}>
                        <div className={"rounded-50p overflow-hidden"} style={{width: 37, height: 37}}>
                            <Image
                                src={user.image}
                                width={37}
                                height={37}
                                objectFit={"cover"}
                                alt={user.username}
                                loading={"eager"}
                            />
                        </div>
                        <div className={'w-auto mt-1'}>
                            <div
                                className={`content-editable break-all bg-gray-200 rounded-2xl outline-none p-1 px-4 font-sans inline-block whitespace-pre-wrap cursor-text `}
                                contentEditable
                                data-placeholder={'บอกอะไรหน่อยสิ...'}
                                suppressContentEditableWarning
                                ref={inputRef}
                            />
                        </div>
                    </div>
                    <div className={`my-2 flex justify-center`} style={{minHeight: 300}}>
                        {
                            images.length > 0 ? (
                                <PictureGrid
                                    images={previewImage}
                                    preview={true}
                                    maxWidth={'100%'}
                                    deletePreviewImage={deletePreviewImage}
                                />
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
                    <div className={"flex justify-end items-center gap-4 h-10"}>
                        <span>
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
                        <span>
                            <button
                                disabled={false}
                                className={"bg-green-400 px-4 py-2 text-white rounded hover:bg-green-500"}
                            >
                                สร้างโพสต์
                            </button>
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
