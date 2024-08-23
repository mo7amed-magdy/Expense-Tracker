// Import necessary modules and dependencies
import { ApolloServer } from "@apollo/server"; // Apollo Server for running GraphQL server
import mergedResolvers from "./resolvers/index.js"; // Importing all resolvers
import mergedTypeDefs from "./typeDefs/index.js"; // Importing all type definitions
import { expressMiddleware } from '@apollo/server/express4'; // Middleware to connect Apollo Server with Express
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'; // Plugin for draining HTTP server connections
import express from 'express'; // Express framework
import http from 'http'; // Node.js HTTP module
import cors from 'cors'; // CORS middleware
import dotenv from "dotenv"; // Environment variable management
import { dbConnection } from "./dataBase/dbConnection.js"; // Database connection function
import passport from "passport"; // Passport.js for authentication
import session from "express-session"; // Session management middleware
import connectMongo from 'connect-mongodb-session'; // MongoDB session store
import { buildContext } from "graphql-passport"; // Helper for integrating Passport with GraphQL
import { configurePassport } from "./passport/passport.js"; // Passport configuration

// Load environment variables from .env file
dotenv.config();

// Configure Passport.js for authentication
configurePassport();

// Initialize Express application
const app = express();

// Create an HTTP server using Express
const httpServer = http.createServer(app);

// Initialize MongoDB session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB, // MongoDB URI from environment variables
  collection: 'sessions' // Collection name where sessions will be stored
});

// Handle errors from MongoDB session store
store.on("error", (err) => console.log(err));

// Configure session management with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET, // Session secret from environment variables
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not create session until something is stored
  store: store, // Use MongoDB store for session storage
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // Set cookie expiration to 7 days
    httpOnly: true, // Ensure cookie is only accessible by web server
  }
}));

// Initialize Passport.js for handling authentication
app.use(passport.initialize());
app.use(passport.session()); // Use Passport's session management

// Initialize Apollo Server with type definitions, resolvers, and plugins
const server = new ApolloServer({
  typeDefs: mergedTypeDefs, // GraphQL type definitions
  resolvers: mergedResolvers, // GraphQL resolvers
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] // Plugin to handle server shutdown gracefully
});

// Connect to the database
dbConnection();

// Start the Apollo Server
await server.start();

// Apply middleware to the Express app, including CORS, JSON parsing, and Apollo Server integration

app.use(
  cors({
    origin: "http://localhost:5173",  // Ensure no trailing slash
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(
  '/graphql',
  express.json(), // Parse incoming JSON requests
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }), // Build context for GraphQL, including Passport
  }),
);

// Start the HTTP server and listen on port 4000
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
