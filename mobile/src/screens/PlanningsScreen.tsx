import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "Plannings"
  >;

type Planning = {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: number;

  generatedContent: string;

  createdAt: string;
  updatedAt: string;
};

export function PlanningsScreen({
  navigation,
}: Props) {
  const { token } =
    useAuth();

  const [plannings, setPlannings] =
    useState<Planning[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadPlannings =
    useCallback(
      async (
        isRefresh = false
      ) => {
        if (!token) {
          setError(
            "Sessão inválida. Faça login novamente."
          );

          setLoading(false);
          setRefreshing(false);

          return;
        }

        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await api<
              Planning[]
            >(
              "/plannings",
              {
                method: "GET",
                token,
              }
            );

          setPlannings(
            response
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os planejamentos.";

          setError(message);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [token]
    );

  useFocusEffect(
    useCallback(() => {
      loadPlannings();
    }, [loadPlannings])
  );

  if (loading) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Carregando planejamentos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }
          onRefresh={() =>
            loadPlannings(
              true
            )
          }
        />
      }
    >
      <Text
        style={styles.title}
      >
        Meus planejamentos
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Consulte, revise e
        gerencie seus planos
        de aula.
      </Text>

      {error ? (
        <View
          style={
            styles.errorContainer
          }
        >
          <Text
            style={
              styles.errorTitle
            }
          >
            Não foi possível
            carregar
          </Text>

          <Text
            style={
              styles.errorMessage
            }
          >
            {error}
          </Text>

          <Pressable
            style={
              styles.retryButton
            }
            onPress={() =>
              loadPlannings()
            }
          >
            <Text
              style={
                styles.retryButtonText
              }
            >
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!error &&
      plannings.length ===
        0 ? (
        <View
          style={
            styles.emptyContainer
          }
        >
          <Text
            style={
              styles.emptyTitle
            }
          >
            Nenhum planejamento
            salvo
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Os planejamentos que
            você criar e salvar
            aparecerão aqui.
          </Text>
        </View>
      ) : null}

      {!error &&
        plannings.map(
          (planning) => (
            <Pressable
              key={
                planning.id
              }
              style={({
                pressed,
              }) => [
                styles.card,

                pressed &&
                  styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate(
                  "PlanningDetail",
                  {
                    id:
                      planning.id,
                  }
                )
              }
            >
              <View
                style={
                  styles.cardHeader
                }
              >
                <Text
                  style={
                    styles.subject
                  }
                >
                  {
                    planning.subject
                  }
                </Text>

                <View
                  style={
                    styles.durationBadge
                  }
                >
                  <Text
                    style={
                      styles.durationText
                    }
                  >
                    {
                      planning.duration
                    }{" "}
                    min
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.topic
                }
              >
                {
                  planning.topic
                }
              </Text>

              <Text
                style={
                  styles.grade
                }
              >
                {
                  planning.grade
                }
              </Text>

              <Text
                style={
                  styles.preview
                }
                numberOfLines={
                  4
                }
              >
                {
                  planning.generatedContent
                }
              </Text>

              <View
                style={
                  styles.cardFooter
                }
              >
                <Text
                  style={
                    styles.date
                  }
                >
                  Criado em{" "}
                  {formatDate(
                    planning.createdAt
                  )}
                </Text>

                <Text
                  style={
                    styles.openLabel
                  }
                >
                  Abrir →
                </Text>
              </View>
            </Pressable>
          )
        )}
    </ScrollView>
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "pt-BR"
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F5F7FA",
    },

    content: {
      padding: 24,
      paddingBottom: 48,
    },

    centerContainer: {
      flex: 1,
      backgroundColor:
        "#F5F7FA",
      alignItems: "center",
      justifyContent:
        "center",
      padding: 24,
    },

    loadingText: {
      fontSize: 14,
      marginTop: 14,
      opacity: 0.6,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      opacity: 0.65,
      marginBottom: 28,
    },

    errorContainer: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#D5DAE1",
      borderRadius: 12,
      padding: 20,
    },

    errorTitle: {
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 8,
    },

    errorMessage: {
      fontSize: 14,
      lineHeight: 21,
      opacity: 0.65,
      marginBottom: 18,
    },

    retryButton: {
      minHeight: 48,
      backgroundColor:
        "#111827",
      borderRadius: 10,
      alignItems: "center",
      justifyContent:
        "center",
    },

    retryButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },

    emptyContainer: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#D5DAE1",
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 8,
    },

    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      opacity: 0.6,
      textAlign: "center",
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        "#D5DAE1",
      padding: 18,
      marginBottom: 16,
    },

    cardPressed: {
      opacity: 0.75,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 10,
    },

    subject: {
      flex: 1,
      fontSize: 14,
      fontWeight: "700",
      opacity: 0.7,
      textTransform:
        "uppercase",
    },

    durationBadge: {
      backgroundColor:
        "#F3F4F6",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    durationText: {
      fontSize: 12,
      fontWeight: "700",
    },

    topic: {
      fontSize: 20,
      fontWeight: "800",
      marginBottom: 6,
    },

    grade: {
      fontSize: 14,
      opacity: 0.6,
      marginBottom: 16,
    },

    preview: {
      fontSize: 14,
      lineHeight: 21,
      opacity: 0.75,
    },

    cardFooter: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor:
        "#E5E7EB",
      marginTop: 18,
      paddingTop: 14,
    },

    date: {
      fontSize: 12,
      opacity: 0.5,
    },

    openLabel: {
      fontSize: 13,
      fontWeight: "700",
    },
  });