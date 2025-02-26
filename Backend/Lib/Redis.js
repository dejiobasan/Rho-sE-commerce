const Redis = require("ioredis");
require("dotenv").config();


// Create a new Redis instance
const redis = new Redis(process.env.UPSTASH_REDIS_URL);


module.exports = redis;





