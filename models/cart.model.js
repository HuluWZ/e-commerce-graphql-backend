import { model, Schema } from "mongoose"

const itemSchama = new Schema({ 
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    required: true,
    type: Number,
    min:1
  }
});

const cartSchema = new Schema({
  items: [itemSchama],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  },
  {
    timestamps: true,
  }
)

const CartModel = model("Cart",cartSchema)
export default CartModel