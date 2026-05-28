import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus, Search, ChevronRight } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";
import { useLiveService } from "../hooks/useLiveService";
import { sermonNoteService, SermonNote } from "../services/sermon-note.service";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../navigation/navigation";

export default function SermonNotesScreen() {
  const navigation = useNavigation();
  const { scripture } = useLiveService();

  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SermonNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const route = useRoute<RouteProp<MainStackParamList, 'SermonNotes'>>();
  const { serviceId, serviceTitle } = route.params || {}; 

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3 seconds
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const notes = await sermonNoteService.getAll();
      setSavedNotes(notes);
    } catch (err) {
      console.warn("[sermon-notes] Failed to fetch notes:", err);
      // Set error state to show inline error message
      setError("Failed to load your notes. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      showNotification('error', 'Please write something before saving.');
      return;
    }

    try {
      setIsSaving(true);
      
      await sermonNoteService.create({
        sermonId: serviceId,
        title: noteTitle.trim() || serviceTitle || "Untitled Note",
        scripture: scripture?.reference,
        content: noteText.trim(),
      });
      
      showNotification('success', 'Your note has been saved successfully!');
      setNoteText("");
      setNoteTitle("");
      fetchNotes();
    } catch (err: any) {
      showNotification('error', `Failed to save: ${err?.message || "Unknown error"}`);
      console.error("[sermon-notes] Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await sermonNoteService.delete(noteId);
              showNotification('success', 'Note deleted successfully!');
              fetchNotes();
            } catch (err) {
              showNotification('error', 'Failed to delete note.');
              console.warn("[sermon-notes] Failed to delete note:", err);
            }
          },
        },
      ]
    );
  };

  const filteredNotes = savedNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.scripture?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
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
          <View style={styles.addButton}>
            <Plus size={16} color="#FFFFFF" />
          </View>
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

        {/* Notification Banner */}
        {notification && (
          <View style={[
            styles.notificationBanner,
            notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
          ]}>
            <Text style={[
              styles.notificationText,
              notification.type === 'success' ? styles.notificationTextSuccess : styles.notificationTextError
            ]}>
              {notification.type === 'success' ? '✓ ' : '✗ '}
              {notification.message}
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => {
                setError(null);
                fetchNotes();
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

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
              <Text style={styles.currentSermonText}>
                {serviceTitle ? `Notes for: ${serviceTitle}` : "New Note"}
              </Text>
            </View>

            {serviceTitle && (
              <>
                <Text style={styles.noteTitle}>{serviceTitle}</Text>
                {scripture?.reference && (
                  <Text style={styles.scriptureText}>{scripture.reference}</Text>
                )}
              </>
            )}

            <TextInput
              style={styles.titleInput}
              value={noteTitle}
              onChangeText={setNoteTitle}
              placeholder="Note title..."
              placeholderTextColor="#C0B8B0"
              accessibilityLabel="Note title"
            />

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
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveNote}
              activeOpacity={0.8}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel="Save notes"
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Notes</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Past Notes */}
          <Text style={styles.sectionTitle}>
            Past Notes ({filteredNotes.length})
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#1B3A7A" size="large" />
              <Text style={styles.loadingText}>Loading your notes...</Text>
            </View>
          ) : filteredNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No notes match your search"
                  : "No notes yet. Write your first note above!"}
              </Text>
            </View>
          ) : (
            filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.pastNoteCard}
                onPress={() => handleDeleteNote(note.id)}
                onLongPress={() => handleDeleteNote(note.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`View note: ${note.title}`}
                accessibilityHint="Long press to delete"
              >
                <View style={styles.pastNoteHeader}>
                  <Text style={styles.pastNoteTitle}>{note.title}</Text>
                  <ChevronRight size={13} color="#B0A89A" />
                </View>
                {note.scripture && (
                  <Text style={styles.pastNoteScripture}>{note.scripture}</Text>
                )}
                <Text style={styles.pastNotePreview} numberOfLines={2}>
                  {note.content}
                </Text>
                <Text style={styles.pastNoteDate}>
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            ))
          )}
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
  titleInput: {
    backgroundColor: "#F7F5F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#0D1B3E",
    fontFamily: SANS,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
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
  saveButtonDisabled: {
    opacity: 0.7,
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
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: "#7B7464",
    fontFamily: SANS,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    color: "#7B7464",
    fontFamily: SANS,
    textAlign: "center",
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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: "#991B1B",
    fontSize: 12,
    fontFamily: SANS,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: SANS,
  },
  notificationBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  notificationError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  notificationText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: SANS,
    flex: 1,
  },
  notificationTextSuccess: {
    color: '#065F46',
  },
  notificationTextError: {
    color: '#991B1B',
  },
});