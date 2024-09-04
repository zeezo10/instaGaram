import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Pressable,
  Alert,
} from "react-native";

import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { gql, useMutation } from "@apollo/client";

import * as SecureStore from "expo-secure-store";

const LOGIN_USER = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      _id
      username
      name
      email
      access_token
    }
  }
`;

export default function Login({ navigation }) {
  const [doLogin, { loading }] = useMutation(LOGIN_USER);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setLogin } = useContext(AuthContext);

  const handelLogin = async () => {
    try {
      const result = await doLogin({
        variables: { username: username, password: password }
      });  
      
   
      await SecureStore.setItemAsync(
        "access_token",
        result.data.login.access_token
      );
      await SecureStore.setItemAsync(
        "_id",
        result.data.login._id
      );
      await SecureStore.setItemAsync(
        "username",
        result.data.login.username
      );
      setLogin(true);
      navigation.navigate('Home')
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ height: "100%", justifyContent: "center" }}>
      <View style={{ gap: 15, padding: 40 }}>
        <TextInput
          style={{
            backgroundColor: "white",
            height: 40,
            width: "100%",
            paddingLeft: 10,
          }}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        ></TextInput>
        <TextInput
          style={{
            backgroundColor: "white",
            height: 40,
            width: "100%",
            paddingLeft: 10,
          }}
          placeholder="Password"
        secureTextEntry={true}
            value={password}
          onChangeText={setPassword}
        ></TextInput>
        <Button
          title={`${loading ? "Login..." : "Login"}`}
          onPress={handelLogin}
        ></Button>
        <View style={{ flexDirection:"row", justifyContent:"center"}}>
          <Text>Don`t have acount yet </Text>
        <Pressable onPress={() => navigation.navigate("Register")} >
          <Text style={{color:"blue"}}>Register</Text>
        </Pressable>

        </View>
      </View>
    </View>
  );
}
