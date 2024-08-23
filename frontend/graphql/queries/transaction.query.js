import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
query GetTransactions{
    transactions {
        _id
        description
        paymentType
        category
        amount
        date
        location
    }
}
`
export const GET_SINGLE_TRANSACTION = gql`
query GetTransaction($id: ID! ){
    transaction(transactionId:$id){
        _id
        description
        paymentType
        category
        amount
        date
        location
    }
}

`