import {Grid, Tooltip} from "@material-ui/core";
import Image from "next/image";
import {Delete} from "@material-ui/icons";

const GridImage = (
    {
        height,
        width,
        image,
        margin,
        setShowImage,
        borderRadius,
        deletePreviewImage,
        index,
        preview
    }) => (
    <>
        <Grid
            container
            direction="row"
            justify="center"
            style={{
                height: height,
                width: width,
                borderRadius: borderRadius,
                margin: margin,
                background: `url("${image}") center/cover no-repeat`,

            }}
            onClick={() => !preview ? setShowImage(image) : {}}
            className={"w-auto relative md:cursor-pointer preview__container overflow-hidden"}
        >
            {
                preview &&
                <>
                    <span
                        className={"preview__text"}
                        onClick={() => setShowImage(image)}
                    >
                        <div className={"flex flex-col items-center gap-4 w-full delay-200"}>
                            <h3 className={"font-bold animate-ping"}>
                                Click to preview
                            </h3>
                        </div>
                    </span>
                    <Tooltip title={'ลบรูปภาพ'}>
                        <span
                            className={"preview__btn"}
                            onClick={() => {
                                deletePreviewImage(index)
                                setShowImage(null)
                            }}
                        >
                               <div className={"btn__slide"}>
                                   <Delete color={"error"}/>
                               </div>
                        </span>
                    </Tooltip>
                </>
            }

        </Grid>
        <style jsx global>{`


          .btn__slide {
            padding: .5rem 1rem;
          }

          .btn__slide p {
            opacity: 0;
          }

          .preview__btn {
            position: absolute;
            top: 10px;
            right: 0;
            z-index: 5;
            width: 30px;
            height: 40px;
            background-color: #fff;
            transition: .2s all;
            border-bottom-left-radius: 2rem;
            border-top-left-radius: 2rem;
            display: flex;
            align-items: center;
            opacity: 0;
          }

          .preview__btn:hover {
            width: 50px;
          }
          

          .preview__text {
            position: absolute;
            inset: 0;
            z-index: 2;
            width: 100%;
            background-color: rgba(76, 47, 47, .4);
            opacity: 0;
            pointer-events: none;
            display: flex;
            align-items: center;
            transition: opacity .2s;
          }

          .preview__container:hover .preview__btn,
          .preview__container:hover .preview__text {
            pointer-events: all;
            opacity: 1;
          }
        `}</style>
    </>
)


const DisplayImage = ({images, preview, setShowImage, deletePreviewImage}) => {

    const imgLength = images.length


    return (
        <>
            {
                imgLength === 1 ? (
                        preview ? (
                            <Grid container justify={"center"}>
                                <GridImage
                                    image={images[0]}
                                    height={500}
                                    width={400}
                                    setShowImage={setShowImage}
                                    borderRadius={5}
                                    deletePreviewImage={deletePreviewImage}
                                    index={0}
                                    preview={preview}
                                />
                            </Grid>
                        ) : (
                            <GridImage
                                height={500}
                                width={'100%'}
                                image={images[0]}
                                setShowImage={setShowImage}
                                deletePreviewImage={deletePreviewImage}
                                index={0}
                                preview={preview}
                            />
                        ))
                    : imgLength === 2 ? (
                        <Grid container spacing={1}>
                            {images.map((image, index) => {
                                return (
                                    <Grid item md={6} lg={6} xl={6} xs={6} sm={6} key={index}>
                                        <GridImage
                                            image={image}
                                            width={'auto'}
                                            height={350}
                                            margin={'0 0 5px 0'}
                                            borderRadius={5}
                                            setShowImage={setShowImage}
                                            deletePreviewImage={deletePreviewImage}
                                            index={index}
                                            preview={preview}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )
                    : imgLength === 3 ? (
                        <Grid container spacing={1}>
                            <Grid item md={6} lg={6} xl={6} xs={6} sm={6}>
                                <GridImage
                                    image={images[0]}
                                    height={'100%'}
                                    setShowImage={setShowImage}
                                    borderRadius={5}
                                    deletePreviewImage={deletePreviewImage}
                                    index={0}
                                    preview={preview}
                                />
                            </Grid>{" "}
                            <Grid item md={6} lg={6} xl={6} xs={6} sm={6}>
                                {images.map((image, index) =>
                                    index !== 0 ? (
                                        <GridImage
                                            image={image}
                                            width={'auto'}
                                            margin={
                                                index === 1
                                                    ? '0 0 5px 0'
                                                    : '10px 0 0 0'
                                            }
                                            height={195}
                                            borderRadius={5}
                                            setShowImage={setShowImage}
                                            deletePreviewImage={deletePreviewImage}
                                            index={index}
                                            preview={preview}
                                        />
                                    ) : null
                                )}
                            </Grid>
                        </Grid>

                    ) : imgLength === 4 ? (
                        <Grid container className={"gap-1.5"} wrap={"nowrap"}>
                            <Grid item md={preview ? 6 : 8} lg={preview ? 6 : 8} xl={preview ? 6 : 8}
                                  xs={6} sm={6}>
                                {
                                    preview ? (
                                        images.map((image, index) =>
                                            index != 2 && index != 3 ?
                                                (
                                                    <GridImage
                                                        height={200}
                                                        margin={index === 0 && '5px 0'}
                                                        image={image}
                                                        width={'auto'}
                                                        setShowImage={setShowImage}
                                                        borderRadius={5}
                                                        key={index}
                                                        deletePreviewImage={deletePreviewImage}
                                                        index={index}
                                                        preview={preview}
                                                    />
                                                ) : null
                                        )
                                    ) : (
                                        <GridImage
                                            height={'100%'}
                                            image={images[0]}
                                            borderRadius={5}
                                            setShowImage={setShowImage}
                                            deletePreviewImage={deletePreviewImage}
                                            index={0}
                                            preview={preview}
                                        />
                                    )
                                }
                            </Grid>{" "}
                            <Grid item md={preview ? 6 : 4} lg={preview ? 6 : 4} xl={preview ? 6 : 4}
                                  xs={6} sm={6}>
                                {images.map((image, index) => {
                                    const condition = preview ? index != 0 && index != 1 : index != 0

                                    return condition ? (
                                        <GridImage
                                            height={preview ? 200 : 160}
                                            margin={index === 2 && '5px 0'}
                                            image={image}
                                            setShowImage={setShowImage}
                                            borderRadius={5}
                                            key={index}
                                            deletePreviewImage={deletePreviewImage}
                                            index={index}
                                            preview={preview}
                                        />
                                    ) : null
                                })}
                            </Grid>
                        </Grid>

                    ) : null
            }
        </>
    )
}

export default DisplayImage
