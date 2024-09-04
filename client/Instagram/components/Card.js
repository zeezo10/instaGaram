import { from, gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_POSTS } from "../pages/Home";
import * as SecureStore from "expo-secure-store";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Text, View, ScrollView, Button, Pressable, Image } from "react-native";

const ADD_LIKE = gql`
  mutation AddLike($postId: String!, $username: String!) {
    addLike(postId: $postId, username: $username)
  }
`;

export default function Card({ post, navigation }) {
  const [doLike, { loading }] = useMutation(ADD_LIKE, {
    refetchQueries: [GET_POSTS],
  });
  const [username, setUsername] = useState("");

  const handleLike = async (id) => {
    try {

      console.log(id);
      console.log(username);
      
      await doLike({
        variables: {
          postId: id,
          username: username,
        },
      });
      
    } catch (error) {
      console.log(error.message);
    }
  };

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
          }}
        ></Pressable>
        <Text>{post.author.username}</Text>
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
            <Text style={{ marginLeft: -6 }}>{post.comments.length}</Text>

          </View>
        </View>

        <View style={{ flex: 2, borderTopWidth: 2, borderColor: "grey" }}>
          <View style={{ paddingLeft: 10, paddingTop: 6, paddingBottom: 6, flexDirection:"row", gap:7}}>
            <Text style={{ fontWeight: "bold" }}>{post.author.username}</Text>
            <Text style={{ }}>{post.content}</Text>
          </View>
          {post.comments.length !== 0 ? (
            <View>
              {post.comments
                .slice(-2)
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
                      key={el.content + el.createdAt}
                      style={{
                        backgroundColor: "cornflowerblue",
                        height: 20,
                        width: 20,
                        borderRadius: 100,
                        borderWidth: 2,
                      }}
                    ></View>
                    <Text key={el.content + el.createdAt + index}>
                      {el.content}
                    </Text>
                  </View>
                ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
