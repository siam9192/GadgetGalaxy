"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import Form from "../hook-form/Form";
import RatingInput from "../ui/RatingInput";
import { FaPlus } from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { uploadImageToImgBB } from "@/utils/helpers";
import {
  useCreateProductReviewMutation,
  useUpdateProductReviewMutation,
} from "@/redux/features/product-review/product-review.api";
import { IProductReview } from "@/types/product-review.type";

interface IProps {
  onSuccess: () => void | any;
  review: IProductReview;
}

const EditProductReviewForm = ({ review, onSuccess }: IProps) => {
  const [rating, setRating] = useState(1);

  const [images, setImages] = useState<(File | string)[]>(review.imagesUrl || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const handelImageInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) return (inputRef.current!.files = null);

    const length = images.length + files.length;
    if (length > 6) return (inputRef.current!.files = null);
    setImages((prev) => [...prev, ...files]);
    return (inputRef.current!.files = null);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => index !== idx));
  };

  const [comment, setComment] = useState(review.comment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const [updateReview, { isLoading }] = useUpdateProductReviewMutation();
  const handelSubmit = async () => {
    setErrors({});
    setErrorMessage("");

    try {
      const errors: Record<string, string> = {};

      if (comment.trim().length < 1) {
        errors.comment = "Comment is required";
      }

      if (Object.values(errors).length) {
        return setErrors(errors);
      }

      const imagesUrl = images.filter((_) => typeof _ === "string");
      const newImages = images.filter((_) => typeof _ !== "string");
      if (newImages.length) {
        for (const image of newImages) {
          const url = await uploadImageToImgBB(image);
          imagesUrl.push(url);
        }
      }
      const payload = {
        imagesUrl,
        comment,
        rating,
      };
      const res = await updateReview({ id: review.id, payload });
      if (!res.data?.success) {
        throw new Error((res.error as any).data.message);
      }

      onSuccess && onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const item = review.item;

  return (
    <Form onSubmit={handelSubmit} className="md:p-5 p-2 w-full text-start">
      <h1 className=" md:text-xl text-lg ">
        Write a review for{" "}
        <span className="text-primary font-medium md:text-2xl text-xl  ">{item.productName}</span>
      </h1>
      <div
        className="flex
   items-center gap-2 mt-3 "
      >
        <div className="text-2xl text-info ">
          <RatingInput onChange={(value) => setRating(value)} defaultValue={review.rating} />
        </div>
        <p className="font-medium text-gray-700">({rating})</p>
      </div>
      <div className="mt-5">
        <textarea
          name=""
          id=""
          onChange={(e) => setComment(e.target.value)}
          defaultValue={comment}
          placeholder="Write your review"
          className="mt-3 w-full h-60 resize-none bg-gray-50 border-2 border-gray-700/20 rounded-md p-2 outline-primary"
        ></textarea>
        {errors["comment"] && <p className="mt-1 text-red-500">{errors.comment}</p>}
      </div>
      <div className="mt-7 select-none">
        <div className="size-fit flex items-center gap-2">
          <h6 className="text-xl font-medium">Images:</h6>
          <div className="size-8  bg-primary text-sm flex justify-center items-center text-white  rounded-full ">
            {images.length}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 ">
          {images.map((image, index) => (
            <div key={index} className=" rounded-md hover:cursor-pointer relative group">
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt=""
                className="md:size-20 size-16 aspect-square rounded-md"
              />
              <div className="absolute group-hover:block  inset-0 text-center w-full h-full bg-gray-900/40  flex flex-col items-center justify-center gap-1 ">
                {/* <button onClick={()=>removeImage(index)} className="text-white text-2xl">
        <MdOutlineReplay />
        </button> */}
                <button onClick={() => removeImage(index)} className="text-white text-2xl">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => inputRef.current?.click()}
            className="md:size-20 size-16  flex items-center justify-center  flex-col p-3 border-2 border-gray-800/20   rounded-md hover:cursor-pointer"
          >
            <span className="text-2xl">
              <FaPlus />
            </span>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        onChange={handelImageInputOnChange}
        type="file"
        accept="/image*"
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        onChange={handelImageInputOnChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
      <div className="mt-5 text-end">
        <button
          onClick={handelSubmit}
          disabled={isLoading}
          className="md:px-8 px-6 font-medium md:py-4 py-3 disabled:bg-gray-400 bg-primary hover:bg-secondary hover:text-black hover:rounded-lg duration-75 text-white"
        >
          Submit
        </button>
      </div>
      <div className="mt-2">
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>
    </Form>
  );
};

export default EditProductReviewForm;
