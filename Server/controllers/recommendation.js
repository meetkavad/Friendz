// const KNN = require("ml-knn");
// const UserModel = require("../models/UserModel");

// // Helper function to calculate Euclidean distance
// const calculateDistance = (vectorA, vectorB) => {
//   return Math.sqrt(
//     vectorA.reduce(
//       (sum, value, index) => sum + Math.pow(value - vectorB[index], 2),
//       0
//     )
//   );
// };

// const friendRecommendations = async (userId, k = 5) => {
//   // Step 1: Fetch the user data
//   const currentUser = await UserModel.findById(userId).populate("friends");

//   if (!currentUser) {
//     return {
//       msg: "User not found",
//     };
//   }

//   // Step 2: Get all users excluding the current user
//   const allUsers = await UserModel.find({ _id: { $ne: userId } });

//   // Step 3: Create data for KNN (Features: Interests, Groups, Mutual Friends)
//   const userData = [];
//   const targetUsers = [];

//   for (let user of allUsers) {
//     let mutualFriends = currentUser.friends.filter((friend) =>
//       user.friends.includes(friend._id)
//     ).length;

//     // Encode the features (interests, groups, mutual friends)
//     const features = [
//       ...encodeFeatures(user.interests, currentUser.interests), // interests similarity
//       ...encodeFeatures(user.groups, currentUser.groups), // groups similarity
//       mutualFriends, // mutual friends count
//     ];

//     userData.push(features);
//     targetUsers.push(user._id);
//   }

//   // Step 4: Calculate distances between currentUser and all other users
//   const currentUserFeatures = [
//     ...encodeFeatures(currentUser.interests, currentUser.interests),
//     ...encodeFeatures(currentUser.groups, currentUser.groups),
//     0, // Current user has 0 mutual friends with self
//   ];

//   const distances = userData.map((userFeatures, index) => {
//     return {
//       userId: targetUsers[index],
//       distance: calculateDistance(currentUserFeatures, userFeatures),
//     };
//   });

//   // Step 5: Sort distances and get the top K nearest neighbors
//   distances.sort((a, b) => a.distance - b.distance); // Ascending order (smallest distance first)

//   const nearestNeighbors = distances
//     .slice(0, k)
//     .map((neighbor) => neighbor.userId);

//   // Step 6: Fetch details of the top K recommended users
//   const recommendedDetails = await UserModel.find({
//     _id: { $in: nearestNeighbors },
//   }).select("username profile_pic");

//   return recommendedDetails;
// };

// // Encoding helper functions
// const encodeFeatures = (userFeatures, currentUserFeatures) => {
//   return userFeatures.map((feature) =>
//     currentUserFeatures.includes(feature) ? 1 : 0
//   );
// };

// module.exports = { friendRecommendations };
