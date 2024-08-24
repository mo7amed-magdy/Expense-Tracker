// Import necessary modules and dependencies
import userModel from "../models/user.model.js"; // Importing the User model for interacting with the database
import bcrypt from 'bcryptjs'; // Importing bcryptjs for password hashing

// Define the resolvers for GraphQL queries and mutations related to users
const userResolver = {
    // Define resolvers for GraphQL queries
    Query: {
        // Resolver to authenticate the current user
        authUser: async (parent, args, context) => {
            try {
                let user = await context.getUser(); // Get the authenticated user from the context
                return user; // Return the authenticated user
            } catch (error) {
                throw new Error(error.message); // Throw an error if authentication fails
            }
        },
        // Resolver to fetch a user by their ID
        user: async (parent, args) => {
            try {
                const user = await userModel.findById(args.userId); // Find the user by ID from the database
                return user; // Return the user object
            } catch (error) {
                throw new Error(error.message); // Throw an error if fetching the user fails
            }
        }
    },
  
    // Define resolvers for GraphQL mutations
    Mutation: {
        // Resolver to sign up a new user
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input; // Destructure input fields
                // Check if all required fields are provided
                if (!username || !name || !password || !gender) {
                    throw new Error('All fields are required');
                }
                // Check if the username already exists in the database
                const existingUser = await userModel.findOne({ username });
                if (existingUser) {
                    throw new Error('Username already exists');
                }
                // Hash the user's password
                const hashedPassword = bcrypt.hashSync(password, 8);
                // Generate profile picture URLs based on the user's gender
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
                // Create a new user object and save it to the database
                const newUser = new userModel({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
                });
                await newUser.save(); // Save the new user to the database
                await context.login(newUser); // Log the user in by saving their session
                return newUser; // Return the new user object
            } catch (error) {
                throw new Error(error.message); // Throw an error if the sign-up process fails
            }
        },
        
        // Resolver to sign in an existing user
        signIn: async (_, { input }, context) => {
            try {
                const { username, password } = input; // Destructure input fields
                // Check if both username and password are provided
                if (!username || !password) {
                    throw new Error('All fields are required');
                }
                // Authenticate the user using the "graphql-local" strategy
                const { user } = await context.authenticate("graphql-local", { username, password });
                await context.login(user); // Log the user in by saving their session
                return user; // Return the authenticated user object
            } catch (err) {
                throw new Error(err.message); // Throw an error if the sign-in process fails
            }
        },
        
        // Resolver to log out the current user
        logout: async (_, args, context) => {
            try {
                await context.logout(); // Log the user out by clearing their session
                console.log("logout");
                
                context.req.session.destroy((err) => {
                    if (err) {
                        console.log("error in logout ", err);
                        throw new Error(err.message); // Throw an error if session destruction fails
                    }
                });
                    context.res.clearCookie("connect.sid"); // Clear the session cookie
                    return { message: "Logout successfully" }; // Return a success message
            } catch (err) {
                console.log("error in logout ", err);
                throw new Error(err.message); // Throw an error if the logout process fails
            }
        }
    }
}

// Export the user resolvers for use in the GraphQL server
export default userResolver;
