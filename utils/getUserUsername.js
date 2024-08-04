
const userMap = new Map();

// Function to generate a random username
const generateRandomUsername = () => {
  return `User_${Math.floor(Math.random() * 10000)}`;
};

// Function to get username based on userId
const getUsername = (userId) => {
  if (userMap.has(userId)) {
    return userMap.get(userId);
  } else {
    const randomUsername = generateRandomUsername();
    userMap.set(userId, { username: randomUsername });
    return randomUsername;
  }
};

module.exports = {
  getUsername
};
