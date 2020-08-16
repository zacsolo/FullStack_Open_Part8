import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommended from './components/Recommended';
import { BOOK_ADDED, ALL_BOOKS } from './queries';

import { useApolloClient, useSubscription } from '@apollo/client';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState('');

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      set.map((p) => p.id).includes(object.id);
    };

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    console.log({ dataInStore }, { addedBook });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`);
      updateCacheWith(addedBook);
    },
  });

  const client = useApolloClient();

  useEffect(() => {
    setToken(localStorage['user-token']);
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
  };

  const handleFavoriteGenre = () => {
    setPage('recommend');
  };
  console.log('TOLKEN', token);
  const loggedInView = () => {
    if (token) {
      return (
        <div>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={handleFavoriteGenre}>recommend</button>
          <button onClick={handleLogout}>logout</button>
        </div>
      );
    }
    return <button onClick={() => setPage('login')}>login</button>;
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedInView()}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommended show={page === 'recommend'} />

      <NewBook show={page === 'add'} updateCacheWith={updateCacheWith} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
