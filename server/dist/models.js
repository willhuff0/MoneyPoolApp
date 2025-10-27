import { Schema, model, Types } from "mongoose";
const userSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    chomp_score: { type: Number, required: true }
}, { timestamps: true });
export const DbUser = model("User", userSchema);
const sessionTokenSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    time: { type: Date, default: Date.now },
    ip: { type: String, required: false },
    claims: { type: Object, default: {} },
    signature: { type: String, required: true }
}, { timestamps: true });
export const DbSessionToken = model("SessionToken", sessionTokenSchema);
const groupSchema = new Schema({
    group_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    balance: { type: Number, required: true }
});
export const DbGroup = model("Group", groupSchema);
const transactionSchema = new Schema({
    transaction_id: { type: Number, required: true, unique: true },
    group_id: { type: Types.ObjectId, ref: "Group", required: true },
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true }
}, { timestamps: true });
export const DbTransaction = model("Transaction", transactionSchema);
