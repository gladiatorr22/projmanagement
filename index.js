import dotenv from "dotenv"

dotenv.config({
    path:"./.env",
})

let myname = process.env.database
console.log(myname);

console.log("start of a project");
