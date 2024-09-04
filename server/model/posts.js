const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");

class Post {
  static col() {
    return db.collection("posts");
  }

  static async findAll() {
    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: "user",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$author",
      },
    });

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    return await this.col().aggregate(pipeline).toArray();
  }

  static async findByAuthorId(userId) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "authorId",
          as: "posts",
        },
      },
    ];

    return await this.col().aggregate(pipeline).toArray();
  }

  static async findByPkWithAuthor(postId) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
    ];

    const result = await this.col().aggregate(pipeline).toArray();
    return result.length > 0 ? result[0] : null;
  }

  static async findByPk(postId) {
    return await this.col().findOne({ _id: new ObjectId(postId) });
  }

  static async addPost(newPost) {
    const result = await this.col().insertOne(newPost);

    return {
      ...newPost,
      _id: result.insertedId,
    };
  }

  static async deletePost(postId) {
    return await this.col().deleteOne({ _id: new ObjectId(postId) });
  }

  static async likePost({ postId }, like) {
    const result = await this.col().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          ...like,
        },
      }
    );

    return {
      ...like,
    };
  }

  static async addComment({ postId }, comment) {
    const result = await this.col().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          ...comment,
        },
      }
    );
    return {
      ...comment,
    };
  }
}

module.exports = Post;
