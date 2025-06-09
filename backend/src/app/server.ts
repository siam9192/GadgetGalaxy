import app from "./app";
import config from "./config";
import RunningServices from "./modules/Running/running.service";
import UserServices from "./modules/User/user.service";

const port = 5000;
async function main() {
  //  await UserServices.createSupperAdmin()
  try {
    app.listen(port, () => {
      console.log("GadgetGalaxy Server is Running on Port:", port);
    });

    RunningServices.Running();
  } catch (error) {
    console.log(error);
  }
}

main();
