import { gql } from '@apollo/client';

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      # bookCount THIS VALUE CAN'T POPULATE YET
      id
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

export const FIND_BY_GENRE = gql`
  query findByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

export const USERS_FAVORITES = gql`
  query {
    usersFavoriteBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

export const UPDATE_BORN = gql`
  mutation changeBorn($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`;
export const LOGIN = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
