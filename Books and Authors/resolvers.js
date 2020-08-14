const { v1: uuid } = require('uuid');
const { UserInputError, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');

const Authors = require('./models/author');
const Books = require('./models/book');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Spiderman';

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    allAuthors: () => Authors.find({}),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const authorArr = await Books.find({ author: args.author });
        return authorArr.filter((book) =>
          book.genres
            .toString()
            .toLowerCase()
            .includes(args.genre.toLowerCase())
        );
      } else if (args.author) {
        return Books.find({ author: args.author });
      } else if (args.genre) {
        const bookArr = await Books.find({}); //This is LAZY! change to make query directly for info
        return bookArr.find((book) =>
          book.genres
            .toString()
            .toLowerCase()
            .includes(args.genre.toLowerCase())
        );
      }
      const allBooks = await Books.find({});

      return allBooks;
    },
    bookCount: () => Books.collection.countDocuments(),
    authorCount: () => Authors.collection.countDocuments(),
  },
  Author: {
    name: async (root) => {
      const authorObj = await Authors.findOne({ _id: root._id });
      return authorObj.name;
    },
    born: async (root) => {
      const authorObj = await Authors.findOne({ _id: root._id });
      return authorObj.born;
    },
    bookCount: (root) => Books.find({ author: root.name }).countDocuments(),
  },

  Mutation: {
    //--ADD BOOK, IF AUTHOR DOESN'T EXIST IT CREATES A NEW ONE--------
    addBook: async (root, args, context) => {
      const foundAuthor = await Authors.findOne({ name: args.author });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      //--Check if Author Exists Already-----
      if (foundAuthor) {
        const book = new Books({
          ...args,
          author: foundAuthor,
          id: uuid(),
        });
        return await book.save();
      }
      //--Makes new Author if name doesnt exist yet-----
      try {
        const newAuth = new Authors({ name: args.author });
        await newAuth.save();
        const book = new Books({
          ...args,
          author: newAuth,
          id: uuid(),
        });
        return await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args.author,
        });
      }
    },
    //------------------------------------------------------------------------
    editAuthor: async (root, args, context) => {
      //FINDS AUTHOR AND EDITS BORN DATE--------------
      let authorSearch = await Authors.findOne({ name: args.name });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      authorSearch.born = args.setBornTo;
      console.log(authorSearch.born);

      //--If no author is found, return null-------
      if (!authorSearch) {
        console.log('Authors Doesnt Exists ->', args.name);
        return null;
      }
      //--Updates Author in MongoDB-------
      return await Authors.findByIdAndUpdate(authorSearch.id, authorSearch, {
        new: true,
      });
    },
    //------------------------------------------------------------------------
    addAuthor: async (root, args) => {
      const author = new Authors({ name: args.name, born: args.born });
      return await author.save();
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        return await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      console.log(user);
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      console.log(userForToken);
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

module.exports = resolvers;
