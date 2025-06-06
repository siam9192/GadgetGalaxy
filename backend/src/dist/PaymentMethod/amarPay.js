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
exports.amarPayPayment = void 0;
//Fill formData with your own data
const axios_1 = __importDefault(require("axios"));
const amarPayPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = {
        cus_name: "any",
        cus_email: "any@gmail.com",
        cus_phone: "014764654443",
        amount: data.amount,
        tran_id: data.tran_id,
        signature_key: "28c78bb1f45112f5d40b956fe104645100",
        store_id: "aamarpay",
        currency: "USD",
        desc: "Pay your bill",
        cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_country: "Bangladesh",
        success_url: data.success_url + `?id=${data.tran_id}`,
        fail_url: `http://localhost:5173/`,
        cancel_url: data.cancel_url,
        type: "json", //This is must required for JSON request
    };
    const { data: resData } = yield axios_1.default.post("https://secure.aamarpay.com/jsonpost.php", paymentData);
    return resData.payment_url;
});
exports.amarPayPayment = amarPayPayment;
