import AppError from "../../Errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import { ICreateDiscountPayload, IFilterDiscount, IUpdateDiscountPayload } from "./discount.interface";

const createDiscountIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateDiscountPayload,
) => {
  const discount = await prisma.discount.findUnique({
    where: {
      code: payload.code,
    },
  });

  if (discount)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Discount coupon is already exist using this code.Try unique code",
    );

  const { customersId, categoriesId } = payload;

  //   Check customer existence
  if (customersId && customersId.length) {
    const customers = await prisma.customer.findMany({
      where: {
        id: {
          in: customersId,
        },
        user: {
          status: {
            not: "Deleted",
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (customers.length !== customersId.length) {
      const filterCustomerIds = customers.filter(
        (item) => customersId.includes(item.id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Customer not found customers id ${filterCustomerIds.join(",")}`,
      );
    }
  }

  //   Check category existence
  if (categoriesId && categoriesId.length) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoriesId,
        },
      },
      select: {
        id: true,
      },
    });

    if (categories.length !== categories.length) {
      const filterCategoryIds = categories.filter(
        (item) => categoriesId.includes(item.id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Category not found categories id ${filterCategoryIds.join(",")}`,
      );
    }
  }

 const result =  await prisma.$transaction(async (txClient) => {
   const createdDiscount =  await txClient.discount.create({
      data: payload,
    });

    if(customersId && customersId.length){
        for(let i=0;i<customersId.length;i++){
          await txClient.discountCustomerId.create({
            data:{
                customerId:customersId[i],
                discountId:createdDiscount.id
            }
          })
        }
    }

    if(categoriesId && categoriesId.length){
        for(let i=0;i<categoriesId.length;i++){
          await txClient.discountCategoryId.create({
            data:{
                categoryId:categoriesId[i],
                discountId:createdDiscount.id
            }
          })
        }
    }

    // Create activity log 
    await txClient.activityLog.create({
        data:{
            staffId:authUser.staffId!,
            action:`Created Discount.code:${createdDiscount.code} id:${createdDiscount.id}`
        }
    })
    return createDiscountIntoDB
  });

  return result
};


const UpdateDiscountIntoDB = async (authUser:IAuthUser,id:string,payload:IUpdateDiscountPayload)=>{
    const discount = await prisma.discount.findUnique({
        where:{
            id
        }
    })
    if(!discount) throw new AppError(httpStatus.NOT_FOUND,"Discount not found")

    if(payload.code && payload.code !== discount.code){
        const findDiscountByCode = await prisma.discount.findUnique({
            where:{
                code:payload.code
            }
        })

        if(findDiscountByCode)  throw new AppError(httpStatus.NOT_ACCEPTABLE,"Code is used in another discount.Try another code") 
    }


    const {newCustomersId:customersId,newCategoriesId:categoriesId} = payload
      //   Check customer existence
  if (customersId && customersId.length) {
    const customers = await prisma.customer.findMany({
      where: {
        id: {
          in:customersId,
        },
        user: {
          status: {
            not: "Deleted",
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (customers.length !== customersId.length) {
      const filterCustomerIds = customers.filter(
        (item) => customersId.includes(item.id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Customer not found customers id ${filterCustomerIds.join(",")}`,
      );
    }
  }

  //   Check category existence
  if (categoriesId && categoriesId.length) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoriesId,
        },
      },
      select: {
        id: true,
      },
    });

    if (categories.length !== categories.length) {
      const filterCategoryIds = categories.filter(
        (item) => categoriesId.includes(item.id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Category not found categories id ${filterCategoryIds.join(",")}`,
      );
    }
  }
   
    const result = await prisma.$transaction(async(txClient)=>{
    await txClient.discount.update({
        where:{
            id
        },
        data:payload
    })

    // const {} =
    })
}


const getDiscountsFromDB = async (filter:IFilterDiscount,paginationOptions:IPaginationOptions)=>{
   


}