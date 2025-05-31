import mongoose, { Document, Schema, model, models } from "mongoose";

// 1. Interface
export interface User extends Document {
  name: string;
  email: string;
  verificationCode: string;
  image: string;
  provider: string; // 'google' | 'github' | 'credentials'
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, default: "" },
    image: { type: String, default: "" },
    provider: { type: String, required: true },
    hashedPassword: { type: String, default: "" },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 3. Model
const UserModel = models.User || model<User>("User", UserSchema);
export default UserModel;
