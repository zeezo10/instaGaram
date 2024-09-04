const User = require("../model/users");
const Follow = require("../model/follow");
const { ObjectId } = require("mongodb");

const followTypeDefs = `#graphql

type Follow{
    _id: String,
    followingId: String,
    followerId: String,
    createdAt: String,
    updatedAt: String,
}


input FollowForm {
    followingId: String!,
    
}


type Mutation {
    follow(followingId: String):Follow
}

`;

const followResolver = {
  Query: {},

  Mutation: {
    follow: async (parent, { followingId }, contextValue) => {
      const user = await contextValue.isAuth();

      const follow = {
        followerId: user._id,
        followingId: new ObjectId(followingId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return Follow.follow(follow);
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolver,
};
