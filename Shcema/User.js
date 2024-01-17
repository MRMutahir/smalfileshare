import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  clientAddress: String,
  clientPort: Number,
  clientId: String,
});

const User = mongoose.model("user", UserSchema);

export { User };
