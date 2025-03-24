import axios from "axios";
import config from "../../config";
import { IInitSSLPaymentPayload } from "./ssl.interface";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import jwtHelpers from "../../shared/jwtHelpers";

const initPayment = async (payload: IInitSSLPaymentPayload) => {
  const token = jwtHelpers.generateToken(
    { transactionId: payload.transactionId },
    config.jwt.payment_secret as string,
    "12h",
  );

  const data = {
    store_id: config.ssl.store_id,
    store_passwd: config.ssl.store_password,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.transactionId, // use unique tran_id for each api call
    success_url: `${config.backend_base_api}/payments/ispn/${token}`,
    fail_url: `${config.backend_base_api}/payments/ispn/${token}`,
    cancel_url: `${config.backend_base_api}/payments/ispn/${token}`,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "N/A",
    product_name: "N/A",
    product_category: "N/A",
    product_profile: "N/A",
    cus_name: payload.customer.name,
    cus_email: payload.customer.email || "N/A",
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "Bangladesh",
    cus_phone: payload.customer.phone || "N/A",
    cus_fax: "N/A",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: "N/A",
    ship_country: "N/A",
  };

  const response = await axios({
    method: "post",
    url: config.ssl.payment_url,
    data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "get",
      url: config.ssl.validation_url,
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
};

const SSLServices = {
  initPayment,
  validatePayment,
};

export default SSLServices;
