import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useId, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Ionicons from 'react-native-vector-icons/Ionicons';


const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

const SEARCH_USER = gql`
  query SearchUser($username: String) {
    searchUser(username: $username) {
      _id
      username
      name
    }
  }
`;

const FOLLOW_USER = gql`
  mutation Follow($followingId: String) {
    follow(followingId: $followingId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export default function Search({ navigation, route }) {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");

  const { data, loading, error, refetch } = useQuery(SEARCH_USER, {
    variables: { username: "" },
    skip: true,
  });

  const [doFollow] = useMutation(FOLLOW_USER);

  //-------------------------------------------------
  const handleSearch = async () => {
    try {
      const result = await refetch({ username });
      if (result.data.searchUser) {
        setUser(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (_id) => {
    try {
      await doFollow({
        variables: { followingId: _id },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync("_id");
        setUserId(id);
      } catch (error) {
        console.log("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleGoToProfile = () => {
    if (userId !== user.data.searchUser._id) {
      navigation.navigate("Others-profile", {
        _id: user.data.searchUser._id,
      });
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          height: 70,
          alignItems: "center",
          gap: 5,
          margin: 10,
          borderBottomWidth : 2
        }}
      >
        <TextInput
          style={{
            backgroundColor: "gainsboro",
            height: 50,
            paddingLeft: 20,
            flex: 4,
          }}
          placeholder="Search For Someone"
          value={username}
          onChangeText={setUsername}
        ></TextInput>
        <View style={{ flex: 1}}>
          <Pressable onPress={handleSearch}
            style={{ flexDirection:"row" ,justifyContent:"center"}}
          >
            <Ionicons name="search" size={40} color="black" />
          </Pressable>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            height: "100%",
            margin: 10,
            gap: 5,
            backgroundColor: "white",
          }}
        >
          {user.data ? (
            <Pressable
              onPress={handleGoToProfile}
              style={{
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: "lightgrey",
                height: 120,
                flexDirection: "row",
                alignItems: "center",
                padding: 5,
                gap: 15,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  backgroundColor: "lightgreen",
                  borderWidth: 5,
                  borderColor: "lightgrey",
                  height: 90,
                  width: 90,
                  borderRadius: 100,
                }}
              ></View>
              <View
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  width: 200,
                  height: 50,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>{user.data.searchUser.username}</Text>
              </View>

              <View>
                {userId !== user.data.searchUser._id ? (
                  <Button
                    title="follow"
                    onPress={() => handleFollow(user.data.searchUser._id)}
                  ></Button>
                ) : (
                  <Text>It's Me</Text>
                )}
              </View>
            </Pressable>
          ) : (
            <View>
              <Text></Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
