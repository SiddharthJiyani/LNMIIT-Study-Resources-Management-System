import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RatingModal = ({ isOpen, onClose, resourceId, userId, onRatingSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/rate/${resourceId}/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.rating) {
            setSelectedRating(data.rating);
          }
        } else {
          console.error("Failed to fetch user rating");
        }
      } catch (error) {
        console.error("Error fetching user rating", error);
      }
    };

    if (isOpen) {
      fetchUserRating();
    }
  }, [isOpen, resourceId, userId]);

  const handleSubmitRating = async () => {
    if (selectedRating) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/rate/${resourceId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, rating: selectedRating }),
        });

        const data = await response.json();
        if (response.ok) {
          onRatingSubmitted(data.averageRating);
          onClose();
        } else {
          console.error("Failed to submit rating", data.error);
        }
      } catch (error) {
        console.error("Error submitting rating", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-zinc-200">
          Rate this Resource
        </h2>
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setSelectedRating(ratingValue)}
                  className="hidden"
                />
                <FaStar
                  size={30}
                  color={ratingValue <= (hover || selectedRating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer transition-colors"
                />
              </label>
            );
          })}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmitRating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Submit Rating
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;