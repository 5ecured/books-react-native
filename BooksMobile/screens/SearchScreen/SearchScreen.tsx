import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useLazyQuery } from '@apollo/client';
import BookItem from '../../components/BookItem';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { searchQuery } from './queries';
import { parseBook } from '../../services/bookService';

export default function SearchScreen() {
  const [search, setSearch] = useState<string>('')
  const [provider, setProvider] = useState<BookProvider>('googleBooksSearch')

  // useQuery automatically runs when component mounts, or variables change etc.
  // const { data, loading, error } = useQuery(query, { variables: { q: search } })

  // In order to make a graphQL request after a manual trigger e.g. when we press a button, we use useLazyQuery
  // Pay attention to the format, its a bit different from useQuery. "runQuery" is the function we call to trigger it
  const [runQuery, { data, loading, error }] = useLazyQuery(searchQuery)

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={search}
          placeholder='Search...'
          style={styles.input}
          onChangeText={setSearch}
        />
        <Button
          title='Search'
          onPress={() => runQuery({ variables: { q: search } })}
        />
      </View>

      <View style={styles.tabs}>
        <Text
          style={provider === 'googleBooksSearch' ? { fontWeight: 'bold', color: 'royalblue' } : {}}
          onPress={() => setProvider('googleBooksSearch')}
        >
          Google Books
        </Text>
        <Text
          style={provider === 'openLibrarySearch' ? { fontWeight: 'bold', color: 'royalblue' } : {}}
          onPress={() => setProvider('openLibrarySearch')}
        >
          Open Library
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && (
        <>
          <Text>Error fetching books</Text>
          <Text>{error.message}</Text>
        </>
      )}
      <FlatList
        data={(provider === 'googleBooksSearch' ? data?.googleBooksSearch?.items : data?.openLibrarySearch?.docs) || []}
        renderItem={({ item }) => (
          <BookItem
            book={parseBook(item, provider)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gainsborough',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    alignItems: 'center'
  }
});
