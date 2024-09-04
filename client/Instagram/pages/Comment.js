import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Button,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GET_POST_BY_ID } from "./Detail";
import Octicons from "react-native-vector-icons/Octicons";
import { GET_POSTS } from "./Home";
import { FlatList } from "react-native";

const ADD_COMMENT = gql`
  mutation AddComment($postId: String!, $content: String!) {
    addComment(postId: $postId, content: $content)
  }
`;

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

export default function Comment({ route, navigation }) {
  const _id = route.params._id;
  const from = route.params.from;

  const [comment, setComment] = useState("");

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { postId: _id },
  });

  const [doAddComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POSTS, GET_POST_BY_ID],
  });

//=-------------------------------

  if (loading) return MyComponent;

  if (error) return `Error! ${error}`;

  const comments = data.postById.comments.slice().reverse(); 
  

 
  const handelAddComment = async () => {
    try {
      const result = await doAddComment({
        variables: { postId: _id, content: comment },
      });

      if (from === "home") {
        navigation.goBack();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
       <Pressable style={{backgroundColor:"rad", height:200}} onPress={() => navigation.goBack()
    }></Pressable>
      <View
        style={{
          height: "75%",
          
          backgroundColor: "rgba(255, 255, 255, 0.99)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-around",
          }}
        >
          <TextInput
            style={{
              borderBottomColor: "black",
              flex: 5,
              borderRadius: 0,
              borderBottomWidth: 2,
            }}
            value={comment}
            onChangeText={setComment}
            placeholder="Enter Your Comment"
          ></TextInput>
          <View
            style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}
          >
            <Pressable
              title="post"
              onPress={handelAddComment}
              style={{
                height: "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Octicons name="paper-airplane" size={40} color="black" />
            </Pressable>
          </View>
        </View>
        <View style={{ height: 558, padding: 10, gap: 10 }}>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={{ borderBottomWidth : 2, borderColor:"grey", flexDirection:"row",gap:10, height:40 , alignItems:"center"}}>
                <Text>{item.username} :</Text>
                <Text>{item.content}</Text>
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
