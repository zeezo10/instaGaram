import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
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

const Register = gql`
  mutation Register($form: UserForm) {
    register(form: $form) {
      _id
      username
      name
      email
    }
  }
`;

export default function RegisterFn({ navigation }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [doRegister, { loading }] = useMutation(Register);

  const handleRegister = async () => {
    try {
      const result = await doRegister({
        variables: {
          form: {
            username: username,
            name: name,
            password: password,
            email: email,
          },
        },
      });

      console.log(result);
      console.log({ username, name, password, email });

      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
        ></TextInput>
        <TextInput
          style={{
            backgroundColor: "white",
            height: 40,
            width: "100%",
            paddingLeft: 10,
          }}
          placeholder="Eamil"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
        <Button title="Sign Up" onPress={handleRegister}></Button>
        <View style={{ flexDirection:"row", justifyContent:"center"}}>
          <Text>already have acount </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "blue" }}>Login</Text>
        </Pressable>
        </View>
      </View>
    </View>
  );
}
