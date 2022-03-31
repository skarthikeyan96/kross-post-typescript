import React from 'react';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import withApollo from 'next-with-apollo';



export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      link: new HttpLink({
        uri: `/api/graphql`,
        credentials: 'same-origin'
      }),
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
);