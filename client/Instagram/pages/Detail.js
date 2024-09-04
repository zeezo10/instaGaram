import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { GET_PROFILE } from "./Profile";

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

export const GET_POST_BY_ID = gql`
  query PostById($postId: String) {
    postById(postId: $postId) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        username
        name
        email
        access_token
      }
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: String, $username: String) {
    addLike(postId: $postId, username: $username)
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($postId: String) {
    deletePost(postId: $postId) {
      _id
    }
  }
`;

export default function Detail({ navigation, route }) {
  const [doLike] = useMutation(ADD_LIKE, {
    refetchQueries: [GET_POST_BY_ID],
  });
  const [doDelete] = useMutation(DELETE_POST, {
    refetchQueries: [GET_PROFILE],
  });

  const _id = route.params._id;

  const [username, setUsername] = useState("");

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { postId: _id },
  });

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await SecureStore.getItemAsync("username");
        setUsername(username);
      } catch (error) {
        console.log("Error fetching user ID:", error);
      }
    };

    fetchUsername();
  }, []);

  if (loading) return MyComponent;

  if (error) {
    console.log(error);
  }

  let post = data.postById;

  const handleLike = async (id) => {
    try {
      await doLike({
        variables: {
          postId: id,
          username: username,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      
      await doDelete({
        variables: { postId: id },
      });

      navigation.goBack();
    } catch (error) {}
  };

  
  return (
    <View
      style={{
        height: 650,
        width: "100%",
        backgroundColor: "white",
        marginBottom: 10,
        flexDirection: "column",
        padding: 10,
        borderColor: "grey",
        borderBottomWidth: 2,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 5,
          gap: 10,
          borderColor: "grey",
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("Others-profile", { _id: post.author._id })
          }
          style={{
            backgroundColor: "salmon",
            height: 50,
            width: 50,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: "gainsboro",
            flex: 1,
          }}
        ></Pressable>
        <Text style={{ flex: 6 }}>{post.author.username}</Text>
        {route.params.from === "profile" ? (
          <Pressable
            style={{ flex: 1, color: "red" }}
            onPress={() => handleDelete(post._id)}
          >
            <Text>Delete</Text>
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          backgroundColor: "gainsboro",
          width: "100%",
          flex: 6,
        }}
      >
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{
            uri: `${post.imgUrl}`,
          }}
        />
      </View>
      <View style={{ backgroundColor: "white", flex: 2 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable
              style={{
                height: 30,
                width: 30,
                borderRadius: 100,
                justifyContent: "center",
              }}
              onPress={() => handleLike(post._id)}
            >
              <MaterialCommunityIcons
                name="cards-heart-outline"
                size={24}
                color="black"
              />
            </Pressable>
            <Text style={{ marginLeft: -6 }}>{post.likes.length}</Text>

            <Pressable
              style={{
                height: 30,
                width: 30,
                borderRadius: 100,
                justifyContent: "center",
              }}
              onPress={() =>
                navigation.navigate("Comment", { _id: post._id, from: "home" })
              }
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 2, borderTopWidth: 2, borderColor: "grey" }}>
          {post.comments.length !== 0 ? (
            <View>
              {post.comments
                .slice(-3)
                .reverse()
                .map((el, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 5,
                      gap: 10,
                    }}
                  >
                    <View
                      key={index + el}
                      style={{
                        backgroundColor: "cornflowerblue",
                        height: 20,
                        width: 20,
                        borderRadius: 100,
                        borderWidth: 2,
                      }}
                    ></View>
                    <Text key={index}>{el.content}</Text>
                  </View>
                ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
