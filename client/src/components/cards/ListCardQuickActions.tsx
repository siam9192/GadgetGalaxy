"use client";
import { TCardProduct } from "@/types/product.type";
import React, { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { LuHeart, LuSearch } from "react-icons/lu";

import {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} from "@/redux/features/wishList/wishList.api";
import { useAddToCartMutation } from "@/redux/features/cart/cart.api";
import { Bounce, toast } from "react-toastify";
import ProductQuickViewPopup from "../ui/ProductQuickViewPopup";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { useRouter } from "next/navigation";

interface IProps {
  product: TCardProduct;
}
const ListCardQuickActions = ({ product }: IProps) => {
  const [isWishListed, setIsWishListed] = useState(product.isWishListed);
  const { isUserExist } = useCurrentUser();
  const router = useRouter();
  const [addWishList] = useAddToWishListMutation();
  const [removeWishList] = useRemoveFromWishListMutation();

  const toggleWishList = async () => {
    if (!isUserExist) {
      return router.push("/login");
    }
    setIsWishListed((p) => !p);
    try {
      // Check if the item is already wishlisted
      if (!isWishListed) {
        // If it's already in wishlist, attempt to add again (might be a logic issue)
        // Maybe this should be removeWishList here instead?
        const res = await addWishList({ productId: product.id });

        if (res.data?.success) {
          setIsWishListed(true);
        } else {
          throw new Error((res.error as any)?.data.message);
        }
      } else {
        // If it's not in wishlist, then remove it (again, might be reversed logic)
        const res = await removeWishList(product.id);

        if (res.data?.success) {
          setIsWishListed(false);
        } else {
          throw new Error((res.error as any)?.data.message);
        }
      }
    } catch (error: any) {
      setIsWishListed((p) => !p);
    }
  };

  const [add] = useAddToCartMutation();
  const handelAddToCart = async () => {
    if (!isUserExist) {
      return router.push("/login");
    }
    const variantId = product.variants[0]?.id;
    const productId = product.id;
    const quantity = 1;
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

  const variant = product.variants[0];
  const isInStock = (variant ? variant.availableQuantity : product.availableQuantity) > 0;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="mt-3 flex items-center justify-end gap-3 ">
        {isInStock ? (
          <button
            onClick={handelAddToCart}
            className="text-xl bg-primary p-2 rounded-full  text-white"
          >
            <IoCartOutline />
          </button>
        ) : null}

        {isWishListed ? (
          <button
            onClick={toggleWishList}
            className="text-xl bg-secondary p-2 rounded-full  text-black"
          >
            <LuHeart />
          </button>
        ) : (
          <button onClick={toggleWishList} className="text-xl bg-info p-2 rounded-full  text-white">
            <LuHeart />
          </button>
        )}
        <ProductQuickViewPopup slug={product.slug} />
      </div>
    </div>
  );
};

export default ListCardQuickActions;
