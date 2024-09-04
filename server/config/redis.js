require("dotenv").config()
const Redis = require("ioredis");
const redis = new Redis({
    port: 16085, 
    host: "redis-16085.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com", 
    username: "default",
    password: process.env.REDIS_PASS ,
    db: 0, 
});

module.exports = redis