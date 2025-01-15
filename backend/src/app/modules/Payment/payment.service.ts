import { PaymentStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { Response } from "express";

const updateSuccessPayment = async (res: Response, paymentId: string) => {
  try {
    if (!paymentId) {
      throw new Error();
    }

    await prisma.payment.findFirst({
      where: {
        id: paymentId,
        status: PaymentStatus.Completed,
      },
    });

    res.redirect("http://localhost:3000/dashboard/vendor");
  } catch (error) {
    res.redirect("https://www.youtube.com/");
  }
};

const updateCanceledPayment = async (res: Response, paymentId: string) => {
  await prisma.payment.findFirst({
    where: {
      id: paymentId,
      status: PaymentStatus.Canceled,
    },
  });
  res.redirect("https://www.youtube.com/");
};

const PaymentServices = {
  updateSuccessPayment,
  updateCanceledPayment,
};

export default PaymentServices;
