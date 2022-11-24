import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import BookItem from '../components/BookItem';
import { useState } from 'react';

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen() {
  const [search, setSearch] = useState<string>('')

  // useQuery automatically runs when component mounts, or variables change etc.
  // const { data, loading, error } = useQuery(query, { variables: { q: search } })

  // In order to make a graphQL request after a manual trigger e.g. when we press a button, we use useLazyQuery
  // Pay attention to the format, its a bit different from useQuery. "runQuery" is the function we call to trigger it
  const [runQuery, { data, loading, error }] = useLazyQuery(query)

  return (
    <View style={styles.container}>
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

      {loading && <ActivityIndicator />}
      {error && (
        <>
          <Text>Error fetching books</Text>
          <Text>{error.message}</Text>
        </>
      )}
      <FlatList
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => (
          <BookItem book={{
            image: item.volumeInfo.imageLinks?.thumbnail,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            isbn: item.volumeInfo.industryIdentifiers[0].identifier
          }} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
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
  }
});
