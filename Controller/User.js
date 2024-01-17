import { User } from "../Shcema/User.js";

async function getUser(req, res) {
  try {
    // Find all users in the User collection
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { getUser };
