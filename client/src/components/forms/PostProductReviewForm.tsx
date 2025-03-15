"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import Form from "../hook-form/Form";
import RatingInput from "../ui/RatingInput";
import { FaPlus } from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const PostProductReviewForm = () => {
  const [rating, setRating] = useState(1);
  const handelSubmit = () => {};
  const [images, setImages] = useState<File[]>([]);
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

  const replaceImage = (index: number) => {
    const ref = inputRef.current;
    if (!ref) return;
    return;
  };
  return (
    <Form onSubmit={handelSubmit} className="md:p-5 p-2 w-full text-start">
      <h1 className=" md:text-xl text-lg ">
        Write a review for{" "}
        <span className="text-primary font-medium md:text-2xl text-xl  ">IPhone 15 pro max</span>
      </h1>
      <div
        className="flex
   items-center gap-2 mt-3 "
      >
        <div className="text-2xl text-info ">
          <RatingInput onChange={(value) => setRating(value)} />
        </div>
        <p className="font-medium text-gray-700">({rating})</p>
      </div>
      <div className="mt-5">
        <textarea
          name=""
          id=""
          placeholder="Write your review"
          className="mt-3 w-full h-60 resize-none bg-gray-50 border-2 border-gray-700/20 rounded-md p-2 outline-primary"
        ></textarea>
      </div>
      <div className="mt-7 select-none">
        <div className="size-fit flex items-center gap-2">
          <h6 className="text-xl font-medium">Images:</h6>
          <div className="size-8  bg-primary text-sm flex justify-center items-center text-white  rounded-full ">
            20
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 ">
          {images.map((image, index) => (
            <div key={index} className=" rounded-md hover:cursor-pointer relative group">
              <img
                src={URL.createObjectURL(image)}
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
        accept="/image*"
        className="hidden"
      />
      <div className="mt-5 text-end">
        <button className="md:px-8 px-6 font-medium md:py-4 py-3 disabled:bg-gray-400 bg-primary hover:bg-secondary hover:text-black hover:rounded-lg duration-75 text-white">
          Submit
        </button>
      </div>
    </Form>
  );
};

export default PostProductReviewForm;
