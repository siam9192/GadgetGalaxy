const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
const isProd = environment === "PROD";
export default {
  base_api: isProd ? process.env.NEXT_PUBLIC_BASE_API_PROD : process.env.NEXT_PUBLIC_BASE_API_DEV,
  google_client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  img_bb_key: process.env.NEXT_PUBLIC_IMG_BB_API_KEY,
  img_bb_uploadUrl: "https://api.imgbb.com/1/upload",
};
