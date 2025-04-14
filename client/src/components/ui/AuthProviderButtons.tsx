import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleCallBack } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const AuthProviderButtons = () => {
  const { refetch } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await googleCallBack(response.access_token);

        if (res.success) {
          refetch();
          const redirect = searchParams.get("redirect");
          refetch();
          if (redirect) {
            router.replace(redirect);
          } else {
            router.replace("/");
          }
        } else {
          throw new Error(res.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="mt-5 flex items-center justify-center gap-4">
      <button
        onClick={() => googleLogin()}
        type="button"
        className="p-2 border-2 border-gray-900/15 rounded-md hover:bg-blue-50"
      >
        <img
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          alt=""
          className="md:size-10 size-8 "
        />
      </button>
      <button type="button" className="p-2 border-2 border-gray-900/15 rounded-md hover:bg-blue-50">
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
