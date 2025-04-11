"use client";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { useAddToCartMutation } from "@/redux/features/cart/cart.api";
import {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} from "@/redux/features/wishList/wishList.api";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { Bounce, toast } from "react-toastify";

interface IProps {
  productId: number;
  variantId?: number | null;
  availableQuantity: number;
  isWishListed: boolean;
}

const AddToCart = ({ productId, variantId, availableQuantity, isWishListed }: IProps) => {
  const [stock, setStock] = useState(availableQuantity);
  const [quantity, setQuantity] = useState(1);
  const [wishListed, setWishListed] = useState(isWishListed);
  const { isUserExist } = useCurrentUser();
  const router = useRouter();
  const updateQuantity = (type: "i" | "d") => {
    if (type === "i") {
      const inc = quantity + 1;
      setQuantity((p) => (inc > stock ? p : inc));
    } else {
      const dec = quantity - 1;
      setQuantity((p) => (dec < 1 ? 1 : dec));
    }
  };

  const [add] = useAddToCartMutation();
  const handelAddToCart = async () => {
    if (!isUserExist) {
      return router.push(`/login?redirect=${pathname}`);
    }
    try {
      const res = await add(
        variantId ? { productId, variantId, quantity } : { productId, quantity },
      );
      if (res.data?.success) {
        toast.success("Successfully added to your cart!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        throw new Error((res.error as any)?.data.message);
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const [addWishList] = useAddToWishListMutation();
  const [removeWishList] = useRemoveFromWishListMutation();
  const pathname = usePathname();
  const toggleWishList = async () => {
    if (!isUserExist) {
      return router.push(`/login?redirect=${pathname}`);
    }
    try {
      // Check if the item is already wishlisted
      if (!wishListed) {
        // If it's already in wishlist, attempt to add again (might be a logic issue)
        // Maybe this should be removeWishList here instead?
        const res = await addWishList({ productId });

        if (res.data?.success) {
          setWishListed(true);
          toast.success("Added on Wishlist successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        } else {
          throw new Error((res.error as any)?.data.message);
        }
      } else {
        // If it's not in wishlist, then remove it (again, might be reversed logic)
        const res = await removeWishList(productId);

        if (res.data?.success) {
          setWishListed(false);
          toast.success("Removed from Wishlist successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        } else {
          throw new Error((res.error as any)?.data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="flex md:flex-row flex-col md:items-center   gap-2">
      <div className="flex items-center md:justify-around justify-between gap-2 p-2 border-2 border-blue-100 rounded-md">
        <button onClick={() => updateQuantity("i")} className="p-2">
          <FaPlus />
        </button>
        <input
          type="number"
          className="w-24  border-none outline-none text-center font-medium "
          readOnly={false}
          value={quantity}
          onChange={() => {}}
        />
        <button onClick={() => updateQuantity("d")} className="p-2">
          <FaMinus />
        </button>
      </div>
      <button
        onClick={handelAddToCart}
        disabled={availableQuantity === 0}
        className="px-8 py-3 disabled:bg-gray-100 disabled:text-black active:opacity-20 bg-primary text-white hover:bg-secondary hover:text-black hover:rounded-lg duration-75  font-medium"
      >
        ADD TO CART
      </button>
      <div className="flex items-center  gap-2">
        <button
          onClick={toggleWishList}
          className={`p-2 ${wishListed ? "bg-secondary" : "bg-blue-50"} w-fit  text-3xl `}
        >
          <FaRegHeart />
        </button>
        <button className="p-2 bg-blue-50 w-fit  text-3xl">
          <IoShareSocialOutline />
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
