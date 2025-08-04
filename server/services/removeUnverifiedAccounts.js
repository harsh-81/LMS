import cron from "node-cron";
import {User} from "../models/userModel.js";
// import {User, user} from "../models/userModel.js"; pehle aisi thi upar wali line

export const removeUnverifiedAccounts = ()=> {
    cron.schedule("*/5 * * * *", async()=>{
        const thirtyMinutesAgo = new Date(Date.now()- 30*60*1000);
        await User.deleteMany({
            accountVerified: false,
            createdAt: {$lt: thirtyMinutesAgo},
        });
    });
};