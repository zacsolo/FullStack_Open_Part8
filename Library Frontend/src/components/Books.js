import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ALL_BOOKS, FIND_BY_GENRE } from '../queries';

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS);
  const [findByGenre, { loading, data }] = useLazyQuery(FIND_BY_GENRE);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genre, setGenre] = useState('');

  useEffect(() => {
    if (data) {
      setFilteredBooks(data.allBooks);
      return;
    }
  }, [data]);

  if (!show) {
    return null;
  }

  if (result.loading || loading) {
    return <div>Loading....</div>;
  }
  const books = result.data.allBooks;

  const handleFitler = (e) => {
    if (e.target.value === 'all books' || e.target.value === 'none') {
      findByGenre(books);
    }
    findByGenre({ variables: { genre: e.target.value } });
    setGenre(e.target.value);
  };

  console.log('setDataFromDB', data);

  const unfiltered = () => {
    if (filteredBooks.length < 1) {
      return (
        <div>
          <h2>Book List</h2>
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Published</th>
              </tr>
              {books.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <div>
        <h2>Book List</h2>
        <h4>Genre: {genre}</h4>
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
            {filteredBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div>
      {unfiltered()}
      <h2>Filter Books</h2>
      <select name='genres' onChange={handleFitler}>
        <option key='none'></option>
        {books.map((a) =>
          a.genres.map((el) => (
            <option key={a.title + el}>{el.toString()}</option>
          ))
        )}
        <option key='all books'>all books</option>
      </select>
    </div>
  );
};

export default Books;
