import {Schema,model} from 'mongoose';
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = model('User', userSchema);
export default UserModel;
