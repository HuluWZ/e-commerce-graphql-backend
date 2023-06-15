import {Schema,model} from 'mongoose';
const categoryModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model('Category', categoryModel);
export default CategoryModel;