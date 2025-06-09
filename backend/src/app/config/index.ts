import dotenv from "dotenv";
import path from "path";
import { EEnvironment } from "../reuse/types";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const environment = process.env.ENVIRONMENT;
const isProd = environment === EEnvironment.PRODUCTION;
export default {
  environment: process.env.ENVIRONMENT,
  port: process.env.PORT,
  origin:isProd ? process.env.CLIENT_ORIGIN_PROD:process.env.CLIENT_ORIGIN_DEV,
  backend_base_api: !isProd
    ? process.env.BACKEND_BASE_API_DEV
    : process.env.BACKEND_BASE_API_PROD,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt: {
    access_token_secret: process.env.JWT_ACCESS_SECRET,
    access_token_expire_time: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    refresh_token_secret: process.env.JWT_REFRESH_SECRET,
    refresh_token_expire_time: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    reset_password_token_secret: process.env.JWT_RESET_PASSWORD_SECRET,
    reset_password_token_expire_time:
      process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRE_TIME,
    account_verification_secret: process.env.JWT_ACCOUNT_VERIFICATION_SECRET,
    payment_secret: process.env.JWT_PAYMENT_SECRET,
  },
  app: {
    user_name: process.env.APP_USER_NAME,
    pass_key: process.env.APP_PASS_KEY,
  },
  facebook: {
    secret: process.env.FACEBOOK_APP_SECRET,
    id: process.env.FACEBOOK_APP_ID,
  },
  ssl: {
    store_id: process.env.SSL_STORE_ID,
    store_password: process.env.SSL_STORE_PASSWORD,
    payment_url: process.env.SSL_PAYMENT_URL,
    validation_url: process.env.SSL_VALIDATION_API,
    success_url: process.env.SSL_SUCCESS_URL,
    fail_url: process.env.SSL_FAIL_URL,
    cancel_url: process.env.SSL_CANCEL_URL,
  },
  paypal: {
    id: process.env.PAYPAL_ID,
    secret: process.env.PAYPAL_SECRET,
  },
  payment: {
    success_url: isProd
      ? process.env.PAYMENT_SUCCESS_URL_PROD
      : process.env.PAYMENT_SUCCESS_URL_DEV,
    cancel_url: isProd
      ? process.env.PAYMENT_CANCEL_URL_PROD
      : process.env.PAYMENT_CANCEL_URL_DEV,
    success_redirect_url: process.env.PAYMENT_SUCCESS_REDIRECT_URL,
  },
  order: {
    success_url: process.env.ORDER_SUCCESS_URL,
    cancel_url: process.env.ORDER_CANCEL_URL,
  },
};
