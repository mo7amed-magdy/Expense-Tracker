import { gql } from "@apollo/client";

export const SIGN_UP = gql`
mutation SignUp ($input: SignUpInput! ){
    signUp(input: $input){
        _id
        username
        name
    }

}
`
export const LOG_OUT = gql`
mutation LogOut {
    logout{
        message
    }
}
`

export const LOGIN = gql`
mutation SignIn($input: SignInInput!){
    signIn(input: $input){
        _id
        name
        username
        }
        }`