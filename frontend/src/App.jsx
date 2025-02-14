import { Navigate, Route, Routes } from "react-router-dom"
import  HomePage  from './pages/HomePage';
import  LoginPage  from './pages/LoginPage';
import  SignUpPage  from "./pages/SignUpPage.jsx";
import TransactionPage from './pages/TransactionPage';
import  NotFound  from './pages/NotFound';
import Header from "./components/ui/Header.jsx";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/queries/user.query.js";
import { Toaster } from "react-hot-toast";


function App() {
  const { loading, error, data } = useQuery(GET_AUTH_USER);

  if(loading) {
    console.log("loading");
    return null;
  }
  if(error) {
    console.log("error");
  }
  console.log(data);
  

  return (
    <>
    {data?.authUser && <Header />}
      <Routes>
      <Route path='/' element={data.authUser? <HomePage /> :<Navigate to="/login"/> } />
				<Route path='/login' element={!data.authUser? <LoginPage /> :<Navigate to="/"/> } />
				<Route path='/signup' element={!data.authUser? <SignUpPage />: <Navigate to="/"/> } />
				<Route path='/transaction/:id' element={data.authUser? <TransactionPage /> :<Navigate to="/login"/> } />
				<Route path='*' element={<NotFound />} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App
