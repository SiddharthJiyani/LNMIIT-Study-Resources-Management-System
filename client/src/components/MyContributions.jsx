import React from 'react'
import NavBar from './NavBar';
import SideBar from './SideBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyContributions = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchUserResources = async () => {
          try {
            const token = localStorage.getItem("token");
    
            const options = {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/user/${user._id}`, options);
            if (!response.ok) throw new Error("Failed to fetch resources");
    
            const data = await response.json();
            setResources(data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching user resources:", error);
            setLoading(false);
          }
        };
    
        fetchUserResources();
      }, []);
    
    //   const handleUpdate = (resourceId) => {
        
    //   };
    
      if (loading) return <div>Loading...</div>;
      console.log(resources);
      

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
    <NavBar />
    <div className="flex flex-1">
      <aside className="hidden h-full border-r bg-background md:block">
        <SideBar />
      </aside>
      <main className="flex-1 p-4 md:p-6">
      <div className="w-full p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Uploaded Resources</h2>
        <div className="overflow-hidden rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left font-medium text-gray-700">S. No.</th>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Title</th>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Status</th>
                </tr>
            </thead>
            <tbody>
                {resources?.resources.length > 0 ? (
                resources.resources.map((resource, index) => (
                    <tr key={resource._id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 border-b text-gray-700">{index + 1}</td>
                    <td className="py-3 px-6 border-b text-gray-700">{resource.title}</td>
                    <td className="py-3 px-6 border-b">
                        <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            resource.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                        >
                        {resource.isApproved ? "Approved" : "Pending"}
                        </span>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="3" className="py-6 text-center text-gray-500">
                    No resources uploaded
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
      </main>
    </div>
  </div>
  )
}

export default MyContributions