import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav";
import "./Home.css";

const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const jwt_token = localStorage.getItem("jwt_token");

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  // get friends from backend:
  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Friendz/v1/userin/friends",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${jwt_token}`,
            },
          }
        );
        if (response.ok) {
          console.log("Friends fetched successfully!");
          const data = await response.json();
          setFriends(data.friends);
        }
      } catch (error) {
        console.error("Error fetching friends: ", error);
      }
    };
    getFriends();
  }, [jwt_token]);

  const handleUnfriend = async (friendId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Friendz/v1/userin/friends/${friendId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Unfriended user successfully!");
        setFriends(friends.filter((friend) => friend.id !== friendId));
      } else {
        console.log("Error unfriending user: ", response.statusText);
      }
    } catch (error) {
      console.error("Error unfriending user: ", error);
    }
  };

  return (
    <div>
      <MainNav />
      <div className="home-page">
        <h2>Your Friends</h2>
        <div className="friends-grid">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <img
                src={
                  friend.imageData && friend.imageData.data
                    ? `data:${
                        friend.imageData.contentType
                      };base64,${bufferToBase64(friend.imageData.data)}`
                    : "/profile-image.png" // Provide a default image URL or handle the case when profile_pic is not available
                }
                alt={friend.username}
                className="friend-pic"
              />
              <div className="friend-info">
                <h3>{friend.username}</h3>
                <button
                  className="unfriend-btn"
                  onClick={() => handleUnfriend(friend.id)}
                >
                  Unfriend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
