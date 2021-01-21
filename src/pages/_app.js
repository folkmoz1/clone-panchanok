import { useEffect, useState } from 'react'
import ApolloProvider from "../apollo/ApolloProvider";
import {AuthProvider} from "../context/auth"
import {MessageProvider} from "../context/message";
import Cookies from 'cookies'
import { gql } from '@apollo/client'
import request from "graphql-request";
import Header from "../components/Header";

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

MyApp.getInitialProps = async ({ ctx, Component}) => {
    const { req, res } = ctx


    let user = null,
        token,
        pageProps


    if (req) {
        const cookies = new Cookies(req, res)

        token = cookies.get('token')

        console.log(token)

        try {
            const resp = await request(process.env.BACKEND_URI, ME, {
                token
            })

            const { me } = resp

            user = me

        } catch (err) {
            console.log(err)
            user = null
        }

    }

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx})

        pageProps.isSSR = !!req
    }

    return { pageProps, $initialState: {$user: user, $token: token } }
}

export default MyApp
