import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "PlanningDetail"
  >;

type Planning = {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: number;

  classSize?: number | null;
  learningLevel?: string | null;
  classProfile?: string | null;
  accessibilityNeeds?: string | null;
  resources?: string | null;
  internetAccess?: string | null;
  methodology?: string | null;

  generatedContent: string;

  createdAt: string;
  updatedAt: string;
};

export function PlanningDetailScreen({
  route,
  navigation,
}: Props) {
  const { id } = route.params;

  const { token } = useAuth();

  const [planning, setPlanning] =
    useState<Planning | null>(null);

  const [generatedContent, setGeneratedContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [edited, setEdited] =
    useState(false);

  const loadPlanning =
    useCallback(async () => {
      if (!token) {
        Alert.alert(
          "Sessão inválida",
          "Faça login novamente para continuar."
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await api<Planning>(
            `/plannings/${id}`,
            {
              method: "GET",
              token,
            }
          );

        setPlanning(response);

        setGeneratedContent(
          response.generatedContent
        );

        setEdited(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o planejamento.";

        Alert.alert(
          "Erro ao carregar",
          message
        );
      } finally {
        setLoading(false);
      }
    }, [id, token]);

  useFocusEffect(
    useCallback(() => {
      loadPlanning();
    }, [loadPlanning])
  );

  async function handleSave() {
    if (!planning) {
      return;
    }

    if (!generatedContent.trim()) {
      Alert.alert(
        "Conteúdo vazio",
        "O planejamento não pode ser salvo sem conteúdo."
      );

      return;
    }

    if (!token) {
      Alert.alert(
        "Sessão inválida",
        "Faça login novamente para continuar."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await api<Planning>(
          `/plannings/${planning.id}`,
          {
            method: "PUT",
            token,
            body: JSON.stringify({
              generatedContent:
                generatedContent.trim(),
            }),
          }
        );

      setPlanning(response);

      setGeneratedContent(
        response.generatedContent
      );

      setEdited(false);

      Alert.alert(
        "Alterações salvas",
        "O planejamento foi atualizado com sucesso."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o planejamento.";

      Alert.alert(
        "Erro ao salvar",
        message
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!planning) {
      return;
    }

    Alert.alert(
      "Excluir planejamento",
      "Tem certeza de que deseja excluir este planejamento? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Excluir",
          style: "destructive",

          onPress: async () => {
            if (!token) {
              return;
            }

            try {
              setDeleting(true);

              await api(
                `/plannings/${planning.id}`,
                {
                  method: "DELETE",
                  token,
                }
              );

              Alert.alert(
                "Planejamento excluído",
                "O planejamento foi removido com sucesso.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Não foi possível excluir o planejamento.";

              Alert.alert(
                "Erro ao excluir",
                message
              );

              setDeleting(false);
            }
          },
        },
      ]
    );
  }

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
          Carregando planejamento...
        </Text>
      </View>
    );
  }

  if (!planning) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <Text
          style={
            styles.notFoundTitle
          }
        >
          Planejamento não encontrado
        </Text>

        <Pressable
          style={
            styles.backButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={
            styles.subject
          }
        >
          {planning.subject}
        </Text>

        <Text
          style={
            styles.title
          }
        >
          {planning.topic}
        </Text>

        <Text
          style={
            styles.grade
          }
        >
          {planning.grade}
        </Text>

        <View
          style={
            styles.infoRow
          }
        >
          <Info
            label="Duração"
            value={`${planning.duration} min`}
          />

          {planning.classSize ? (
            <Info
              label="Alunos"
              value={String(
                planning.classSize
              )}
            />
          ) : null}
        </View>

        {planning.learningLevel ? (
          <Detail
            label="Nível de aprendizagem"
            value={
              planning.learningLevel
            }
          />
        ) : null}

        {planning.classProfile ? (
          <Detail
            label="Perfil da turma"
            value={
              planning.classProfile
            }
          />
        ) : null}

        {planning.accessibilityNeeds ? (
          <Detail
            label="Acessibilidade"
            value={
              planning.accessibilityNeeds
            }
          />
        ) : null}

        {planning.resources ? (
          <Detail
            label="Recursos"
            value={
              planning.resources
            }
          />
        ) : null}

        {planning.internetAccess ? (
          <Detail
            label="Acesso à internet"
            value={
              planning.internetAccess
            }
          />
        ) : null}

        {planning.methodology ? (
          <Detail
            label="Metodologia"
            value={
              planning.methodology
            }
          />
        ) : null}

        <View
          style={
            styles.divider
          }
        />

        <Text
          style={
            styles.sectionTitle
          }
        >
          Planejamento da aula
        </Text>

        <Text
          style={
            styles.reviewText
          }
        >
          Você pode revisar e editar o conteúdo
          abaixo antes de salvar novamente.
        </Text>

        <TextInput
          style={
            styles.generatedInput
          }
          value={generatedContent}
          onChangeText={(text) => {
            setGeneratedContent(text);
            setEdited(true);
          }}
          multiline
          textAlignVertical="top"
          editable={
            !saving &&
            !deleting
          }
        />

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,

            pressed &&
              edited &&
              styles.buttonPressed,

            (!edited ||
              saving ||
              deleting) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={
            !edited ||
            saving ||
            deleting
          }
        >
          {saving ? (
            <View
              style={
                styles.loadingButton
              }
            >
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.saveButtonText
                }
              >
                Salvando...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.saveButtonText
              }
            >
              {edited
                ? "Salvar alterações"
                : "Nenhuma alteração pendente"}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,

            pressed &&
              styles.deleteButtonPressed,

            deleting &&
              styles.buttonDisabled,
          ]}
          onPress={handleDelete}
          disabled={
            deleting ||
            saving
          }
        >
          {deleting ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={
                styles.deleteButtonText
              }
            >
              Excluir planejamento
            </Text>
          )}
        </Pressable>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <View
      style={
        styles.infoBox
      }
    >
      <Text
        style={
          styles.infoLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.infoValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({
  label,
  value,
}: DetailProps) {
  return (
    <View
      style={
        styles.detail
      }
    >
      <Text
        style={
          styles.detailLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.detailValue
        }
      >
        {value}
      </Text>
    </View>
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
      paddingBottom: 60,
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
      marginTop: 14,
      opacity: 0.6,
    },

    notFoundTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
    },

    backButton: {
      backgroundColor:
        "#111827",
      borderRadius: 10,
      paddingHorizontal: 24,
      paddingVertical: 14,
    },

    backButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    subject: {
      fontSize: 14,
      fontWeight: "700",
      opacity: 0.6,
      textTransform:
        "uppercase",
      marginBottom: 8,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 8,
    },

    grade: {
      fontSize: 15,
      opacity: 0.6,
      marginBottom: 24,
    },

    infoRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 18,
    },

    infoBox: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#D5DAE1",
      borderRadius: 10,
      padding: 14,
    },

    infoLabel: {
      fontSize: 12,
      opacity: 0.55,
      marginBottom: 4,
    },

    infoValue: {
      fontSize: 16,
      fontWeight: "700",
    },

    detail: {
      marginBottom: 16,
    },

    detailLabel: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 5,
    },

    detailValue: {
      fontSize: 14,
      lineHeight: 21,
      opacity: 0.7,
    },

    divider: {
      borderTopWidth: 1,
      borderTopColor:
        "#D5DAE1",
      marginVertical: 24,
    },

    sectionTitle: {
      fontSize: 21,
      fontWeight: "800",
      marginBottom: 8,
    },

    reviewText: {
      fontSize: 13,
      lineHeight: 19,
      opacity: 0.6,
      marginBottom: 16,
    },

    generatedInput: {
      minHeight: 440,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#D5DAE1",
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      lineHeight: 24,
    },

    saveButton: {
      minHeight: 56,
      backgroundColor:
        "#111827",
      borderRadius: 12,
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 22,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },

    loadingButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    buttonPressed: {
      opacity: 0.85,
    },

    buttonDisabled: {
      opacity: 0.55,
    },

    deleteButton: {
      minHeight: 54,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        "#DC2626",
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 14,
    },

    deleteButtonPressed: {
      opacity: 0.65,
    },

    deleteButtonText: {
      color: "#DC2626",
      fontWeight: "700",
      fontSize: 15,
    },

    date: {
      textAlign: "center",
      fontSize: 12,
      opacity: 0.45,
      marginTop: 20,
    },
  });