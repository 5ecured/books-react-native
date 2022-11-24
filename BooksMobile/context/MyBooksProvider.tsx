import { createContext, useContext, ReactNode, useState } from "react";

type MyBooksContextType = {
    onToggleSave: (book: Book) => void
    isBookSaved: (book: Book) => boolean
    savedBooks: Book[]
}

const MyBooksContext = createContext<MyBooksContextType>({
    onToggleSave: () => {},
    isBookSaved: () => false,
    savedBooks: []
})

type Props = {
    children: ReactNode
}

const MyBooksProvider: React.FC<Props> = ({ children }) => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([])

    const areBooksTheSame = (a: Book, b: Book) => {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    const isBookSaved = (book: Book) => {
        // we use json stringify to compare the Book objects by value, instead of by reference. so now we compare the strings
        return savedBooks.some(savedBook => areBooksTheSame(savedBook, book))
    }

    const onToggleSave = (book: Book) => {
        if (isBookSaved(book)) {
            // remove from savedbooks
            setSavedBooks(books => books.filter(savedBook => !areBooksTheSame(savedBook, book)))
        } else {
            // add to savedbooks
            setSavedBooks(books => [book, ...books])
        }
    }

    return (
        <MyBooksContext.Provider value={{ onToggleSave, isBookSaved, savedBooks }}>
            {children}
        </MyBooksContext.Provider>
    )
}

export const useMyBooks = () => useContext(MyBooksContext)

export default MyBooksProvider