import React from "react";

const AuthProviderButtons = () => {
  return (
    <div className="mt-5 flex items-center justify-center gap-4">
      <button className="p-2 border-2 border-gray-900/15 rounded-md hover:bg-blue-50">
        <img
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          alt=""
          className="md:size-10 size-8 "
        />
      </button>
      <button className="p-2 border-2 border-gray-900/15 rounded-md hover:bg-blue-50">
        <img
          src="https://img.freepik.com/premium-vector/art-illustration_929495-41.jpg?semt=ais_hybrid"
          alt=""
          className="md:size-10  size-8  "
        />
      </button>
    </div>
  );
};

export default AuthProviderButtons;
