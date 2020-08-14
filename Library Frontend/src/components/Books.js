import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = ({ show, recommend }) => {
  const result = useQuery(ALL_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genre, setGenre] = useState('');
  console.log('recommend props', recommend);

  useEffect(() => {
    if (recommend !== 'all books') {
      const newArr = books.filter((book) =>
        book.genres.toString().includes(recommend)
      );
      setFilteredBooks(newArr);
      setGenre(recommend);
    }
  }, [recommend]);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading....</div>;
  }
  const books = result.data.allBooks;

  const handleFitler = (e) => {
    const newArr = books.filter((book) =>
      book.genres.toString().includes(e.target.value)
    );
    setFilteredBooks(newArr);
    setGenre(e.target.value);
  };

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
