import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const Running = () => {
  // Run the handler function every 10 minutes
  setInterval(handler, 1000 * 60 * 10);

  async function handler() {
    // Set the expiration time to 24 hours ago
    const paymentExpiredAt = new Date();
    paymentExpiredAt.setHours(paymentExpiredAt.getHours() - 24);

    // Update all pending payments that were created more than 24 hours ago (except COD payments) to 'EXPIRED'
    await prisma.payment.updateMany({
      where: {
        method: {
          not: PaymentMethod.COD, // Exclude COD payments
        },
        status: PaymentStatus.PENDING, // Only update pending payments
        createdAt: {
          lte: paymentExpiredAt, // Payments older than 24 hours
        },
      },
      data: {
        status: PaymentStatus.EXPIRED, // Mark them as expired
      },
    });

    // Update all pending orders where the payment has expired (excluding COD) to 'FAILED'
    await prisma.order.updateMany({
      where: {
        status: OrderStatus.PENDING, // Only update pending orders
        payment: {
          status: PaymentStatus.EXPIRED, // Only if payment is expired
          method: {
            not: PaymentMethod.COD, // Exclude COD payments
          },
        },
      },
      data: {
        status: OrderStatus.FAILED, // Mark the order as failed
      },
    });

    const requestExpiredAt = new Date();
    requestExpiredAt.setMinutes(requestExpiredAt.getMinutes() - 5);
    await prisma.registrationRequest.deleteMany({
      where: {
        expireAt: {
          lte: requestExpiredAt,
        },
      },
    });
  }
};

const RunningServices = {
  Running,
};

export default RunningServices;
