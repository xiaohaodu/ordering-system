import { exec } from "child_process";
import chalk from "chalk";
const args = process.argv.splice(2);
let buildPath = "";
if (args[0] == "-f" || args[0] == "-frontend") {
  buildPath = "./ordering-system-frontend";
} else if (args[0] == "-b" || args[0] == "-backend") {
  buildPath = "./ordering-system-backend";
} else {
  // console.log(chalk.red("请确定您的参数为-f/-frontend或者-b/-backend"));
  // return
  throw new Error("请确定您的参数为-f/-frontend或者-b/-backend");
}
const start = new Date();
exec("npm run build", { cwd: buildPath }, (error, stdout, stderr) => {
  if (error) {
    console.log("error\n", error, "\nstdout\n", stdout, "\nstderr\n", stderr);
  } else {
    const end = new Date();
    console.log(`构建完成,花费${(end - start) / 1000}秒`);
    exec("npm run copy");
  }
});
