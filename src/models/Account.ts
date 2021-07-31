import { Document, Schema, model } from "mongoose";

export interface IAccount extends Document {
  name: string;
  api: string;
  date: Date;
}

const AccountSchema = new Schema<IAccount>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  api: {
    type: String,
    required: [true, "API is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Account = model<IAccount>('Account', AccountSchema);

export default Account;