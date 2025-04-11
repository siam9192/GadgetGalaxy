"use client";
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaBangladeshiTakaSign, FaRegTrashCan } from "react-icons/fa6";
import { CartContext } from "../sections/cart/CartItems";
import { IoTrashOutline } from "react-icons/io5";
import { ICartItem } from "@/types/cartItem.type";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateItem, updateItems } from "@/redux/features/cart/cart.slice";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "@/redux/features/cart/cart.api";
import ChangeCartItemVariantPopup from "../ui/ChangeCartItemVariantPopup";

interface IProps {
  item: ICartItem;
  isLast: boolean;
}

const CartCard = ({ isLast, item }: IProps) => {
  const product = item.product;
  const variant = product.variant;
  const stock = variant ? variant.availableQuantity : product.availableQuantity;
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useAppDispatch();
  const contextValue = useContext(CartContext)!;
  const { isSelectAll } = contextValue;

  const [updateQuantityApi] = useUpdateCartItemQuantityMutation();
  const updateQuantity = (type: "i" | "d") => {
    let ltQty = quantity;
    if (type === "i") {
      const inc = quantity + 1;
      setQuantity((p) => (inc > stock ? p : inc));
      ltQty = inc;
    } else {
      const dec = quantity - 1;
      setQuantity((p) => (dec < 1 ? 1 : dec));
      ltQty = dec;
    }
    dispatch(updateItem({ id: item.id, quantity }));
  };

  const pricing = {
    price: variant ? variant.price : product.price,
    offerPrice: variant ? variant.price : product.price,
  };

  const price = pricing.offerPrice || pricing.price;
  const attStr = variant
    ? variant?.attributes.map((attr) => `${attr.name}: ${attr.value}`).join(" | ")
    : "";

  const disabled = stock < quantity;

  const handelSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    dispatch(updateItem({ id: item.id, isSelected: checked }));
  };

  const state = useAppSelector((state) => state.cartSlice);

  const isSelected = state.items.find((_) => _.id === item.id)?.isSelected || false;

  const [remove] = useRemoveCartItemMutation();
  const handelRemove = async () => {
    try {
      const res = await remove(item.id);
    } catch (error) {}
  };

  const renderRef = useRef<boolean>(false);
  useEffect(() => {
    if (!renderRef.current) renderRef.current = true;
    else {
      setTimeout(async () => {
        const res = await updateQuantityApi({ id: item.id, quantity });
      }, 1000);
    }
  }, [quantity]);

  return (
    <div
      className={`bg-white ${!isLast ? " border-b" : ""}  border-gray-200 hover:cursor-pointer hover:bg-gray-50 md:p-5 p-3  relative `}
    >
      <div>
        <div className="">
          <input
            checked={isSelected}
            disabled={disabled}
            type="checkbox"
            className="md:size-5 size-4 accent-primary"
            onChange={handelSelect}
          />
        </div>
        <div className="flex  lg:gap-10 md:gap-5 gap-3 md:flex-nowrap flex-wrap">
          <div className="w-[60%] flex items-center md:gap-4 gap-2">
            <img
              src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
              alt=""
              className="md:size-20 size-14"
            />
            <div className=" md:space-y-2 space-y-2">
              <h3 className="font-medium md:text-[1rem] text-sm">{product.name}</h3>
              {variant && (
                <div className="flex items-center gap-2">
                  <div
                    className={`md:size-4 size-3 rounded-full p-2 border border-gray-900/40 outline-2 outline-primary md:outline-offset-2 outline-offset-1 `}
                    style={{ backgroundColor: variant.colorCode }}
                  />
                  <p className="text-sm">{variant.colorName}</p>
                </div>
              )}
              <div className="flex items-center gap-2 md:flex-nowrap flex-wrap md:text-sm text-[0.7rem] text-gray-700">
                <p>{attStr}</p>
                {variant && (
                  <ChangeCartItemVariantPopup item={item}>
                    <button className="text-info font-medium">Change</button>
                  </ChangeCartItemVariantPopup>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-[40%] w-full flex justify-between items-center">
            <div className="flex items-center md:justify-around justify-between gap-2 md:p-2 p-1 border-2 border-blue-100 rounded-md  md:w-32 w-20">
              <button onClick={() => updateQuantity("i")} className="text-sm">
                <FaPlus />
              </button>
              <input
                type="number"
                className="w-full  border-none outline-none text-center font-medium md:text-[1rem] text-sm "
                readOnly={false}
                value={quantity}
                onChange={() => {}}
              />
              <button onClick={() => updateQuantity("d")} className="text-sm">
                <FaMinus />
              </button>
            </div>
            <div>
              <h1 className="flex items-center  md:text-xl text-[0.9rem] font-semibold font-primary">
                <FaBangladeshiTakaSign />
                <span>{(price * quantity).toFixed(2)}</span>
              </h1>
              <h4 className="flex items-center   justify-end  md:text-[1rem] text-[0.7rem] font-semibold font-primary  ">
                <span>{quantity}x</span>
                <span className="text-primary">{price.toFixed(2)}</span>
              </h4>
            </div>
          </div>
        </div>
        <button
          onClick={handelRemove}
          className="p-2 md:text-xl text-sm hover:text-info bg-gray-50 rounded-full absolute right-0 top-1"
        >
          <IoTrashOutline />
        </button>
      </div>
      {stock < quantity && <p className="text-info font-medium text-sm">Stock not available</p>}
    </div>
  );
};

export default CartCard;
