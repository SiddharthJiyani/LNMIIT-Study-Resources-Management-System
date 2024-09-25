import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupFormDemo } from './components/SignUp'
import { Login } from './components/Login';
import { Otp } from './components/Otp';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignupFormDemo/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/sendotp' element={<Otp/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
