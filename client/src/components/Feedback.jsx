import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Feedback() {
    const [subject, setSubject] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [subType, setSubType] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !feedbackType || !subType || !description) {
            setMessage("Please enter all required fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND}/api/feedback/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subject, feedbackType, subType, description }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                setTimeout(() => navigate("/home"), 2000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error submitting feedback.");
            }
        } catch (error) {
            setMessage("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const subTypeOptions = {
        website: ["Feature Request", "Bug Report", "Other"],
        resource: ["Wrong Resource", "Irrelevant Content", "Other"],
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <NavBar />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
                    <Card className="max-w-xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-center text-xl font-semibold">
                                Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
                                />
                                <select
                                    value={feedbackType}
                                    onChange={(e) => {
                                        setFeedbackType(e.target.value);
                                        setSubType(""); // Reset sub-type when feedback type changes
                                    }}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                                    <option value="" disabled>
                                        Select Feedback Type
                                    </option>
                                    <option value="website">Website Related</option>
                                    <option value="resource">Resource Related</option>
                                </select>
                                {feedbackType && (
                                    <select
                                        value={subType}
                                        onChange={(e) => setSubType(e.target.value)}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                                        <option value="" disabled>
                                            Select Sub-Type
                                        </option>
                                        {subTypeOptions[feedbackType].map((type) => (
                                            <option key={type} value={type.toLowerCase()}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows="4"
                                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 resize-none"
                                />
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full text-white rounded-md">
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </Button>

                            {message && (
                                <div
                                    className={`mt-4 flex items-center text-sm px-4 py-3 rounded-md shadow-md transition-colors duration-300 ${message.includes("successfully")
                                        ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-800 dark:text-green-200"
                                        : "bg-red-100 text-red-700 border border-red-300 dark:bg-red-800 dark:text-red-200"
                                        }`}>
                                    {message.includes("successfully") ? (
                                        <AiOutlineCheckCircle className="mr-2" size={18} />
                                    ) : (
                                        <AiOutlineExclamationCircle className="mr-2" size={18} />
                                    )}
                                    <p>{message}</p>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </main>
            </div>
        </div>
    );
}
