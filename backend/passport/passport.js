// Import necessary modules and dependencies
import passport from "passport"; // Passport.js for authentication
import bcrypt from "bcryptjs"; // Bcrypt.js for password hashing and comparison
import userModel from './../models/user.model.js'; // User model for database interaction
import { GraphQLLocalStrategy } from "graphql-passport"; // GraphQL Passport strategy for authentication

// Function to configure Passport.js
export const configurePassport = async () => {

    // Serialize user information into the session
    passport.serializeUser((user, done) => {
        
        done(null, user.id); // Save the user's ID in the session
    });

    // Deserialize user information from the session
    passport.deserializeUser(async (id, done) => {
        
        try {
            const user = await userModel.findById(id); // Retrieve the user by ID from the database
            done(null, user); // Attach the user object to the request object
        } catch (err) {
            done(err); // Handle any errors during deserialization
        }
    });

    // Define the authentication strategy using GraphQLLocalStrategy
    passport.use(new GraphQLLocalStrategy(async (username, password, done) => {
        try {
            const user = await userModel.findOne({ username }); // Find the user by username
            if (!user) {
                throw new Error("Invalid username or password"); // Throw an error if the user is not found
            }
            const isMatch = bcrypt.compareSync(password, user.password); // Compare the provided password with the hashed password
            if (!isMatch) {
                throw new Error("Invalid username or password"); // Throw an error if the password does not match
            }
            return done(null, user); // Authentication successful, return the user object
        } catch (error) {
            return done(error); // Handle any errors during authentication
        }
        
    }));
};
