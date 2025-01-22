import {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import prisma from "../../shared/prisma";
import { Response } from "express";
import { IInitPaymentPayload } from "./payment.interface";
import { generateTransactionId } from "../../utils/function";
import SSLServices from "../SSL/ssl.service";
import { IInitSSLPaymentPayload } from "../SSL/ssl.interface";
import config from "../../config";

const initPayment = async (payload: IInitPaymentPayload) => {
  let transactionId;

  // Generate unique tran id
  while (!transactionId) {
    const generatedTranId = generateTransactionId();
    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: generatedTranId,
      },
    });
    if (payment) {
      continue;
    } else transactionId = generatedTranId;
  }
  console.log("Tran id",transactionId)
  const SSLInitPayload: IInitSSLPaymentPayload = {
    transactionId,
    amount: payload.amount,
    url: {
      success: config.ssl.success_url as string,
      cancel: config.ssl.success_url as string,
      fail: config.ssl.success_url as string,
    },
    customer: payload.customer,
    shippingAddress: payload.shippingAddress,
  };

  const paymentData = {
    transactionId,
    orderId: payload.orderId,
    amount: payload.amount,
    method: PaymentMethod.SSLCommerz,
  };

  // Insert  payment into db
  const createdPayment = await prisma.payment.create({
    data: paymentData,
  });

  const result = await SSLServices.initPayment(SSLInitPayload);

  return {
    paymentId: createdPayment.id,
    paymentUrl: result.GatewayPageURL,
  };
};
const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //     return {
  //         message: "Invalid Payment!"
  //     }
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response?.status !== 'VALID') {
  //     return {
  //         message: "Payment Failed!"
  //     }
  // }

  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.Successful,
        gatewayGatewayData: response,
      },
    });

  

  const updatedOrderData =  await tx.order.update({
      where: {
        id: updatedPaymentData.orderId,
      },
      data: {
        status:OrderStatus.Placed,
        paymentStatus: OrderPaymentStatus.Paid,
      },
    });


    const deletableCartItemsId = updatedOrderData.deletableCartItemsId
    

    // If deletable cart items exist then delete cart items from db
    if(deletableCartItemsId){
      await tx.cartItem.deleteMany({
        where:{
          id:{
            in:deletableCartItemsId.split(",")
          }
        }
      })
    }

    
  });

  return {
    message: "Payment success!",
  };
};

// const

const PaymentServices = {
  initPayment,
  validatePayment,
};

export default PaymentServices;
