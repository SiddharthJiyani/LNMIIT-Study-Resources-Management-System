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
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";

const ResourceCard = () => {
  const { resourceId } = useParams();
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
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/resource/showById/${resourceId}`,
          options
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setResource(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setLoading(false);
      }
    };

    fetchResourceData();
  }, [resourceId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col  dark:bg-zinc-900">
      <NavBar />
      <div className="flex flex-1">
        <aside className="hidden h-screen border-r bg-background md:block">
          <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6">
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Details</TableHead>
                    <TableHead>Information</TableHead>
                  </TableRow>
                </TableHeader>
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
                    <TableCell>{resource.rating || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
              <a
                href={resource.fileUrl}
                className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md transition-colors"
                download>
                Download Resource
              </a>
              <Button className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 rounded-md transition-colors">
                Rate Material
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ResourceCard;
