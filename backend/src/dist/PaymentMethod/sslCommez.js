"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslcommerzPayment = void 0;
const config_1 = __importDefault(require("../config"));
const SSL = require("sslcommerz-lts");
const sslcommerzPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const store_id = config_1.default.ssl.store_id;
    const store_passwd = config_1.default.ssl.store_password;
    const is_live = false; //true for live, false for sandbox
    const paymentData = {
        total_amount: data.amount,
        currency: "USD",
        tran_id: data.transactionId, // use unique tran_id for each api call
        success_url: data.successUrl,
        fail_url: "http://localhost:3030/fail",
        cancel_url: data.cancelUrl,
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };
    const sslcz = new SSL(store_id, store_passwd, is_live);
    const sslResponse = yield sslcz.init(paymentData);
    let GatewayPageURL = sslResponse.GatewayPageURL;
    return GatewayPageURL;
});
exports.sslcommerzPayment = sslcommerzPayment;
