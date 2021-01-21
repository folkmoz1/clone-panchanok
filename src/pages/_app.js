import { useEffect, useState } from 'react'
import ApolloProvider from "../apollo/ApolloProvider";
import {AuthProvider} from "../context/auth"
import {MessageProvider} from "../context/message";
import Cookies from 'cookies'
import { gql } from '@apollo/client'
import request from "graphql-request";
import Header from "../components/Header";
import axios from "axios";

import '../../styles/globals.css'
import Head from "next/head";


const ME = gql`
    query ME($token: String) {
        me(token: $token) 
        {
            id
            username
            firstName
            lastName
            image
            email
        }
    }
`

function MyApp({ Component, pageProps, $initialState }) {
    const [initialState, setInitialState] = useState($initialState)

    useEffect(() => {
        if (initialState.$token) {
            localStorage.setItem('token', initialState.$token)
        }
    },[])

  return (
        <ApolloProvider>
            <AuthProvider user={initialState.$user}>
                <MessageProvider>

                    <Head>
                        <title>panchanok | home</title>
                    </Head>

                    <>
                        <div id={'main'}>
                            <Header />
                            <div className="content__body">
                                <Component {...pageProps} initialState={initialState} />
                            </div>
                        </div>
                        <style jsx global>{`
                          #__next {
                            overflow-x: hidden;
                          }

                          .content__body {
                            padding-top: 70px;
                            max-width: 1280px;
                            width: 100%;
                            min-height: calc(100vh);
                          }

                          #main {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;
                            min-height: 100vh;
                          }
                        `}</style>
                    </>

                </MessageProvider>
            </AuthProvider>
        </ApolloProvider>
  )
}

MyApp.getInitialProps = async ({ ctx, Component, router }) => {
    const { req, res } = ctx

    let user, token, pageProps = {}, err

    if (req) {

        const cookie = new Cookies(req, res)

        try {
            const getToken = cookie.get('token')

            token = getToken

            const resp = await axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/me`,null,{
                headers: {
                    cookie: getToken
                }
            })

            const { me } = resp.data

            user = me

        }  catch (e) {
            user = null
            err = e.message
        }

    }


    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx, isSsr: !!req})
        pageProps.isSsr = !!req
    }


    return { pageProps, $initialState : {$user: user, $token: token, $err: err}}
}

export default MyApp
