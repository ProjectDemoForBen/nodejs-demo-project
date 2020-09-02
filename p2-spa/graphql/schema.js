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
        createdAt: String!
        updatedAt: String!
    }
    
    type PostsData {
        posts: [Post!]!
        totalItems: Int!
    }
    
    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean!
        updateStatus(id:ID!, status: String!): Boolean!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        getPosts(page: Int!): PostsData!
        getPost(id: ID!): Post!
        getUserStatus(id: ID!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`)