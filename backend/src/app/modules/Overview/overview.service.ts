import { AccountStatus, OrderStatus, Prisma } from "@prisma/client"
import prisma from "../../shared/prisma"
import { toASCII } from "punycode"

const getAllOverviewDataFromDB = async ()=>{

    const userWhereConditions:Prisma.UserWhereInput = {
        status:{
            not:"Deleted"
        }
    }
    const totalUsers =  await prisma.user.count({
        where:userWhereConditions
    })
    const totalOrders = await prisma.order.count({
        where:{
            status:{
                not:"Pending"
            }
        }
    })
    const totalReviews = await prisma.productReview.count();
    const totalCustomers = await prisma.customer.count({
        where:{
            user:userWhereConditions
        }
    })
    const totalStaffs = await prisma.staff.count({
        where:{
            user:userWhereConditions
        }
    })
    const totalRevenue = await prisma.payment.aggregate({
        _sum:{
            amount:true
        }
    })

    
  
    return {
       totalUsers,
       totalCustomers,
       totalStaffs,
       totalOrders,
       totalReviews,
       totalRevenue
    }

}

const getUsersOverviewFromDB = async ()=>{
    const userWhereConditions:Prisma.UserWhereInput = {
        status:{
            not:"Deleted"
        }
    }
    const total = await prisma.user.count({
        where:userWhereConditions
    }) 

    const totalActive = await prisma.user.count({
        where:{
            status:"Active"
        }
    }) 

    const totalSuspended = await prisma.user.count({
        where:{
            status:"Suspended"
        }
    }) 

    const totalDeleted =  await prisma.user.count({
        where:{
            status:"Deleted"
        }
    }) 
  
    const startDate = new Date()
    startDate.setDate(startDate.getDate()-2)
    const endDate = new Date()
    
    const totalRecentlyJoined = await prisma.user.count({
      where:{
        createdAt:{
            gte:startDate,
            lte:endDate
        }
      }
    }) 

    return {
        total,
        totalActive,
        totalSuspended,
        totalDeleted,
        totalRecentlyJoined,
       
    }
}

const getOrdersOverviewFromDB = async ()=>{
    const total = await prisma.order.count({
        where:{
            status:{
                not:OrderStatus.Pending
            }
        }
    })

    const totalPlaced = await prisma.order.count({
        where:{
            status:OrderStatus.Placed
        }
    })

    const totalProcessing = await prisma.order.count({
        where:{
            status:OrderStatus.Processing
        }
    }) 

    const totalInTransit =  await prisma.order.count({
        where:{
            status:OrderStatus.InTransit
        }
    })

   const totalOutForDelivery =  await prisma.order.count({
        where:{
            status:OrderStatus.OutForDelivery
        }
    })


    const totalDelivered =  await prisma.order.count({
        where:{
            status:OrderStatus.Delivered
        }
    })

    const totalCanceled =  await prisma.order.count({
        where:{
            status:OrderStatus.Canceled
        }
    })

    const totalReturned =  await prisma.order.count({
        where:{
            status:OrderStatus.Returned
        }
    })

    const totalYetToDelivery =  await prisma.order.count({
        where:{
            status:{
                in:[OrderStatus.Processing,OrderStatus.InTransit,OrderStatus.OutForDelivery]
            }
        }
    })

    const totalRunningOrder =  await prisma.order.count({
        where:{
            status:{
                in:[OrderStatus.Placed,OrderStatus.Processing,OrderStatus.InTransit,OrderStatus.OutForDelivery]
            }
        }
    })

    return {
        total,
        totalPlaced,
        totalProcessing,
        totalInTransit,
        totalOutForDelivery,
        totalDelivered,
        totalReturned,
        totalCanceled,
        totalYetToDelivery,
        totalRunningOrder
    }
}


const OverviewServices = {
    getAllOverviewDataFromDB,
    getUsersOverviewFromDB,
    getOrdersOverviewFromDB
}

export default OverviewServices