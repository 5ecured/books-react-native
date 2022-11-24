import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import MyBooksProvider from './context/MyBooksProvider';

const API_KEY = 'rioreal::stepzen.net+1000::3f6f45bfd7c4c19bdb3898bf857c441f77050688038b24aea14dcbc889b7df2d'

const client = new ApolloClient({
  uri: "https://rioreal.stepzen.net/api/hopping-bear/__graphql",
  headers: {
    Authorization: `Apikey ${API_KEY}`
  },
  cache: new InMemoryCache()
})

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <MyBooksProvider>
            <Navigation colorScheme={colorScheme} />
          </MyBooksProvider>
        </ApolloProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
