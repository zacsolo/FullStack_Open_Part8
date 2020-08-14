import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

export default function Login({ show, setToken, setPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('user-token', token);
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: { username, password } });
    setUsername('');
    setPassword('');
    setPage('authors');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>login</button>
      </form>
    </div>
  );
}
