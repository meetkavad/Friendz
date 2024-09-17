import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav";
import "./Profile.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    profilePic: null,
    contentType: "",
  });
  const [isEditing, setIsEditing] = useState({
    username: false,
    bio: false,
  });

  const jwt_token = localStorage.getItem("jwt_token");

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Friendz/v1/userin/profile",
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
          const user = data.user;
          console.log(user);

          // Ensure that profilePic is a valid React child (e.g., a URL string)
          const profilePic =
            user.profilePic && user.profilePic.data
              ? `data:${user.profilePic.contentType};base64,${bufferToBase64(
                  user.profilePic.data
                )}`
              : "/default-profile.png";

          setProfile({
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePic: profilePic,
            contentType: user.profilePic ? user.profilePic.contentType : "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
      }
    };
    fetchProfile();
  }, [jwt_token]);

  // Handle updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile((prev) => ({ ...prev, profilePic: e.target.files[0] }));
  };

  const toggleEditing = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: profile.username,
      bio: profile.bio,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/Friendz/v1/userin/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log("Profile text updated successfully!");
      } else {
        console.log("Error updating profile text.");
      }
    } catch (error) {
      console.error("Error updating profile text: ", error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profile.profilePic) {
      formData.append("profilePic", profile.profilePic);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/Friendz/v1/userin/profile/pic",
        {
          method: "PATCH",
          headers: {
            Authorization: `${jwt_token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Profile picture updated successfully!");
      } else {
        console.log("Error updating profile picture.");
      }
    } catch (error) {
      console.error("Error updating profile picture: ", error);
    }
  };

  return (
    <div>
      <MainNav />
      <div className="profile-page">
        <h2>Your Profile</h2>
        <form onSubmit={handleTextSubmit}>
          {/* Profile Picture */}
          <div className="profile-pic-container">
            <img
              src={
                profile.profilePic instanceof File
                  ? URL.createObjectURL(profile.profilePic)
                  : profile.profilePic
              }
              alt="Profile"
              className="profile-pic"
            />
            <input type="file" name="profilePic" onChange={handleFileChange} />
            <button type="button" onClick={handleImageSubmit}>
              Update Profile Picture
            </button>
          </div>

          {/* Username */}
          <div className="profile-field">
            <label>Username:</label>
            {isEditing.username ? (
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.username}</span>
            )}
            <button type="button" onClick={() => toggleEditing("username")}>
              {isEditing.username ? "Save" : "Edit"}
            </button>
          </div>

          {/* Email (non-editable) */}
          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>

          {/* Bio */}
          <div className="profile-field">
            <label>Bio:</label>
            {isEditing.bio ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profile.bio}</p>
            )}
            <button type="button" onClick={() => toggleEditing("bio")}>
              {isEditing.bio ? "Save" : "Edit"}
            </button>
          </div>

          <button type="submit" className="update-btn">
            Update Profile Text
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
