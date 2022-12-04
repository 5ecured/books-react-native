import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import MyBooksProvider from './context/MyBooksProvider';

const client = new ApolloClient({
  uri: "https://rioreal.stepzen.net/api/hopping-bear/__graphql",
  headers: {
    Authorization: `Apikey ${process.env.REACT_APP_API_KEY}`
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
