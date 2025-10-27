import type {
  ClientSession,
  HydratedDocument,
  ProjectionType,
  Types,
  Model,
} from "mongoose";
import { BaseDAO } from "./baseDAO";
import { User } from "../models"; 

export type UserAttrs = {
  user_id: number;
  username: string;
  password: string;
  name: string;
  chomp_score: number;
  friends: Types.ObjectId[]; 
};
export type UserDocument = HydratedDocument<UserAttrs>;
export type UserLean = UserAttrs & { _id: Types.ObjectId };

const UserModel = User as unknown as Model<UserDocument>;

export class UserDAO extends BaseDAO<UserDocument, UserLean> {
  constructor() {
    super(UserModel);
  }

  findByUserId(user_id: number, projection?: ProjectionType<UserDocument>) {
    return this.findOne({ user_id } as any, projection);
  }
  findByUsername(username: string, projection?: ProjectionType<UserDocument>) {
    return this.findOne({ username } as any, projection);
  }

  async createUser(
    input: Pick<UserAttrs, "user_id" | "username" | "password" | "name" | "chomp_score">,
    session?: ClientSession | null
  ) {
    const doc: UserAttrs = { ...input, friends: [] };
    return this.create(doc as any, session);
  }

  async updateProfile(
    userObjectId: Types.ObjectId | string,
    updates: Partial<Pick<UserAttrs, "name" | "username" | "chomp_score">>,
    session?: ClientSession | null
  ) {
    const safe: Partial<UserAttrs> = {};
    if (updates.name != null) safe.name = updates.name;
    if (updates.username != null) safe.username = updates.username;
    if (typeof updates.chomp_score === "number") safe.chomp_score = updates.chomp_score;

    return this.updateById(
      userObjectId as any,
      { $set: safe } as any,
      { session: session || undefined }
    );
  }

  //this expects the passwd to be hashed
  async setPassword(
    userObjectId: Types.ObjectId | string,
    password: string,
    session?: ClientSession | null
  ) {
    return this.updateById(
      userObjectId as any,
      { $set: { password } } as any,
      { session: session || undefined }
    );
  }

  async addFriend(
    userObjectId: Types.ObjectId | string,
    friendObjectId: Types.ObjectId | string,
    session?: ClientSession | null
  ) {
    return this.updateById(
      userObjectId as any,
      { $addToSet: { friends: friendObjectId } } as any,
      { session: session || undefined }
    );
  }

  async removeFriend(
    userObjectId: Types.ObjectId | string,
    friendObjectId: Types.ObjectId | string,
    session?: ClientSession | null
  ) {
    return this.updateById(
      userObjectId as any,
      { $pull: { friends: friendObjectId } } as any,
      { session: session || undefined }
    );
  }

  async isFriend(
    userObjectId: Types.ObjectId | string,
    maybeFriendId: Types.ObjectId | string
  ): Promise<boolean> {
    const res = await UserModel
      .findOne({ _id: userObjectId, friends: maybeFriendId })
      .select("_id")
      .lean()
      .exec();
    return !!res;
  }

  async listFriends(
    userObjectId: Types.ObjectId | string,
    selectFields = "user_id username name chomp_score"
  ): Promise<UserLean[]> {
    const doc = await UserModel
      .findById(userObjectId)
      .populate({ path: "friends", select: selectFields })
      .lean()
      .exec();

    return (doc && (doc as any).friends) ? ((doc as any).friends as UserLean[]) : [];
  }
}

export const userDAO = new UserDAO();
