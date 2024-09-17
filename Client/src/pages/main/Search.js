import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav";
import "./Search.css";

const SearchPage = () => {
  const [searchUser, setSearchUser] = useState([]); // For search results
  const [recommendations, setRecommendations] = useState([]); // Static recommended users
  const [searchTerm, setSearchTerm] = useState(""); // Search term input value

  const jwt_token = localStorage.getItem("jwt_token");

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  // Function to handle real-time search
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term state

    if (value === "") {
      setSearchUser([]); // Clear search results if input is empty
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/Friendz/v1/userin/search?user=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchUser(data.users);
      } else {
        console.log("Some Error Occurred");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle the follow action
  const handleFollow = async (friendId) => {
    try {
      const resposne = await fetch(
        `http://localhost:5000/Friendz/v1/userin/sendRequest/${friendId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
        }
      );
      if (resposne.ok) {
        console.log("Request Sent successfully!");
      } else {
        console.log("Error unfriending user: ", resposne.statusText);
      }
    } catch (error) {
      console.error("Error unfriending user: ", error);
    }
  };

  // Fetch recommended users (static)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Friendz/v1/userin/recommendations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${jwt_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.recommendations);
          setRecommendations(data.recommendations);
        } else {
          console.log("Failed to fetch recommendations");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <MainNav />

      <div className="search-page">
        <h2>Search for Friends</h2>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="search-results">
          {searchTerm && (
            <>
              <h3>Search Results</h3>
              <div className="users-grid">
                {searchUser.length > 0 ? (
                  searchUser.map((user) => (
                    <div key={user.id} className="user-card">
                      <img
                        src={
                          user.imageData && user.imageData.data
                            ? `data:${user.contentType};base64,${bufferToBase64(
                                user.imageData.data
                              )}`
                            : "/profile-image.png"
                        }
                        alt={user.username}
                        className="user-pic"
                      />
                      <div className="user-info">
                        <h3>{user.username}</h3>
                        <button
                          className="follow-btn"
                          onClick={() => handleFollow(user.id)}
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No users found</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="recommended-users">
          <h3 className="recommend-title">Recommended Friends</h3>
          <div className="users-grid">
            {recommendations.map((user) => (
              <div key={user.id} className="user-card">
                <img
                  src={
                    user.imageData && user.imageData.data
                      ? `data:${user.contentType};base64,${bufferToBase64(
                          user.imageData.data
                        )}`
                      : "/profile-image.png"
                  }
                  alt={user.username}
                  className="user-pic"
                />
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <button
                    className="follow-btn"
                    onClick={() => handleFollow(user.id)}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
