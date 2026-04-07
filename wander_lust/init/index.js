const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://localhost:27017/wander_lust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
    // Clear out existing data
    await Listing.deleteMany({});
    
    // In order for the application to work smoothly and not crash when we test ownership, 
    // we need to set an owner for the seed data. Let's find a user, or if none exists, exit and ask to create one first.
    const users = await User.find({});
    
    if (users.length === 0) {
        console.log("\n⚠️ No users found in the database!");
        console.log("Please start the app and register a user first, then run this seed script.");
        console.log("Example user: username: admin, password: password\n");
        process.exit();
    }
    
    const ownerId = users[0]._id;
    console.log(`Setting owner of seeded listings to user: ${users[0].username} (${ownerId})`);
    
    // Add owner to all sample listings
    initData.data = initData.data.map((obj) => ({ ...obj, owner: ownerId }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB().then(() => {
  mongoose.connection.close();
});
