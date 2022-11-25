import { createContext, useContext, ReactNode, useState } from "react";

type MyBooksContextType = {
    onToggleSaved: (book: Book) => void
    isBookSaved: (book: Book) => boolean
    savedBooks: Book[]
}

const MyBooksContext = createContext<MyBooksContextType>({
    onToggleSaved: () => { },
    isBookSaved: () => false,
    savedBooks: []
})

type Props = {
    children: ReactNode
}

const MyBooksProvider: React.FC<Props> = ({ children }) => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([])

    const areBooksTheSame = (a: Book, b: Book): boolean => {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    const isBookSaved = (book: Book): boolean => {
        // we use json stringify to compare the Book objects by value, instead of by reference. so now we compare the strings
        return savedBooks.some(savedBook => areBooksTheSame(savedBook, book))
    }

    const onToggleSaved = (book: Book) => {
        if (isBookSaved(book)) {
            // remove from savedbooks
            setSavedBooks(books => books.filter(savedBook => !areBooksTheSame(savedBook, book)))
        } else {
            // add to savedbooks
            setSavedBooks(books => [...books, book])
        }
    }

    return (
        <MyBooksContext.Provider value={{ onToggleSaved, isBookSaved, savedBooks }}>
            {children}
        </MyBooksContext.Provider>
    )
}

export const useMyBooks = () => useContext(MyBooksContext)

export default MyBooksProvider