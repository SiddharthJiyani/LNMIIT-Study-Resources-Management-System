import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function MyProfile() {
  const [editProfile, setEditProfile] = useState(false);
  const navigate = useNavigate();

  const profileData = JSON.parse(localStorage.getItem("user"));
  // console.log(profileData);
  const [editableData, setEditableData] = useState({
    firstName: profileData?.firstName,
    lastName: profileData?.lastName,
    email: profileData?.email,
    department: profileData?.department,
    accountType: profileData?.accountType,
    semester: profileData?.semester,
    cgpa: profileData?.cgpa,
  });
  const [oldState, setOldState] = useState({ ...editableData });

  const handleCancel = () => {
    setEditableData(oldState);
    setEditProfile(false);
  };
  const handleEditToggle = () => {
    setOldState(editableData);
    setEditProfile(!editProfile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const getProfileDetails = async () => {
  //   try {
  //     const response = await fetch(`${BACKEND}/api/profile/`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setEditableData(data);
  //     } else {
  //       console.error("Failed to fetch profile details:", data.message || "Unknown error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile details:", error);
  //   }
  // };

  // useEffect(() => {
  //   getProfileDetails();
  // }, []);

  const handleSave = async () => {
    try {
      // Check for valid CGPA
      if (editableData.cgpa < 0 || editableData.cgpa > 10) {
        alert("CGPA should be between 0 and 10");
        throw new Error("Invalid CGPA");
      }
      
      // Retrieve existing data from localStorage
      const currentProfile = JSON.parse(localStorage.getItem("user")) || {};
  
      // Merge current profile data with updated editableData
      const updatedProfile = { ...currentProfile, ...editableData };
  
      // Send only the updated fields to the backend
      const response = await fetch(`${BACKEND}/api/profile/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
        credentials: "include",
      });
  
      const result = await response.json();
      if (response.ok) {
        // Update localStorage with the new data
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        setEditProfile(false); // Exit edit mode
      } else {
        console.error("Failed to update profile:", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1 bg-zinc-100">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <div className="mx-auto max-w-[28rem]">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <Avatar className="w-28 h-28 mb-4 mx-auto rounded-full shadow-sm border-2 border-gray-300">
                  <AvatarImage
                    src={editableData?.profilePhoto || "/default-avatar.png"}
                  />
                  <AvatarFallback className="text-xl font-semibold text-gray-700">
                    {editableData?.firstName[0] + editableData?.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                {editProfile ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editableData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editableData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Semester</label>
                      <input
                        type="text"
                        name="semester"
                        value={editableData.semester}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CGPA</label>
                      <input
                        type="text"
                        name="cgpa"
                        value={editableData.cgpa}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button
                        onClick={handleSave}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition duration-200"
                        disabled={editableData.cgpa < 0 || editableData.cgpa > 10}>
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 rounded-md transition duration-200">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">
                      {editableData?.firstName} {editableData?.lastName}
                    </h3>
                    <p className="text-sm">{editableData?.email}</p>
                    {editableData?.department && (
                      <Badge className="hover:bg-gray-100 bg-gray-100 text-black font-medium px-3 py-1 mt-2 rounded-md">
                        {editableData?.department}
                      </Badge>
                    )}
                    <span>{" "}</span>
                    <Badge className="hover:bg-gray-100 bg-gray-100 text-black font-medium px-3 py-1 mt-2 rounded-md">
                      {editableData?.accountType === "student" ? "Student" : "Admin"}
                    </Badge>
                    <p className="text-sm text-black mt-2">
                      {/* <strong>Department:</strong> {editableData?.department} | */}
                      <strong> Semester:</strong> {editableData?.semester} |
                      <strong> CGPA:</strong> {editableData?.cgpa == '0' ? 'N/A' : editableData?.cgpa}
                    </p>
                    <Button
                      onClick={handleEditToggle}
                      className="mt-6 w-full bg-slate-950 hover:bg-gray-800 text-white font-medium py-2 rounded-md transition duration-200">
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
