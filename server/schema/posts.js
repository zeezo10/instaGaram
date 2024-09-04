const redis = require("../config/redis");
const Post = require("../model/posts");

const postTypeDefs = `#graphql

  type Post {
      _id: String,
      content: String,
      tags: [String],
      imgUrl: String,
      authorId: String,
      comments: [Comments],
      likes: [Likes],
      createdAt: String,
      updatedAt: String
      author: User
  }

  type Comments {
      content: String!,
      username: String!,
      createdAt: String!,
      updatedAt: String!
  }

  type Likes {
      username: String,
      createdAt: String ,
      updatedAt: String
  }


  type Query {
      posts: [Post]
      postById(postId: String):Post
  }

  input PostForm {
      content: String!,
      tags: [String]!,   
      imgUrl: String!,
          
    
  }

  type Mutation{
      addNewPost(form: PostForm):Post
      deletePost(postId:String):Post
      addComment(postId:String! ,content:String!):String
      addLike(postId:String! , username:String!):String
  }

  `;

const postResolvers = {
  Query: {
    posts: async (parent, args, contextValue) => {
      await redis.del("all_post");

      const user = await contextValue.isAuth();

      const getAllPost = await redis.get("all_post");
      if (getAllPost) {
        return JSON.parse(getAllPost);
      }
      const result = await Post.findAll();
      await redis.set("all_post", JSON.stringify(result));
      return result;
    },

    postById: async (parent, { postId }, contextValue) => {
      const post = await Post.findByPkWithAuthor(postId);

      return post;
    },
  },

  Mutation: {
    addNewPost: async (parent, { form }, contextValue) => {
      const user = await contextValue.isAuth();

      const date = new Date().toISOString();

      const newPost = {
        ...form,
        comments: [],
        likes: [],
        authorId: user._id,
        createdAt: date,
        updatedAt: date,
      };

      const result = await Post.addPost(newPost);

      await redis.del("all_post");

      return result;
    },

    deletePost: async (parent, { postId }, contextValue) => {
      const user = await contextValue.isAuth();

      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("not found");
      }

      await Post.deletePost(postId);
      await redis.del("all_post");
    },

    addLike: async (parent, { postId, username }, contextValue) => {
      const user = await contextValue.isAuth();

      const currentDate = new Date().toISOString();

      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("not found");
      }

      const alreadyLiked = post.likes.find((el) => el.username === username);
      if (alreadyLiked) {
        throw new Error("You already liked this post");
      }

      await Post.likePost(
        { postId },
        {
          likes: {
            username: user.username,
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        }
      );

      await redis.del("all_post");

      return "add Like successful";
    },

    addComment: async (parent, { postId, content }, contextValue) => {
      const user = await contextValue.isAuth();
      const currentDate = new Date().toISOString();

      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("not found");
      }

      await Post.addComment(
        { postId },
        {
          comments: {
            username: user.username,
            content,
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        }
      );
      await redis.del("all_post");

      return "add Comment successful";
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
