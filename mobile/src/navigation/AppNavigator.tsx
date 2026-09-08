import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";

import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { NewPlanningScreen } from "../screens/NewPlanningScreen";
import { PlanningsScreen } from "../screens/PlanningsScreen";
import { PlanningDetailScreen } from "../screens/PlanningDetailScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewPlanning: undefined;
  Plannings: undefined;

  PlanningDetail: {
    id: string;
  };
};

const Stack =
  createNativeStackNavigator<
    RootStackParamList
  >();

export function AppNavigator() {
  const {
    signedIn,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={
                HomeScreen
              }
              options={{
                headerShown:
                  false,
              }}
            />

            <Stack.Screen
              name="NewPlanning"
              component={
                NewPlanningScreen
              }
              options={{
                title:
                  "Novo planejamento",
              }}
            />

            <Stack.Screen
              name="Plannings"
              component={
                PlanningsScreen
              }
              options={{
                title:
                  "Meus planejamentos",
              }}
            />

            <Stack.Screen
              name="PlanningDetail"
              component={
                PlanningDetailScreen
              }
              options={{
                title:
                  "Planejamento",
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={
              LoginScreen
            }
            options={{
              headerShown:
                false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles =
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },
  });