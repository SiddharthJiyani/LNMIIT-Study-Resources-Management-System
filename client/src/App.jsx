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
import MyContributions from "./components/MyContributions";
import PrivateRoute from "./components/Auth/PrivateRoute";
import OpenRoute from "./components/Auth/OpenRoute";
import Approve from "./components/Approve";
import ManageCourse from "./components/ManageCourse";
import AboutDevelopers from "./components/AboutDevelopers";
import { AddYT } from "./components/AddYT";
import NotFound from "./components/NotFound";
import ForgetPassword from "./components/Auth/ForgetPassword"
// ! #### Protected and Public Routes must be implemented here ####
function App() {

  const user = JSON.parse(localStorage?.getItem("user"));
  const accountType = user?.accountType;

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
              <OpenRoute>
                <Otp />
              </OpenRoute>
            }
          />

          <Route
            path="/forget-password"
            element={
              <OpenRoute>
                <ForgetPassword />
              </OpenRoute>
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
          {/* <Route
            path="/marks-vs-grade"
            element={
              <PrivateRoute>
                <MarksVsGrade />
              </PrivateRoute>
            }
          /> */}
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
          <Route
            path="/my-contributions"
            element={
              <PrivateRoute>
                <MyContributions />
              </PrivateRoute>
            }
          />

          <Route
            path="/about-developers"
            element={
              <PrivateRoute>
                <AboutDevelopers />
              </PrivateRoute>
            }
          />

          {
            accountType === "admin" && (
              <Route
                path="/approve"
                element={
                  <PrivateRoute>
                    <Approve />
                  </PrivateRoute>
                }
              />
            )
          }
          {
            accountType === "admin" && (
              <Route
                path="/manage-course"
                element={
                  <PrivateRoute>
                    <ManageCourse/>
                  </PrivateRoute>
                }
              />
            )
          }

          {
            accountType === "admin" && (
              <Route
                path="/add-yt"
                element={
                  <PrivateRoute>
                    <AddYT/>
                  </PrivateRoute>
                }
              />
            )
          }
        
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
