import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/Login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddPost from "./pages/AddPost";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import OthersProfile from "./pages/OthersProfile";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import client from "./config/apolloClient";
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native-paper";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import Comment from "./pages/Comment";
import Register from "./pages/Register";
import Feather from "react-native-vector-icons/Feather";

import Ionicons from "react-native-vector-icons/Ionicons";
import SideBar from "./components/SideBar";

const HeaderButton = ({ onPress }) => (
  <Pressable onPress={onPress} style={{ marginRight: 10 }}>
    <Ionicons name="menu" size={24} color="black" />
  </Pressable>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTab({navigation}) {


  
  const renderHeaderButton = () => (
    <HeaderButton onPress={() => navigation.navigate("Logout") }  />
  );

  return (
    <ApolloProvider client={client}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "HomeTap") {
              iconName = focused ? "home" : "home";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search";
            } else if (route.name === "Add Post") {
              iconName = focused ? "plus-square" : "plus-square";
            } else if (route.name === "Profile") {
              iconName = focused ? "user" : "user";
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 65,
          },
        })}
      >
        <Tab.Screen
          name="HomeTap"
          options={{ headerShown: false, title: "" }}
          component={Home}
        />
        <Tab.Screen
          name="Search"
          options={{ headerShown: false, title: "" }}
          component={Search}
        />
        <Tab.Screen
          name="Add Post"
          options={{ headerShown: false, title: "" }}
          component={AddPost}
        />
        <Tab.Screen
          name="Profile"
          options={{  title: "", headerRight: renderHeaderButton }}
          component={Profile}
        />
      </Tab.Navigator>
    </ApolloProvider>
  );
}

export const AuthContext = createContext(null);

export default function App({navigation}) {
  const [isLogin, setLogin] = useState();
  const [loading, setLoading] = useState(true);

  const cekToken = async () => {
    const access_token = await SecureStore.getItemAsync("access_token");
    if (access_token) {
      setLogin(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    cekToken();
  }, []);

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 50 }}>Waiting</Text>
      </View>
    );
  }

  

  return (
    <AuthContext.Provider value={{ isLogin, setLogin }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            {!isLogin ? (
              <Stack.Screen name="Login" component={Login} options={{headerShown : false}} />
            ) : (
              <Stack.Screen
                name="Home"
                component={MainTab}
                options={{
                  title: "InstaGaram",
                }}
              />
            )}
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="Detail-Post"
              component={Detail}
              options={{ title: "InstaGaram" }}
            />
            <Stack.Screen
              name="Others-profile"
              component={OthersProfile}
              options={{ title: "InstaGaram" }}
            />
            <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
              <Stack.Screen
                name="Comment"
                component={Comment}
                options={{ headerShown: false }}
              />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
              <Stack.Screen
                name="Logout"
                component={SideBar}
                options={{ headerShown: false }}
              />
            </Stack.Group>


          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
