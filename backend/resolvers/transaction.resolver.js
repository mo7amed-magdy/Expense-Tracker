// Import the transaction model to interact with the database
import transactionModel from './../models/transaction.model.js';

// Define the resolvers for GraphQL queries and mutations related to transactions
const transactionResolver = {
    // Define resolvers for GraphQL queries
    Query: {
        // Resolver to fetch all transactions for the authenticated user
        transactions: async (_, __, context) => { // _ and __ are placeholders for unused arguments (parent and args)
            try {
                // Check if the user is authenticated
                if (!context.getUser()) throw new Error('User not authenticated');
                
                // Get the authenticated user's ID
                const userId = await context.getUser()._id;
                
                // Find all transactions associated with the authenticated user
                const transactions = await transactionModel.find({ userId });
                
                // Return the list of transactions
                return transactions;
            } catch (error) {
                console.log("error getting transactions", error);
                throw new Error(error.message); // Throw an error if fetching transactions fails
            }
        },
        
        // Resolver to fetch a specific transaction by its ID
        transaction: async (_, { transactionId }, context) => {
            try {
                // Find the transaction by its ID
                const transaction = await transactionModel.findById(transactionId);
                
                // Throw an error if the transaction is not found
                if (!transaction) throw new Error('Transaction not found');
                
                // Return the transaction object
                return transaction;
            } catch (error) {
                console.log("error getting transaction", error);
                throw new Error(error.message); // Throw an error if fetching the transaction fails
            }
        }
    },
    
    // Define resolvers for GraphQL mutations
    Mutation: {
        // Resolver to create a new transaction
        createTransaction: async (parent, { input }, context) => {
            try {
                // Create a new transaction object with the input data and authenticated user's ID
                const newTransaction = new transactionModel({
                    userId: await context.getUser()._id,
                    ...input // Spread the input fields into the new transaction object
                });
                
                // Save the new transaction to the database
                await newTransaction.save();
                
                // Return the newly created transaction
                return newTransaction;
            } catch (error) {
                console.log("error creating transaction", error);
                throw new Error(error.message); // Throw an error if creating the transaction fails
            }
        },
        
        // Resolver to update an existing transaction
        updateTransaction: async (parent, { input }, context) => {
            try {
                // Find the transaction by its ID and update it with the new input data
                const updatedTransaction = await transactionModel.findByIdAndUpdate(input.transactionId, input, { new: true });
                
                // Throw an error if the transaction is not found
                if (!updatedTransaction) throw new Error('Transaction not found');
                
                // Return the updated transaction object
                return updatedTransaction;
            } catch (error) {
                console.log("error updating transaction", error);
                throw new Error(error.message); // Throw an error if updating the transaction fails
            }
        },
        
        // Resolver to delete an existing transaction
        deleteTransaction: async (parent, { transactionId }, context) => {
            try {
                // Find the transaction by its ID and delete it
                const deletedTransaction = await transactionModel.findByIdAndDelete(transactionId);
                
                // Throw an error if the transaction is not found
                if (!deletedTransaction) throw new Error('Transaction not found');
                
                // Return the deleted transaction object
                return deletedTransaction;
            } catch (error) {
                console.log("error deleting transaction", error);
                throw new Error(error.message); // Throw an error if deleting the transaction fails
            }
        }
    }
};

// Export the transaction resolvers for use in the GraphQL server
export default transactionResolver;
