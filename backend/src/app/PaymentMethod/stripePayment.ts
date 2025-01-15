import config from "../config";
import { IPaymentMethodData } from "./payment-method.interface";

const stripe = require("stripe")(config.stripe_secret);

export const stripePayment = async (data: IPaymentMethodData) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: data.service_name,
          },
          unit_amount: Math.round(data.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // The URL of your payment completion page
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
  });

  return session.url;
};
