import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupFormDemo } from "./components/Auth/SignUp";
import { Login } from "./components/Auth/Login";
import { Otp } from "./components/Auth/Otp";
import MyCourses from "./components/MyCourses";
import MyProfile from "./components/MyProfile";
import AllCourses from "./components/AllCourses";
import Favourites from "./components/Favourites";
import CalculateCgpa from "./components/CalculateCgpa";
import MarksVsGrade from "./components/MarksVsGrade";
import Contribute from "./components/Contribute";
import Feedback from "./components/Feedback";
import { CourseList } from "./components/CourseList";
import ResourceCard from "./components/ResourceCard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import OpenRoute from "./components/Auth/OpenRoute";
// ! #### Protected and Public Routes must be implemented here ####
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <OpenRoute>
                <SignupFormDemo />
              </OpenRoute>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="/verifyotp"
            element={
              <PrivateRoute>
                <Otp />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <PrivateRoute>
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-courses"
            element={
              <PrivateRoute>
                <AllCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <PrivateRoute>
                <Favourites />
              </PrivateRoute>
            }
          />
          <Route
            path="/calculate-cgpa"
            element={
              <PrivateRoute>
                <CalculateCgpa />
              </PrivateRoute>
            }
          />
          <Route
            path="/marks-vs-grade"
            element={
              <PrivateRoute>
                <MarksVsGrade />
              </PrivateRoute>
            }
          />
          <Route
            path="/contribute"
            element={
              <PrivateRoute>
                <Contribute />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <PrivateRoute>
                <CourseList />
              </PrivateRoute>
            }
          />
          <Route
            path="/resources/:resourceId"
            element={
              <PrivateRoute>
                <ResourceCard />
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
