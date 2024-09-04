import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { GET_POSTS } from "./Home";
import { GET_PROFILE } from "./Profile";

const ADD_POST = gql`
  mutation AddNewPost($form: PostForm) {
    addNewPost(form: $form) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      author {
        _id
        username
        name
        email
        access_token
      }
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
    }
  }
`;

export default function AddPost({ navigation }) {
  const [doAddPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS,GET_PROFILE],
  });

  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  console.log(imgUrl);
  

  const HandleAddPost = async () => {

    const splitTags = tags.split(" ")

    try {
      await doAddPost({
        
        variables: { form: { content: title, imgUrl: imgUrl, tags: splitTags } },
      });

      
      setTitle("")
      setImgUrl("")
      setTags("")
      
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }

  
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    keyboardVerticalOffset={100}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ backgroundColor: "white", padding: 20, flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ height: 313, width: 313, backgroundColor: "grey" }}>
            <Image
              source={{
                uri: `${imgUrl}`,
              }}
              style={{ height: "100%" }}
            />
          </View>

          <TextInput
            placeholder="Title"
            style={{
              backgroundColor: "gainsboro",
              marginTop: 30,
              height: 40,
              width: "100%",
              paddingLeft: 10,
            }}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="imgUrl"
            style={{
              backgroundColor: "gainsboro",
              marginTop: 30,
              height: 40,
              width: "100%",
              paddingLeft: 10,
            }}
            value={imgUrl}
            onChangeText={setImgUrl}
          />
          <TextInput
            placeholder="tags"
            style={{
              backgroundColor: "gainsboro",
              marginTop: 30,
              height: 40,
              width: "100%",
              paddingLeft: 10,
            }}
            value={tags}
            onChangeText={setTags}
          />
          <View style={{ padding: 50 }}>
            <View style={{ gap: 20, flexDirection: "row" }}>
              <Button title="cancel" onPress={() => navigation.goBack("Home")} />
              <Button title="save" onPress={HandleAddPost} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}
