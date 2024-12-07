import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import RatingModal from "./RatingModal"; // Import the RatingModal component

const ResourceCard = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setRatingModalOpen] = useState(false); // Modal state
  const [averageRating, setAverageRating] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))._id;

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
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/resource/showById/${resourceId}`,
          options
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setResource(data);
        setAverageRating(data.averageRating); // Set the initial average rating
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setLoading(false);
      }
    };

    fetchResourceData();
  }, [resourceId]);

  const handleRatingSubmitted = (newAverageRating) => {
    setAverageRating(newAverageRating); // Update the average rating in the component
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col dark:bg-zinc-900">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[217px]">
          <Card className="max-w-lg mx-auto rounded-xl shadow-lg border dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-center">
                {resource?.description || "No description available."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>{resource.fileType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Uploaded By</TableCell>
                    <TableCell>
                      {resource.uploadedBy?.firstName}{" "}
                      {resource.uploadedBy?.lastName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Uploaded On</TableCell>
                    <TableCell>
                      {new Date(resource.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>
                      {new Date(resource.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rating</TableCell>
                    <TableCell>
                      {averageRating || "N/A"} ({resource.ratings.length})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
              <a
                href={resource.fileUrl}
                target="_blank"
                className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md transition-colors"
                download
              >
                Download Resource
              </a>
              <Button
                onClick={() => setRatingModalOpen(true)}
                className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 rounded-md transition-colors"
              >
                Rate Material
              </Button>
            </CardFooter>
          </Card>

          {/* Rating Modal */}
          {isRatingModalOpen && (
            <RatingModal
              isOpen={isRatingModalOpen}
              onClose={() => setRatingModalOpen(false)}
              resourceId={resourceId}
              userId={userId}
              onRatingSubmitted={handleRatingSubmitted}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ResourceCard;
