import { ConnectDB } from "./Database/server";
import app  from "./app";
import { config } from "dotenv";

config({
    path : "./.env"
})

ConnectDB()
.then(()=> {
    app.listen(process.env.PORT || 5000,() => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    } )
    app.get("/", (req, res) => {
        res.send("API is running....");
    });
})
.catch((error : any) => {
    console.log("MongoDB Connection Failed", error);
});