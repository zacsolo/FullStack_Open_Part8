const { v1: uuid } = require('uuid');
const { UserInputError, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const Authors = require('./models/author');
const Books = require('./models/book');
const User = require('./models/user');
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Spiderman';

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      return context.currentUser;
    },
    usersFavoriteBooks: async (root, args, context) => {
      console.log('FAV BOOKS', context.currentUser);
      const bookArr = await Books.find({});
      if (context.currentUser) {
        return bookArr.filter((book) =>
          book.genres.toString().includes(context.currentUser.favoriteGenre)
        );
      }

      return bookArr;
    },
    allAuthors: async () => {
      const allAuth = await Authors.find({});
      return allAuth;
    },
    allBooks: async (root, args, context) => {
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
        return bookArr.filter((book) =>
          book.genres.toString().includes(args.genre)
        );
      }
      const allBooks = await Books.find({});
      console.log(
        'CONTEXT CURRENT USER, in all books----->',
        context.currentUser
      );
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
    bookCount: async (root) => {
      const authObj = await Authors.findOne({ _id: root._id });
      const bookObj = await Books.find({ author: authObj.id });
      return bookObj.length;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
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
        pubsub.publish('BOOK_ADDED', { bookAdded: book });
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

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

module.exports = resolvers;
