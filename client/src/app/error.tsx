'use client'
import Link from "next/link"

 // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
      <div className='w-full  h-screen flex flex-col gap-2  justify-center items-center'>
     
     <img src="https://cdni.iconscout.com/illustration/premium/thumb/bad-gateway-illustration-download-in-svg-png-gif-file-formats--error-server-page-http-nallow-pack-people-illustrations-6983286.png?f=webp" alt="" />
     <div className='mt-5 space-y-2'>
     <h1 className='md:text-3xl text-2xl font-medium text-center'>Something went wrong</h1>
     <p className='text-gray-700 w-10/12 text-center mx-auto text-sm'>
     Oops! Something went wrong. We've encountered an unexpected error. Our team has been notified. Please try refreshing the page or come back later. Sorry for the inconvenience.
     </p>
     </div>
     <div className="mt-4 flex md:flex-row flex-col md:items-center  justify-center gap-3  ">
         
        
       
        
           <button onClick={reset} className="px-7 bg-primary text-white py-3 border-2 border-gray-700/20 rounded-md md:w-fit w-full">
            Try Again
           </button>
        
       </div>
   </div>
      </body>
    </html>
  )
}