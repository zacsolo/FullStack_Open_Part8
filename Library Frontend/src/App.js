import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';

import { useApolloClient } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_GENRE } from './queries';

const App = () => {
  const result = useQuery(GET_FAVORITE_GENRE);
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState('');
  const [favGenre, setFavGenre] = useState('');
  const client = useApolloClient();
  console.log('TOKEN VALUE---->', token);

  useEffect(() => {
    setToken(localStorage['user-token']);
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const handleFavoriteGenre = async () => {
    setPage('recommendBooks');
    setFavGenre(result.data.me.favoriteGenre);
  };

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

      <Books
        show={page === 'books' || page === 'recommendBooks'}
        recommend={page === 'recommendBooks' ? favGenre : 'all books'}
      />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
