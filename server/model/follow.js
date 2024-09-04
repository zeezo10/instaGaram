const {ObjectId} = require("mongodb")
const {db} = require("../config/mongodb")

class Follow {
    
    static col(){
        return db.collection("follow")
    }

    static async follow(newFollow){
        const result = await this.col().insertOne(newFollow)
        return {
            ...newFollow,
            _id: result.insertedId
        }
    }

}


module.exports = Follow