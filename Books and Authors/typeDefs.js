const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Query {
    me: User
    allAuthors: [Author!]
    allBooks(author: String, genre: String): [Book!]
    bookCount: Int!
    authorCount: Int!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    addAuthor(name: String!, born: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

module.exports = typeDefs;
