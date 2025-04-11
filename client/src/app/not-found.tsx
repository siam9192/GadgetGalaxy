import Link from 'next/link'
import React from 'react'

const page = () => {

  return (
    <div className='w-full  h-screen flex flex-col gap-2  justify-center items-center'>
     
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-not-available-illustration-download-in-svg-png-gif-file-formats--found-pack-science-technology-illustrations-7706458.png" alt="" />
      <div className='mt-5 space-y-2'>
      <h1 className='md:text-3xl text-2xl font-medium text-center'>Page not available</h1>
      <p className='text-gray-700 w-10/12 text-center mx-auto text-sm'>
      The page you’re looking for doesn’t exist or has been moved. It might be due to a broken link or incorrect URL. Please check the address or return to the homepage to continue browsing.
      </p>
      </div>
      <div className="mt-4 flex md:flex-row flex-col md:items-center  justify-center gap-3  ">
          
            <button className="px-7 py-3 hover:bg-primary hover:text-white border-2 border-gray-700/20 rounded-md md:w-fit w-full">
            Go Back
            </button>
        
          <Link href="/" >
            <button className="px-7 bg-primary text-white py-3 border-2 border-gray-700/20 rounded-md md:w-fit w-full">
             Go Home
            </button>
          </Link>
        </div>
    </div>
  )
}

export default page