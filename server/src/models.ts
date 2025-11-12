import { Schema, model, Types, HydratedDocument } from "mongoose";

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

interface DbGroup {
    group_id: number;
    name: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    balance: number;
}

const groupSchema = new Schema(
  {

    group_id: {type : Number, required: true, unique:true},
    name: {type: String, required: true},
    owner: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    balance: {type : Number, required: true}
  }
);

export const GroupModel = model("Group", groupSchema);
export type GroupDocument = HydratedDocument<DbGroup>;

// const transactionSchema = new Schema(
//   {
//     transaction_id: {type: Number, required: true, unique:true},
//     group_id: {type: Types.ObjectId, ref: "Group", required:true},
//     user_id: {type: Types.ObjectId, ref: "User", required:true},
//     amount: {type: Number, required:true},
//     description: {type: String, required: true}
//   },
//   { timestamps: true }
// );

// export const DbTransaction = model("Transaction", transactionSchema)