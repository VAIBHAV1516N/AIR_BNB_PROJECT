const mongoose= require ("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js")
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl); // Use deployment DB URL from environment
}

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj, owner: "68452cbf607744c9105314f5" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();