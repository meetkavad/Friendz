import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav";
import "./Request.css";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const jwt_token = localStorage.getItem("jwt_token");

  // Function to convert buffer to Base64 string
  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  // Fetch friend requests from backend
  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Friendz/v1/userin/requests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${jwt_token}`,
            },
          }
        );
        if (response.ok) {
          console.log("Friend requests fetched successfully!");
          const data = await response.json();
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch friend requests");
        }
      } catch (error) {
        console.error("Error fetching requests: ", error);
      }
    };
    getRequests();
  }, []);

  // Handle friend request :
  const handleRequest = async (friendId, action) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Friendz/v1/userin/requests/${friendId}?action=${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
        }
      );
      if (response.ok) {
        setRequests(requests.filter((request) => request.id !== friendId));
      } else {
        console.error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request: ", error);
    }
  };

  return (
    <div>
      <MainNav />
      <div className="request-page">
        <h2>Friend Requests</h2>
        <div className="requests-grid">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="request-card">
                <img
                  src={
                    request.imageData && request.imageData.data
                      ? `data:${request.contentType};base64,${bufferToBase64(
                          request.imageData.data
                        )}`
                      : "/profile-image.png" // Default image if no profile pic
                  }
                  alt={request.username}
                  className="request-pic"
                />
                <div className="request-info">
                  <h3>{request.username}</h3>
                  <button
                    className="accept-btn"
                    onClick={() => handleRequest(request.id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleRequest(request.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No friend requests at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
