import {Schema,model} from 'mongoose';
const reviewModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ReviewModel = model('Review', reviewModel);
export default ReviewModel;