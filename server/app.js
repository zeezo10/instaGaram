require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolvers } = require("./schema/user");
const { postTypeDefs, postResolvers } = require("./schema/posts");
const { followTypeDefs, followResolver } = require("./schema/follow");
const { verifyToken } = require("./helper/jwt");
const User = require("./model/users");

async function startServer() {
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolver],
    introspection : true
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
    context: ({ req }) => {
      async function isAuth(params) {
        const authorization = req.headers.authorization || "";
        if (!authorization) {
          throw new Error("Invalid Token");
        }
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") {
          throw new Error("invalid token");
        }
        const payload = verifyToken(token, process.env.JWT_SECRET);

        const user = await User.findByPK(payload._id);

        return user;
      }

      return {
        isAuth,
      };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
