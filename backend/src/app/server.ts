import app from "./app";
import OverviewServices from "./modules/Overview/overview.service";
import prisma from "./shared/prisma";

const port = 5000;
async function main() {
  try {
    app.listen(port, () => {
      console.log("GadgetGalaxy Server is Running on Port:", port);
    });

    // const  res = await OverviewServices.getProductsOverviewFromDB()
    // console.log(res)
  } catch (error) {
    console.log(error);
  }
}

main();
