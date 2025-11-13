import { Schema, model, HydratedDocument } from "mongoose";

interface DbUser {
  _id: string;
  userName: string,
  email: string,
  displayName: string,
  passwordDigest: string,
  allowRefreshTokensCreatedAfter: Date,
  groups: string[],
  friends: string[],
  incomingFriendRequests: string[],
  chompScore: number,
}
const userSchema = new Schema({
      _id: { type: String, required: true },
      userName: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      displayName: { type: String, required: true },
      passwordDigest: { type: String, required: true },
      allowRefreshTokensCreatedAfter: { type: Date, required: true },
      groups: [String],
      friends: [String],
      incomingFriendRequests: [String],
      chompScore: { type: Number, required: true },
    }, { timestamps: true }
);
export const UserModel = model("User", userSchema);
export type UserDocument = HydratedDocument<DbUser>;

interface DbPool {
    _id: string;
    name: string;
    owner: string;
    members: string[];
    balance: number;
}
const poolSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  members: [String],
  balance: { type : Number, required: true },
});
export const PoolModel = model("Pool", poolSchema);
export type PoolDocument = HydratedDocument<DbPool>;
