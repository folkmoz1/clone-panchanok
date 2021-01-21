import React from 'react'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider as Provider,
    createHttpLink,
    split,
    HttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const isClient = process.browser

let httpLink = createHttpLink({
    uri: process.env.BACKEND_URI,
    credentials: 'include'
})

const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem('token')


    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});



httpLink = authLink.concat(httpLink)

const wsLink = isClient ?
    new WebSocketLink({
        uri: process.env.WS_URI,
        options: {
            reconnect: true,
            connectionParams: {
                Authorization: isClient ? `Bearer ${localStorage.getItem('token')}` : null
            },
            inactivityTimeout: 1000,
            reconnectionAttempts: 10
        },
    }) : null

export const splitLink = isClient && localStorage.getItem('token') ?
    split(
        ({ query }) => {
            const definition = getMainDefinition(query)
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            )
        },
        wsLink,
        httpLink
    ) : httpLink

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    ssrMode: true,
    credentials: 'include'
})

export default function ApolloProvider(props) {
    return <Provider client={client} {...props} />
}
