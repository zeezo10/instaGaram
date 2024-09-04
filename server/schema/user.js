const User = require("../model/users");
const { hashPassword, comparePassword } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const { db } = require("../config/mongodb");
const { ObjectId } = require("mongodb");
const userTypeDefs = `#graphql

type User{
    _id: String ,
    username: String,
    name: String ,
    email: String ,
    access_token:String
}



type UserResponse {
  user: User,
  followers: [User],
  followings: [User]
  posts: [Post]
}


type Query{
    users: [User]
    profile(userId:String):UserResponse
    searchUser(username: String):User
}

input UserForm{
    username: String!,
    name: String! ,
    email: String! ,
    password: String!
}

type Mutation{
    register(form: UserForm):User,

    login(username:String, password:String):User,

}

`;

const userResolvers = {
  // for get method
  Query: {
    users: async () => {
      return await User.findAll();
    },

    //----------------- PROFILE ----------------------------------------

    profile: async (parent, { userId }) => {
      const user = await User.findByPK(userId);
      if (!user) {
        throw new Error("not found");
      }

      let followers = [];
      let followings = [];

      const posts = await db
        .collection("posts")
        .find({ authorId: new ObjectId(userId) })
        .toArray();

      let follower = await db
        .collection("follow")
        .aggregate([
          {
            $match: {
              followingId: user._id,
            },
          },

          {
            $lookup: {
              from: "user",
              localField: "followerId",
              foreignField: "_id",
              as: "follower",
            },
          },

          {
            $unwind: {
              path: "$follower",
            },
          },
        ])
        .toArray();111

      let following = await db
        .collection("follow")
        .aggregate([
          {
            $match: {
              followerId: user._id,
            },
          },

          {
            $lookup: {
              from: "user",
              localField: "followingId",
              foreignField: "_id",
              as: "following",
            },
          },

          {
            $unwind: {
              path: "$following",
            },
          },
        ])
        .toArray();

      follower.map((el) => {
        followers.push(el.follower);
      });

      following.map((el) => {
        followings.push(el.following);
      });

      return {
        user,
        followers,
        followings,
        posts,
      };
    },

    searchUser: async (parent, { username }) => {
      const result = await User.findByUsername(username);

      return result;
    },
  },

  // for method post put delete

  Mutation: {
    //------------- REGISTER --------------
    register: async (parent, { form }) => {
      try {
        const newUser = {
          ...form,
          password: hashPassword(form.password),
        };

        return await User.create(newUser);
      } catch (error) {
        console.log(error);
      }
    },

    //--------------- LOGIN ------------------

    login: async (parent, { username, password }) => {
      const user = await User.findByUsername(username, password);
      if (!user) {
        throw new Error("invalid password or Username");
      }

      isValidPassword = comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new Error("invalid password or Username");
      }

      user.access_token = signToken({ _id: user._id });

      return user;
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolvers,
};
