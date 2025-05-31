import mongoose, { Document, Schema, model, models } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  verificationCode: string;
  image: string;
  provider: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, default: "" },
    image: { type: String, default: "" },
    provider: { type: String, required: true, default: "Credentials" },
    password: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model<User>("User", UserSchema);
export default UserModel;
