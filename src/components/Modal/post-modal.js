import { CSSTransition } from "react-transition-group";
import NextImage from "next/image";
import {ArrowBackIosRounded, ArrowForwardIosRounded} from "@material-ui/icons";
import {useState} from "react";

export default function PostModal({ post }) {
    const [currentImage, setCurrentImage] = useState(0)

    const {desc, createdAt, actions, id: postId, images} = post

    const ImageLength = images.length > 1

    const sizeImageWidth = ImageLength ? 700 : 700

    const sizeImageHeight = ImageLength ? 700 : 700

    const handleImage = side => {

        if (side === 'next' && currentImage + 1 <= images.length) {
            setCurrentImage(currentImage +1 )
        } else if (side === 'prev' && currentImage - 1 >= 0) {
            setCurrentImage(currentImage - 1)
        }


    }

    const checkWidthHeight = (w, h) => w > h ? true : false

    return (
        <>
            <div className={"w-full flex flex-col md:flex-row"}>
                <div className={`w-full flex relative justify-center ${ImageLength ? 'md:w-2/3' : 'md:w-1/2'} image__wrapper`}>
                    {
                        images.length > 1 && currentImage !== 0 &&
                        <span
                            className={'left__arrow md:cursor-pointer'}
                            onClick={() => handleImage('prev')}
                        >
                            <ArrowBackIosRounded fontSize={"large"} />
                        </span>
                    }
                    <div className={'overflow-hidden'}>
                        <ul
                            style={{ transform: `translate3d(-${currentImage}00%, 0px, 0px)`, transition: '500ms all ease', maxWidth: 700}}
                            className={"relative flex flex-nowrap"}>
                            {
                                images.map((img, index) => {
                                    const result = checkWidthHeight(img.width, img.height)

                                    return (
                                            <li
                                                key={index}
                                                className={"w-full flex-grow-0 flex justify-center flex-shrink-0 flex-basis-auto max-w-full h-full px-2"}>
                                                <NextImage
                                                    src={img.url}
                                                    width={result ? 700 : 600}
                                                    height={result ? 700 : 600}
                                                    objectFit={"contain"}
                                                    quality={100}
                                                    loading={"eager"}
                                                />
                                            </li>
                                    )
                                    }
                                )
                            }
                        </ul>
                    </div>
                    {
                        images.length > 1 && currentImage !== images.length - 1 &&
                        <span
                            className={'right__arrow md:cursor-pointer'}
                            onClick={() => handleImage('next')}
                        >
                        <ArrowForwardIosRounded fontSize={"large"} />
                    </span>
                    }
                    <span className={'total--picture text-gray-200'}>
                                            {`${currentImage + 1}/${images.length}`}
                    </span>
                </div>
                <div className={`w-full h-full absolute top-2/3 md:top-0 right-0 bg-white  ${ImageLength ? 'md:w-1/3' : 'md:w-1/2'}`}>
                    <div>
                        hello
                    </div>
                </div>
            </div>
            <style jsx>{`
              .fade--slide-enter {
                opacity: 0;
                transform: translateX(-100%);
              }

              .fade--slide-enter-active {
                opacity: 1;
                transform: translateX(0);
                transition: all 300ms;
              }
              
              .total--picture {
                position: absolute;
                bottom: 20px;
                left: 50%;
                color: #fff;
                font-size: 1rem;
              }

              .left__arrow {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 70px;
                color: #fff;
                transition: all .2s;
                opacity: 0;
                z-index: 4;
              }

              .right__arrow {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                justify-content: flex-end;
                display: flex;
                align-items: center;
                width: 70px;
                color: #fff;
                transition: all .2s;
                opacity: 0;
                z-index: 4;
              }

              .image__wrapper:hover .left__arrow,
              .image__wrapper:hover .right__arrow {
                opacity: 1;
              }
            `}</style>
        </>
    )
}
