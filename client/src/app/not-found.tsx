import Link from "next/link";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-1/2 ">
        <h1 className="text-center text-5xl font-medium">Page not found</h1>
        <div className="text-center mt-5">
          <Link href={"/"}>
            <button className="px-4 py-3 bg-primary text-white">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
