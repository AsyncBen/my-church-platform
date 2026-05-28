import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus, Search, ChevronRight } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { useLiveService } from "../hooks/useLiveService";

interface SermonNote {
  title: string;
  date: string;
  scripture: string;
  preview: string;
}

export default function SermonNotesScreen() {
  const navigation = useNavigation();
  const { scripture, currentService } = useLiveService();
  const { user } = useAuth();

  const [noteText, setNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      Alert.alert("Empty Note", "Please write something before saving.");
      return;
    }
    Alert.alert("Saved", "Your note has been saved.");
    setNoteText("");
  };

  const savedNotes: SermonNote[] = [
    {
      title: "Walking in Obedience",
      date: "May 21, 2026",
      scripture: "John 14:15–17",
      preview:
        "The Holy Spirit is our advocate and helper, living within us...",
    },
    {
      title: "The Power of Grace",
      date: "May 14, 2026",
      scripture: "Ephesians 2:8–9",
      preview:
        "Grace cannot be earned — it is freely given by a loving Father...",
    },
    {
      title: "Faith Over Fear",
      date: "May 7, 2026",
      scripture: "Isaiah 41:10",
      preview:
        "God's promises are our foundation in every season of life...",
    },
  ];

  const filteredNotes = savedNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={16} color="#0D1B3E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sermon Notes</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {}}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Create new note"
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={14} color="#7B7464" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search notes..."
                placeholderTextColor="#C0B8B0"
                accessibilityLabel="Search notes"
              />
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Active Note Editor */}
            <View style={styles.activeNoteCard}>
              <View style={styles.currentSermonBadge}>
                <Text style={styles.currentSermonText}>Current Sermon</Text>
              </View>
              <Text style={styles.noteTitle}>
                {currentService?.title ?? "No active sermon"}
              </Text>
              <Text style={styles.scriptureText}>
                {scripture?.reference ?? "No scripture yet"}
              </Text>
              <TextInput
                style={[
                  styles.noteTextArea,
                  isNoteFocused && styles.noteTextAreaFocused,
                ]}
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Write your reflections here..."
                placeholderTextColor="#C0B8B0"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => setIsNoteFocused(true)}
                onBlur={() => setIsNoteFocused(false)}
                accessibilityLabel="Write sermon notes"
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Save notes"
              >
                <Text style={styles.saveButtonText}>Save Notes</Text>
              </TouchableOpacity>
            </View>

            {/* Past Notes */}
            <Text style={styles.sectionTitle}>Past Notes</Text>
            {filteredNotes.map((note, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pastNoteCard}
                onPress={() => {}}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`View note: ${note.title}`}
              >
                <View style={styles.pastNoteHeader}>
                  <Text style={styles.pastNoteTitle}>{note.title}</Text>
                  <ChevronRight size={13} color="#B0A89A" />
                </View>
                <Text style={styles.pastNoteScripture}>{note.scripture}</Text>
                <Text style={styles.pastNotePreview} numberOfLines={2}>
                  {note.preview}
                </Text>
                <Text style={styles.pastNoteDate}>{note.date}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F5F0",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE6",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B3A7A",
  },
  searchContainer: {
    backgroundColor: "#F7F5F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 14,
    color: "#0D1B3E",
    fontFamily: SANS,
    padding: 0,
  },
  scrollContent: {
    padding: 16,
  },
  activeNoteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1B3A7A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currentSermonBadge: {
    backgroundColor: "#EDF0F8",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  currentSermonText: {
    color: "#1B3A7A",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: SANS,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 4,
    fontFamily: SERIF,
  },
  scriptureText: {
    fontSize: 11,
    color: "#C4933A",
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: SANS,
  },
  noteTextArea: {
    backgroundColor: "#F7F5F0",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#0D1B3E",
    lineHeight: 22,
    fontFamily: SANS,
    minHeight: 100,
    borderWidth: 2,
    borderColor: "transparent",
  },
  noteTextAreaFocused: {
    borderColor: "#1B3A7A",
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 12,
    fontFamily: SERIF,
  },
  pastNoteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pastNoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pastNoteTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
    flex: 1,
  },
  pastNoteScripture: {
    fontSize: 10,
    color: "#C4933A",
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: SANS,
  },
  pastNotePreview: {
    fontSize: 11,
    color: "#7B7464",
    lineHeight: 18,
    fontFamily: SANS,
    marginBottom: 8,
  },
  pastNoteDate: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
});