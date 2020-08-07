const { v1: uuid } = require('uuid');
const { ApolloServer, gql } = require('apollo-server');
const { authors, books } = require('./data');

const typeDefs = gql`
  type Books {
    title: String!
    author: String!
    published: Int!
    id: ID!
    genres: [String]
  }

  type Authors {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    allAuthors: [Authors!]
    allBooks(author: String, genre: String): [Books!]
    bookCount: Int!
    authorCount: Int!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Books

    editAuthor(name: String!, setBornTo: Int!): Authors
  }
`;

const resolvers = {
  Query: {
    allAuthors: () => authors,
    allBooks: (root, args) => {
      if (args.author && args.genre) {
        const authorArr = books.filter((book) => book.author === args.author);
        return authorArr.filter((book) =>
          book.genres
            .toString()
            .toLowerCase()
            .includes(args.genre.toLowerCase())
        );
      } else if (args.author) {
        return books.filter((book) => book.author === args.author);
      } else if (args.genre) {
        return books.filter((book) =>
          book.genres
            .toString()
            .toLowerCase()
            .includes(args.genre.toLowerCase())
        );
      }
      return books;
    },
    bookCount: () => books.length,
    authorCount: () => authors.length,
  },
  Authors: {
    bookCount: (root) => {
      const totalBooks = books.filter((book) => book.author === root.name);
      return totalBooks.length;
    },
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() };
      books = books.concat(book);
      return book;
    },
    editAuthor: (root, args) => {
      const authorSearch = authors.find((author) => author.name === args.name);
      if (!authorSearch) {
        return null;
      }
      const author = { ...authorSearch, born: args.setBornTo };
      authors = authors.concat(author);
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at 4000`);
});
