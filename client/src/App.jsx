import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupFormDemo } from './components/SignUp'
import { Login } from './components/Login';
import { Otp } from './components/Otp';
import MyCourses from './components/MyCourses';
import MyProfile from './components/MyProfile';
import AllCourses from './components/AllCourses';
import Favourites from './components/Favourites';
import CalculateCgpa from './components/CalculateCgpa';
import MarksVsGrade from './components/MarksVsGrade';
import Contribute from './components/Contribute';
import Feedback from './components/Feedback';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignupFormDemo />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sendotp' element={<Otp />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-courses' element={<MyCourses />} />
          <Route path='/all-courses' element={<AllCourses />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path='/calculate-cgpa' element={<CalculateCgpa />} />
          <Route path='/marks-vs-grade' element={<MarksVsGrade />} />
          <Route path='/contribute' element={<Contribute />} />
          <Route path='/feedback' element={<Feedback />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
