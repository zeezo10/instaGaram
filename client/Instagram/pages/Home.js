import {
  Text,
  View,
  ScrollView,
  Button,
  Pressable,
  Image,
  FlatList,
} from "react-native";

import React, { useContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Card from "../components/Card";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { AuthContext } from "../App";

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

export const GET_POSTS = gql`
  query Posts {
    posts {
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
      createdAt
      updatedAt
      author {
        _id
        username
        name
        email
      }
      likes {
        username
        createdAt
        updatedAt
      }
    }
  }
`;


export default function Home({ navigation, route }) {
  const { data, loading, error } = useQuery(GET_POSTS);

 

  const { setLogin } = useContext(AuthContext);

  if (loading) return MyComponent;

  if (error) return `Error! ${error}`;

  let post = data.posts;

 

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <View style={{ width: "100%", flex: 10 }}>
        <FlatList
          data={post}
          renderItem={({ item }) => (
            <Card post={item} key={item._id} navigation={navigation} />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
