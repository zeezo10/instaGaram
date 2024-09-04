import React from "react";
import { Pressable, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AuthContext } from "../App";

export default function SideBar({ navigation }) {
  const { setLogin } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("_id");
      await SecureStore.deleteItemAsync("username");
      setLogin(false);
      navigation.navigate("Login")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Pressable
      style={{
        backgroundColor: "white",
        height: 50,
        marginTop: 80,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={handleLogout}
    >
      <Text> log out</Text>
    </Pressable>
    <Pressable style={{backgroundColor:"rad", height:"100%"}} onPress={() => navigation.goBack()
    }></Pressable>
    </>
  );
}
