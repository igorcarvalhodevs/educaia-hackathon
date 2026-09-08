import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.brand}>EducaIA</Text>

        <Text style={styles.greeting}>
          Olá, {user?.name || "Professor"}
        </Text>

        <Text style={styles.subtitle}>
          Crie e gerencie seus planejamentos pedagógicos com apoio de
          inteligência artificial.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("NewPlanning")}
        >
          <Text style={styles.primaryButtonText}>
            Novo planejamento
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Plannings")}
        >
          <Text style={styles.secondaryButtonText}>
            Meus planejamentos
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 72,
    backgroundColor: "#F5F7FA",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 32,
  },

  greeting: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    opacity: 0.7,
  },

  actions: {
    gap: 16,
  },

  primaryButton: {
    minHeight: 58,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 58,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5DAE1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    alignSelf: "center",
    padding: 16,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.65,
  },
});