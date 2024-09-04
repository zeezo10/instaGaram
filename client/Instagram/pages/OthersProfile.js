import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { GET_PROFILE } from "./Profile";

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

const GET_USER = gql`
  query Profile($userId: String) {
    profile(userId: $userId) {
      user {
        _id
        username
        name
        email
      }
      followers {
        _id
        username
        name
        email
      }
      followings {
        _id
        username
        name
        email
      },
      posts {
        _id
        imgUrl
      }
      
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

export default function OthersProfile({ navigation, route }) {
  const id = route.params._id;  

  const [_id , set_Id] = useState("")

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: id },
  });

  const [doFollow] = useMutation(FOLLOW_USER,{refetchQueries:[GET_USER,GET_PROFILE]});

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
        const username = await SecureStore.getItemAsync("_id");
        set_Id(username);
      } catch (error) {
        console.log("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);
  


  if (loading) return MyComponent;

  if (error) return `Error! ${error}`;


  const userData = data.profile
  
  const userPosts = userData.posts.slice().reverse()
  
  return (
    <View>
      <View
        style={{
          backgroundColor: "red",
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
              }}
            ></View>

            <View>
              <View
                style={{
                  height: 60,
                  width: 250,
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flex: 2,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                <Text style={{fontSize:20 ,fontWeight:"bold"}}>{data.profile.posts.length}</Text>
                  <Text>posts</Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Text style={{fontSize:20 ,fontWeight:"bold"}}>{data.profile.followers.length}</Text>
                  <Text>Follower</Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Text style={{fontSize:20 ,fontWeight:"bold"}}>{data.profile.followings.length}</Text>
                  <Text>Following</Text>
                </View>
              </View>
                  {id !== _id ? (

                    <Button title="Follow" onPress={() => handleFollow(id)}></Button>

                  ): (<></>)}
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
            <Text style={{fontSize:20 ,fontWeight:"bold"}}>{data.profile.user.username}</Text>
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
                  onPress={() => navigation.navigate("Detail-Post",{_id: el._id})}
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
