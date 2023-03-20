import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "hello",
    userId: "2",
  },
  {
    id: "2",
    text: "Bye",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "Lim",
    lastName: "HanByoul",
  },
  {
    id: "2",
    firstName: "eee",
    lastName: "dddd",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers Called");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const userCheck = users.find((user) => user.id === userId);
      if (!userCheck) throw new Error("User is not ");

      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return null;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      // root인자(Object)에서 firstName과 lastName을 추출한다
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`서버 🔥${url}`);
});
