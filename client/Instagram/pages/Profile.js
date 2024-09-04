import { StyleSheet, Text, View, ScrollView, Pressable, Image } from "react-native";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";
import { data } from "autoprefixer";

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

export const GET_PROFILE = gql`
  query Profile($userId: String) {
    profile(userId: $userId) {
      user {
        _id
        username
        name
      }
      followers {
        _id
        username
        name
        email
        access_token
      }
      followings {
        _id
        username
        name
        email
        access_token
      }
      posts {
        _id
        imgUrl
      }
    }
  }
`;

export default function Profile({ navigation, route }) {
  const { setLogin } = useContext(AuthContext);

  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState("");

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

  const MyComponent = () => (
    <ActivityIndicator animating={true} color={MD2Colors.red800} />
  );

  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { userId: userId },
  });

  if (loading) return MyComponent;

  if (error) return `Error! ${error}`;

  let dataUser = data.profile;
  console.log(dataUser);
  
  
  let userPosts = data.profile.posts.slice().reverse()
  

    
  return (
    
    <View>
      <View
        style={{
          backgroundColor: "orange",
          width: "100%",
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
      ></View>

      <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
        <View
          style={{
            height: 200,
            justifyContent: "center",
            gap: 10,
            borderBottomWidth: 2,
            borderColor: "lightgray",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              
            }}
          >
            <View
              style={{
                backgroundColor: "lightblue",
                height: 100,
                width: 100,
                borderRadius: 100,
                borderWidth: 5,
                borderColor: "lightgray",
                overflow: "hidden", 
              }}
            >
              <Image
               style={{ height: "100%", width: "100%" }}
               source={require("../assets/Remini20210619200429392.jpg")}
               resizeMode="cover"/>
            </View>
         
            <View style={{ height: 60, width: 250, flexDirection: "row" }}>
              <View
                style={{
                  flex: 2,
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Text style={{fontSize:20,fontWeight:"bold"}}>{dataUser.posts.length}</Text>
                <Text>posts</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Text style={{fontSize:20,fontWeight:"bold"}}>{dataUser.followers.length}</Text>
                <Text>Follower</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Text style={{fontSize:20 ,fontWeight:"bold"}}>{dataUser.followings.length}</Text>
                <Text>Following</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 30,
              width: 150,
              marginLeft: 15,

              paddingLeft: 19,
            }}
          >
            <Text style={{fontSize:20 ,fontWeight:"bold"}}>{dataUser.user.username}</Text>
          </View>
        </View>

        <ScrollView>
          <View
            style={{
              height: "100%",
              flexDirection: "row",
              padding: 10,

              flexWrap: "wrap",
              gap: 5,
            }}
          >
            

                {userPosts.map((el) => (
                  <Pressable
                  key={el._id}
                    style={{
                      backgroundColor: "lightsalmon",
                      width: 120,
                      height: 120,
                    }}
                    onPress={() => navigation.navigate("Detail-Post",{_id: el._id, from: "profile"})}
                  >
                    <Image 
                      source={{
                        uri: `${el.imgUrl}`,
                      }}
                      style={{height:"100%"}}
                      />
                  </Pressable>

                ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
