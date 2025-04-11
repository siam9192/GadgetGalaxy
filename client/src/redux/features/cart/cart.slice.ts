import { ICartItem } from "@/types/cartItem.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TStateCartItem = ICartItem & { isSelected?: boolean };

type TInitialState = {
  subtotal: number;
  discountCode: null | string;
  discountTotal: number;
  grandTotal: number;
  items: TStateCartItem[];
};

const initialState: TInitialState = {
  subtotal: 0,
  discountCode: null,
  discountTotal: 0,
  grandTotal: 0,
  items: [],
};

const calculateTotals = (items: TStateCartItem[]) => {
  const subtotal = items.reduce((acc, item) => {
    if (!item.isSelected) return acc + 0;
    const product = item.product;
    const variant = item.product;
    const pricing = {
      price: variant ? variant.price : product.price,
      offerPrice: variant ? variant.offerPrice : product.offerPrice,
    };

    const price = pricing.offerPrice || pricing.price;
    return acc + price * item.quantity;
  }, 0);

  const grandTotal = subtotal;

  return { subtotal, grandTotal };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateItems(state, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
      const { subtotal, grandTotal } = calculateTotals(state.items);
      state.subtotal = subtotal;
      state.grandTotal = grandTotal;
      state.discountTotal = 0;
      state.discountCode = null;
    },

    addItem(state, action: PayloadAction<ICartItem>) {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existingIndex !== -1) {
        // Update quantity if item already exists
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      const { subtotal, grandTotal } = calculateTotals(state.items);
      state.subtotal = subtotal;
      state.grandTotal = grandTotal - state.discountTotal;
      state.discountTotal = 0;
      state.discountCode = null;
    },

    updateItem(
      state,
      action: PayloadAction<{ id: string; quantity?: number; isSelected?: boolean }>,
    ) {
      const { id, ...other } = action.payload;

      // Update the specific item in the state
      state.items = state.items.map((_) => {
        if (_.id === id) {
          // If isSelected is true, validate quantity against available quantity
          if (other.isSelected) {
            const p = _.product;
            const v = p.variant;
            const avQuantity = v ? v.availableQuantity : p.availableQuantity;

            // If requested quantity exceeds available quantity, deselect the item
            if (avQuantity < (other.quantity || _.quantity)) other.isSelected = false;
          }

          // Update the item with the new values from payload
          _ = {
            ..._,
            ...other,
          };
        }

        return _;
      });

      // Recalculate totals after the update
      const { subtotal, grandTotal } = calculateTotals(state.items);
      state.subtotal = subtotal;
      state.grandTotal = grandTotal;
      state.discountTotal = 0;
      state.discountCode = null;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const { subtotal, grandTotal } = calculateTotals(state.items);
      state.subtotal = subtotal;
      state.grandTotal = grandTotal;
      state.discountTotal = 0;
      state.discountCode = null;
    },

    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.discountTotal = 0;
      state.discountCode = null;
      state.grandTotal = 0;
    },
    addDiscount(state, action: PayloadAction<{ amount: number; code: string }>) {
      const discount = action.payload;
      state.discountTotal = discount.amount;
      state.discountCode = null;
      state.grandTotal = state.subtotal - discount.amount;
      state.discountCode = discount.code;
    },
  },
});

export const { updateItems, updateItem, addItem, removeItem, clearCart, addDiscount } =
  cartSlice.actions;
export default cartSlice.reducer;
