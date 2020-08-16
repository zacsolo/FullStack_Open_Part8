import React from 'react';
import { useQuery } from '@apollo/client';
import { USERS_FAVORITES } from '../queries';

export default function Recommended({ show }) {
  const result = useQuery(USERS_FAVORITES);
  if (!show) {
    return null;
  }
  if (result.loading) {
    return <div>Loading...</div>;
  }
  const books = result.data.usersFavoriteBooks;
  console.log(books);
  return (
    <div>
      <h2>Book List</h2>
      <h4>Favorite Genre: </h4>
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
