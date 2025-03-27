import app from "./app";
import RunningServices from "./modules/Running/running.service";

const port = 5000;
async function main() {
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
