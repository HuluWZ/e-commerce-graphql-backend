import {Schema,model} from 'mongoose';
const productModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: 'https://via.placeholder.com/150',
    }
  },
  {
    timestamps: true,
  }
);

const ProductModel = model('Product', productModel);
export default ProductModel;
