const {buildSchema} = require('graphql');

// in type, define different mutations we want to allow
// input: data that is used as an argument
module.exports = buildSchema(`
    type Post {
        id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
        createdAt: String!
        updatedAt: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    type RootQuery {
        hello: String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`)