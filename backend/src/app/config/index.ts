import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  backend_base_api: process.env.BACKEND_BASE_API,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_token_expire_time: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_token_expire_time: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
  jwt_forget_password_token_secret: process.env.JWT_FORGET_PASSWORD_SECRET,
  jwt_forget_password_token_expire_time:
    process.env.JWT_FORGET_PASSWORD_SECRET_TOKEN_EXPIRE_TIME,
  jwt_account_verification_secret: process.env.JWT_ACCOUNT_VERIFICATION_SECRET,
  app_user_name: process.env.APP_USER_NAME,
  app_pass_key: process.env.APP_PASS_KEY,
  stripe_secret: process.env.STRIPE_SECRET,
  ssl: {
    store_id: process.env.SSL_STORE_ID,
    store_password: process.env.SSL_STORE_PASSWORD,
    payment_url: process.env.SSL_PAYMENT_URL,
    validation_url: process.env.SSL_VALIDATION_API,
    success_url: process.env.SSL_SUCCESS_URL,
    fail_url: process.env.SSL_FAIL_URL,
    cancel_url: process.env.SSL_CANCEL_URL,
  },
  paypal_id: process.env.PAYPAL_ID,
  paypal_secret: process.env.PAYPAL_SECRET,
  payment: {
    success_url: process.env.PAYMENT_SUCCESS_URL,
    cancel_url: process.env.PAYMENT_CANCEL_URL,
    success_redirect_url: process.env.PAYMENT_SUCCESS_REDIRECT_URL,
  },
  order: {
    success_url: process.env.ORDER_SUCCESS_URL,
    cancel_url: process.env.ORDER_CANCEL_URL,
  },
};
