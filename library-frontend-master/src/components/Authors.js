import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, UPDATE_BORN } from '../queries';

const Authors = ({ show }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const result = useQuery(ALL_AUTHORS);
  const [changeBorn] = useMutation(UPDATE_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading....</div>;
  }

  const authors = result.data.allAuthors;

  const updateAuthor = (e) => {
    e.preventDefault();
    console.log('NAME__', name);
    console.log('NUMBER__', number);
    changeBorn({ variables: { name, setBornTo: Number(number) } });
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={updateAuthor}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '180px',
          marginTop: '10px',
        }}>
        <label htmlFor='name'>Name</label>

        <select name='name' onChange={(e) => setName(e.target.value)}>
          {authors.map((auth) => (
            <option key={auth.id} value={auth.name}>
              {auth.name}
            </option>
          ))}
        </select>

        <label htmlFor='born'>Born</label>
        <input
          type='number'
          name='born'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button type='submit' style={{ marginTop: '10px' }}>
          update author
        </button>
      </form>
    </div>
  );
};

export default Authors;
