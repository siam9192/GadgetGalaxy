import Link from "next/link";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-not-available-illustration-download-in-svg-png-gif-file-formats--found-pack-science-technology-illustrations-7706458.png"
        alt=""
      />
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
