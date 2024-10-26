import React from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'


const ResourceCard = () => {
    const {resourceId} = useParams();

    const [resource, setResource] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResourceData = async () => {
            try {
                const token = localStorage.getItem("token");

                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/showById/${resourceId}`, options);
                if (!response.ok) throw new Error("Network response was not ok");

                const data = await response.json();
                setResource(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchResourceData();
    }, []);

    if (loading) return <div>Loading...</div>; //replace with preloader
    // console.log(resource);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
    <NavBar />
    <div className="flex flex-1">
        <aside className="hidden h-full border-r bg-background md:block">
            <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6">
        <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{resource.title}</h2>
            {/* <p><strong>Course Name:</strong> {resource.course.name}</p>
            <p><strong>Semester:</strong> {resource.course.semester}</p>
            <p><strong>Department:</strong> {resource.course.department}</p> */}
            <p><strong>Resource Type:</strong> {resource.fileType}</p>
            <p><strong>Uploaded By:</strong> {resource.uploadedBy.firstName} {resource.uploadedBy.lastName}</p>
            <p><strong>Uploaded on:</strong> {new Date(resource.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(resource.updatedAt).toLocaleString()}</p>
            <br />
            <p><strong>Rating:</strong> {resource?.rating}</p>
            
            {resource.fileType === 'notes' && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Notes Details</h3>
                </div>
            )}
            {resource.fileType === 'slides' && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Slides Details</h3>
                </div>
            )}
            {resource.fileType === 'pyqs' && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Previous Year Questions</h3>
                </div>
            )}
            {resource.fileType === 'assignment' && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Assignment Details</h3>
                </div>
            )}
            {resource.fileType === 'other' && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Other Resource</h3>
                </div>
            )}
            
            {/* currently for dev phase no description field while uploading but handle this design as well */}
            <p>{resource?.description}</p>

            {/* Download button*/}
            <a 
                href={resource.fileUrl} 
                className="mt-4 inline-block text-blue-600 hover:underline" 
                download
            >
                Download Resource
            </a>
            <br />
            <button className='bg-slate-400'>rate material</button>
            <h2>P.S: fix this design, implemented the structure and backend connection do not disturb those</h2>
        </div>
        </main>
    </div>
</div>
  )
}

export default ResourceCard