import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import { useParams, useNavigate } from 'react-router-dom'


//add searchbar

export const CourseList = () => {
    const {courseId} = useParams();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const token = localStorage.getItem("token");

                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/showByCourse/${courseId}`, options);
                if (!response.ok) throw new Error("Network response was not ok");

                const data = await response.json();
                setResources(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleRowClick = (resourceId) => {
        navigate(`/resources/${resourceId}`);
    };

    if (loading) return <div>Loading...</div>; //replace with preloader
    // console.log(resources);
    

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
    <NavBar />
    <div className="flex flex-1">
        <aside className="hidden h-full border-r bg-background md:block">
            <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6">
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            </div> */}
        <div className="w-full p-4">
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">S. No.</th>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-left">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {resources?.length > 0 ? (
                        resources.map((resource, index) => (
                            <tr key={resource._id} className="hover:bg-gray-100" onClick={() => handleRowClick(resource._id)} >
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{resource.title}</td>
                                <td className="py-2 px-4 border-b">{resource.ratings || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 text-center">No resources available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </main>
    </div>
</div>
  )
}
