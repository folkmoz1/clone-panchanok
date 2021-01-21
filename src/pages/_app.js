import { useEffect, useState } from 'react'
import ApolloProvider from "../apollo/ApolloProvider";
import {AuthProvider} from "../context/auth"
import {MessageProvider} from "../context/message";
import { parse } from 'cookie'
import { gql } from '@apollo/client'
import { request } from "graphql-request";
import App from "next/app";
import Header from "../components/Header";

import '../../styles/globals.css'
import {Head} from "next/document";


const ME = gql`
    query ME ($token: String!) {
        me (token: $token)
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

function MyApp({ Component, pageProps, $initialState, client }) {
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

MyApp.getInitialProps = async context => {
    const { ctx: { req, res }, Component } = context

    const cookie = req ? parse(req.headers.cookie || '') : ''

    let user = null,
        token = null


    if (cookie.token) {
        try {

            const resp = await request(process.env.BACKEND_URI, ME, {
                token: cookie.token
            })

            user = resp.me
            token = cookie.token
        } catch (err) {
            user = null
            token = null
        }

    }

    const pageProps = await App.getInitialProps(context)

    pageProps.isSSR = !!req

    return { $initialState: {$user: user, $token: token }, ...pageProps }
}

export default MyApp
