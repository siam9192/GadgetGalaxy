import { useGetMyOrderQuery } from "@/redux/features/order/order.api";
import { EOrderStatus } from "@/types/order.type";
import { capitalizeFirstWord } from "@/utils/helpers";
import React from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
interface IProps  {
    orderId:number
}
function OrderDetails(props:IProps) {
  const { data, isLoading } = useGetMyOrderQuery(props.orderId);
  const order = data?.data
  if (isLoading) return <p>is loading</p>;
  if(!order) return <p>Something went wrong!</p>
  const items =  order.items
  
  const exceptedDeliveryDateStr = order.exceptedDeliveryDate
    ? order.exceptedDeliveryDate.in
      ? new Date(order.exceptedDeliveryDate.in!).toDateString()
      : [
          new Date(order.exceptedDeliveryDate.from!).toDateString(),
          new Date(order.exceptedDeliveryDate.to!).toDateString() || "",
        ].join("-")
    : "";

    const shippingInfo = order.shippingInfo
    const shippingDetails =  [
    {
      heading: 'Recipient Customer Info:',
      values: [
        { name: 'Name', value: shippingInfo.fullName },
        { name: 'Phone', value: shippingInfo.phoneNumber},
        { name: 'email', value: shippingInfo.emailAddress},
      ],
    },
    {
      heading: 'Address:',
      values: 
      [
        { name: 'District', value:shippingInfo.district  },
        { name: 'Zone', value: shippingInfo.zone },
        { name: 'Street', value: shippingInfo.line },
      ]
    },
    {
      heading: 'Payment Information:',
      values: [
        { name: 'Transaction Id', value: order.payment.transactionId },
        { name: 'Amount', value: order.payment.amount },
        { name: 'Method', value: order.payment.method },
        { name: 'Currency', value: 'BDT' },
        { name: 'Status', value: order.payment.status },
      ],
    },
  ];

  return <div>
    <h2 className=" text-2xl  font-medium">
        Order Details
    </h2>
       <div className="mt-5">
            <div >
                    <h4 className="   font-medium md:text-[1rem] text-sm">Order:#{order.id}</h4>
                    <p  className={`${[EOrderStatus.PLACED, EOrderStatus.IN_TRANSIT].includes(order.status as any) ? "text-primary" : EOrderStatus.DELIVERED === order.status ? "text-green-500" : "text-red-500"} font-medium text-sm  rounded-full md:scale-100 scale-70`}>Status: {order.status}</p>
                  </div>
                  <div className="mt-2">
                    <h1 className="md:text-xl font-medium ">
                      {items.reduce((p, c) => p + c.quantity, 0)} Items
                    </h1>
                  </div>
    </div>
    <div className="mt-5">
        <p className="text-xl font-medium">Order Items:</p>
        <div className="mt-3 space-y-2">
            {
        items.map((item,index)=>(
            <div key={index} className="flex gap-3">
            <img src={item.imageUrl} alt=""  className="size-20"/>
            <div>
                <p className="text-lg">{item.productName}</p>
               <div className="flex items-center gap-2 text-sm">
                 <span >Qty: {item.quantity}</span>
                 <span >Price:  <FaBangladeshiTakaSign className=" inline"/>{item.price}</span>
               </div>
            </div>
            </div>
        ))
            }
        </div>
            <div className="flex justify-end">
                  <p className="flex   items-center  font-semibold  ">
                    <span>Total: </span>
           <span className="font-medium">
             <FaBangladeshiTakaSign />
           </span>
           <span className="text-xl text-primary">{order.totalAmount}</span>
         </p>
            </div>
            
           
    </div>
       <div className="mt-3 ">
         {[EOrderStatus.PLACED, EOrderStatus.PROCESSING, EOrderStatus.IN_TRANSIT].includes(
           order.status as EOrderStatus,
         ) ? (
           <p className="text-sm text-primary">Excepted Delivery on {exceptedDeliveryDateStr}</p>
         ) : (
           <p></p>
         )}

       </div>
       <div className="mt-5">
              <p className="text-xl font-medium">Billing Details:</p>
              {
                shippingDetails.map((details,index)=>{
                    return (
                        <div  key={index} className="mt-2">
                           <p className="text-lg font-medium">{details.heading}</p>
                           <div>
                            
                            {
                                details.values.map((value,index2)=>{
                                    return <p key={index2}>
                                        <span className="font-medium">
                                          {
                                            value.name
                                          }:
                                        </span>  <span>{value.value}</span>
                                        
                                    </p>
                                })
                            }
                           </div>
                        </div>
                    )
                })
              }
       </div>
  </div>
}

export default OrderDetails;
