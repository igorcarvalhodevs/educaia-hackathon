import React, { useState } from "react";

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

import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { MarkdownContent } from "../components/MarkdownContent";

type GeneratePlanningResponse = {
  generatedContent: string;
  disclaimer: string;
};

type SavedPlanningResponse = {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: number;
  generatedContent: string;
};

type ViewMode =
  | "preview"
  | "edit";

export function NewPlanningScreen() {
  const { token } = useAuth();

  const [subject, setSubject] =
    useState("");

  const [grade, setGrade] =
    useState("");

  const [topic, setTopic] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [classSize, setClassSize] =
    useState("");

  const [
    learningLevel,
    setLearningLevel,
  ] = useState("");

  const [
    classProfile,
    setClassProfile,
  ] = useState("");

  const [
    accessibilityNeeds,
    setAccessibilityNeeds,
  ] = useState("");

  const [resources, setResources] =
    useState("");

  const [
    internetAccess,
    setInternetAccess,
  ] = useState("");

  const [
    methodology,
    setMethodology,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    generatedContent,
    setGeneratedContent,
  ] = useState("");

  const [
    disclaimer,
    setDisclaimer,
  ] = useState("");

  const [
    savedPlanningId,
    setSavedPlanningId,
  ] = useState<string | null>(null);

  const [viewMode, setViewMode] =
    useState<ViewMode>("preview");

  async function handleGenerate() {
    if (
      !subject.trim() ||
      !grade.trim() ||
      !topic.trim() ||
      !duration.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha disciplina, série/ano, tema e duração."
      );

      return;
    }

    const durationNumber =
      Number(duration);

    if (
      !Number.isInteger(
        durationNumber
      ) ||
      durationNumber <= 0
    ) {
      Alert.alert(
        "Duração inválida",
        "Informe a duração da aula em minutos."
      );

      return;
    }

    let classSizeNumber:
      | number
      | undefined;

    if (classSize.trim()) {
      classSizeNumber =
        Number(classSize);

      if (
        !Number.isInteger(
          classSizeNumber
        ) ||
        classSizeNumber <= 0
      ) {
        Alert.alert(
          "Quantidade inválida",
          "Informe uma quantidade válida de alunos."
        );

        return;
      }
    }

    if (!token) {
      Alert.alert(
        "Sessão inválida",
        "Faça login novamente para continuar."
      );

      return;
    }

    try {
      setLoading(true);

      setGeneratedContent("");
      setDisclaimer("");
      setSavedPlanningId(null);

      const response =
        await api<GeneratePlanningResponse>(
          "/plannings/generate",
          {
            method: "POST",
            token,

            body: JSON.stringify({
              subject:
                subject.trim(),

              grade:
                grade.trim(),

              topic:
                topic.trim(),

              duration:
                durationNumber,

              ...(classSizeNumber
                ? {
                    classSize:
                      classSizeNumber,
                  }
                : {}),

              ...(learningLevel.trim()
                ? {
                    learningLevel:
                      learningLevel.trim(),
                  }
                : {}),

              ...(classProfile.trim()
                ? {
                    classProfile:
                      classProfile.trim(),
                  }
                : {}),

              ...(accessibilityNeeds.trim()
                ? {
                    accessibilityNeeds:
                      accessibilityNeeds.trim(),
                  }
                : {}),

              ...(resources.trim()
                ? {
                    resources:
                      resources.trim(),
                  }
                : {}),

              ...(internetAccess.trim()
                ? {
                    internetAccess:
                      internetAccess.trim(),
                  }
                : {}),

              ...(methodology.trim()
                ? {
                    methodology:
                      methodology.trim(),
                  }
                : {}),
            }),
          }
        );

      setGeneratedContent(
        response.generatedContent
      );

      setDisclaimer(
        response.disclaimer
      );

      setViewMode("preview");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o planejamento.";

      Alert.alert(
        "Erro ao gerar planejamento",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!generatedContent.trim()) {
      Alert.alert(
        "Nenhum planejamento",
        "Gere um planejamento antes de salvar."
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

    const durationNumber =
      Number(duration);

    let classSizeNumber:
      | number
      | undefined;

    if (classSize.trim()) {
      classSizeNumber =
        Number(classSize);
    }

    try {
      setSaving(true);

      const response =
        await api<SavedPlanningResponse>(
          "/plannings",
          {
            method: "POST",
            token,

            body: JSON.stringify({
              subject:
                subject.trim(),

              grade:
                grade.trim(),

              topic:
                topic.trim(),

              duration:
                durationNumber,

              ...(classSizeNumber
                ? {
                    classSize:
                      classSizeNumber,
                  }
                : {}),

              ...(learningLevel.trim()
                ? {
                    learningLevel:
                      learningLevel.trim(),
                  }
                : {}),

              ...(classProfile.trim()
                ? {
                    classProfile:
                      classProfile.trim(),
                  }
                : {}),

              ...(accessibilityNeeds.trim()
                ? {
                    accessibilityNeeds:
                      accessibilityNeeds.trim(),
                  }
                : {}),

              ...(resources.trim()
                ? {
                    resources:
                      resources.trim(),
                  }
                : {}),

              ...(internetAccess.trim()
                ? {
                    internetAccess:
                      internetAccess.trim(),
                  }
                : {}),

              ...(methodology.trim()
                ? {
                    methodology:
                      methodology.trim(),
                  }
                : {}),

              generatedContent:
                generatedContent.trim(),
            }),
          }
        );

      setSavedPlanningId(
        response.id
      );

      setViewMode("preview");

      Alert.alert(
        "Planejamento salvo",
        "Seu planejamento foi salvo com sucesso."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o planejamento.";

      Alert.alert(
        "Erro ao salvar",
        message
      );
    } finally {
      setSaving(false);
    }
  }

  const fieldsDisabled =
    loading || saving;

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
        <Text style={styles.title}>
          Crie sua aula com IA
        </Text>

        <Text style={styles.subtitle}>
          Informe o contexto pedagógico da
          turma para que o EducaIA produza
          um planejamento adequado à sua
          realidade.
        </Text>

        <Text style={styles.sectionTitle}>
          Informações da aula
        </Text>

        <Field
          label="Disciplina *"
          placeholder="Ex.: História"
          value={subject}
          onChangeText={(text) => {
            setSubject(text);
            setSavedPlanningId(null);
          }}
          editable={!fieldsDisabled}
        />

        <Field
          label="Série / Ano *"
          placeholder="Ex.: 8º ano do Ensino Fundamental"
          value={grade}
          onChangeText={(text) => {
            setGrade(text);
            setSavedPlanningId(null);
          }}
          editable={!fieldsDisabled}
        />

        <Field
          label="Tema da aula *"
          placeholder="Ex.: Revolução Industrial"
          value={topic}
          onChangeText={(text) => {
            setTopic(text);
            setSavedPlanningId(null);
          }}
          multiline
          editable={!fieldsDisabled}
        />

        <Field
          label="Duração em minutos *"
          placeholder="Ex.: 50"
          value={duration}
          onChangeText={(text) => {
            setDuration(text);
            setSavedPlanningId(null);
          }}
          keyboardType="number-pad"
          editable={!fieldsDisabled}
        />

        <Text style={styles.sectionTitle}>
          Contexto da turma
        </Text>

        <Field
          label="Quantidade de alunos"
          placeholder="Ex.: 30"
          value={classSize}
          onChangeText={(text) => {
            setClassSize(text);
            setSavedPlanningId(null);
          }}
          keyboardType="number-pad"
          editable={!fieldsDisabled}
        />

        <Field
          label="Nível de aprendizagem"
          placeholder="Ex.: intermediário, heterogêneo..."
          value={learningLevel}
          onChangeText={(text) => {
            setLearningLevel(text);
            setSavedPlanningId(null);
          }}
          editable={!fieldsDisabled}
        />

        <Field
          label="Perfil da turma"
          placeholder="Descreva brevemente as características da turma."
          value={classProfile}
          onChangeText={(text) => {
            setClassProfile(text);
            setSavedPlanningId(null);
          }}
          multiline
          editable={!fieldsDisabled}
        />

        <Field
          label="Necessidades de acessibilidade"
          placeholder="Ex.: aluno com baixa visão, TDAH..."
          value={accessibilityNeeds}
          onChangeText={(text) => {
            setAccessibilityNeeds(text);
            setSavedPlanningId(null);
          }}
          multiline
          editable={!fieldsDisabled}
        />

        <Text style={styles.sectionTitle}>
          Recursos e metodologia
        </Text>

        <Field
          label="Recursos disponíveis"
          placeholder="Ex.: projetor, quadro, livros..."
          value={resources}
          onChangeText={(text) => {
            setResources(text);
            setSavedPlanningId(null);
          }}
          multiline
          editable={!fieldsDisabled}
        />

        <Field
          label="Acesso à internet"
          placeholder="Ex.: disponível, limitado ou indisponível"
          value={internetAccess}
          onChangeText={(text) => {
            setInternetAccess(text);
            setSavedPlanningId(null);
          }}
          editable={!fieldsDisabled}
        />

        <Field
          label="Metodologia desejada"
          placeholder="Ex.: aprendizagem baseada em problemas..."
          value={methodology}
          onChangeText={(text) => {
            setMethodology(text);
            setSavedPlanningId(null);
          }}
          multiline
          editable={!fieldsDisabled}
        />

        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed &&
              styles.buttonPressed,
            fieldsDisabled &&
              styles.buttonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={fieldsDisabled}
        >
          {loading ? (
            <View
              style={styles.loadingButton}
            >
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.generateButtonText
                }
              >
                Gerando planejamento...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.generateButtonText
              }
            >
              Gerar planejamento com IA
            </Text>
          )}
        </Pressable>

        <Text style={styles.helper}>
          * Campos obrigatórios
        </Text>

        {generatedContent ? (
          <View
            style={styles.resultContainer}
          >
            <Text
              style={styles.resultTitle}
            >
              Planejamento gerado
            </Text>

            <Text
              style={styles.reviewMessage}
            >
              Revise o planejamento antes
              de utilizá-lo em aula.
            </Text>

            <View
              style={styles.modeSelector}
            >
              <Pressable
                style={[
                  styles.modeButton,
                  viewMode === "preview" &&
                    styles.modeButtonActive,
                ]}
                onPress={() =>
                  setViewMode("preview")
                }
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    viewMode ===
                      "preview" &&
                      styles.modeButtonTextActive,
                  ]}
                >
                  Visualizar
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modeButton,
                  viewMode === "edit" &&
                    styles.modeButtonActive,
                ]}
                onPress={() =>
                  setViewMode("edit")
                }
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    viewMode ===
                      "edit" &&
                      styles.modeButtonTextActive,
                  ]}
                >
                  Editar
                </Text>
              </Pressable>
            </View>

            {viewMode === "preview" ? (
              <View
                style={
                  styles.previewContainer
                }
              >
                <MarkdownContent
                  content={
                    generatedContent
                  }
                />
              </View>
            ) : (
              <TextInput
                style={
                  styles.generatedInput
                }
                value={generatedContent}
                onChangeText={(text) => {
                  setGeneratedContent(
                    text
                  );

                  setSavedPlanningId(
                    null
                  );
                }}
                multiline
                textAlignVertical="top"
                editable={!saving}
              />
            )}

            {disclaimer ? (
              <Text
                style={styles.disclaimer}
              >
                {disclaimer}
              </Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,

                pressed &&
                  !savedPlanningId &&
                  styles.buttonPressed,

                (saving ||
                  Boolean(
                    savedPlanningId
                  )) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={
                saving ||
                Boolean(
                  savedPlanningId
                )
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
                  {savedPlanningId
                    ? "Planejamento salvo ✓"
                    : "Salvar planejamento"}
                </Text>
              )}
            </Pressable>

            {savedPlanningId ? (
              <Text
                style={
                  styles.savedMessage
                }
              >
                O planejamento está salvo
                em sua conta.
              </Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;

  onChangeText: (
    text: string
  ) => void;

  multiline?: boolean;

  keyboardType?:
    | "default"
    | "number-pad";

  editable?: boolean;
};

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
  editable = true,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline &&
            styles.multilineInput,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={
          multiline
            ? "top"
            : "center"
        }
        editable={editable}
        autoCorrect
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    padding: 24,
    paddingBottom: 64,
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
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 18,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D5DAE1",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    fontSize: 16,
  },

  multilineInput: {
    minHeight: 96,
    paddingTop: 14,
    paddingBottom: 14,
  },

  generateButton: {
    minHeight: 58,
    backgroundColor: "#111827",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 12,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  loadingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  helper: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.5,
    marginTop: 16,
  },

  resultContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D5DAE1",
  },

  resultTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  reviewMessage: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.6,
    marginBottom: 18,
  },

  modeSelector: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginBottom: 18,
  },

  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  modeButtonActive: {
    backgroundColor: "#111827",
  },

  modeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },

  modeButtonTextActive: {
    color: "#FFFFFF",
  },

  previewContainer: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 18,
  },

  generatedInput: {
    minHeight: 440,
    borderWidth: 1,
    borderColor: "#D5DAE1",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    padding: 16,
    fontSize: 15,
    lineHeight: 24,
  },

  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.55,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  saveButton: {
    minHeight: 58,
    backgroundColor: "#111827",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 24,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  savedMessage: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 12,
    opacity: 0.6,
  },
});