import {useEffect, useState} from 'react'
import { NProgress } from '../../utils/NProgress'
import Cookies from 'cookies'
import {gql} from '@apollo/client'
import Header from "../components/Header";
import axios from "axios";
import Head from "next/head";
import { Router } from 'next/dist/client/router';

import ApolloProvider from "../apollo/ApolloProvider";
import {AuthProvider} from "../context/auth"
import {MessageProvider} from "../context/message";

import '../../styles/globals.css'


Router.events.on("routeChangeStart", () => {
    NProgress.start()
});
Router.events.on("routeChangeComplete", () => {
    NProgress.done()
});
Router.events.on("routeChangeError", () => {
    NProgress.done()
});



function MyApp({ Component, pageProps, $initialState }) {
    const [initialState, setInitialState] = useState($initialState)

    useEffect(() => {
        NProgress.start()
        if (initialState.$token) {
            localStorage.setItem('token', initialState.$token)
        } else {
            localStorage.removeItem('token')
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
                          
                          #nprogress {
                            z-index: 999999;
                            position: fixed;
                            top: 0;
                            left: 0;
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

                          #nprogress .bar {
                            background: #69f6ed !important;
                          }

                        `}</style>
                    </>

                </MessageProvider>
            </AuthProvider>
        </ApolloProvider>
  )
}

MyApp.getInitialProps = async ({ ctx, Component, router }) => {
    const {req, res} = ctx

    let user = null,
        token = null,
        pageProps = {}

    if (req) {

        const cookie = new Cookies(req, res)

        const getToken = cookie.get('token')

        if (getToken) {
            try {


                const resp = await axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/me`, null, {
                    headers: {
                        cookie: getToken
                    }
                })

                const {me} = resp.data

                token = getToken

                user = me

            } catch (e) {
                cookie.set('token')
            }
        }
    }


    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx, isSsr: !!req})
        pageProps.isSsr = !!req
    }


    return { pageProps, $initialState : {$user: user, $token: token}}
}

export default MyApp
