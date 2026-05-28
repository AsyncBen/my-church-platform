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
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, Send, User, Trash2 } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { prayerService } from "../services/prayer.service";

interface PrayerItem {
  id: string;
  text: string;
  category: string;
  isAnonymous: boolean;
  prayerCount: number;
  createdAt: string;
  userId: string;
  user: {
    name: string;
  };
}

export default function PrayerScreen() {
  const { token, user } = useAuth();
  const [prayingIds, setPrayingIds] = useState<Set<string>>(new Set());
  const [prayerText, setPrayerText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState("Personal");
  const [isPrayerFocused, setIsPrayerFocused] = useState(false);
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prayed, setPrayed] = useState<Set<string>>(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [prayerToDelete, setPrayerToDelete] = useState<string | null>(null);

  const categories = [
    "Personal",
    "Family",
    "Health",
    "Work",
    "Community",
    "Praise",
  ];

  const fetchPrayers = async () => {
    try {
      const data = await prayerService.getAll(token!);
      setPrayers(data);
    } catch (err) {
      console.warn("[prayer] Failed to fetch prayers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handlePrayerToggle = async (id: string) => {
    // Prevent clicking while already praying or if already prayed
    if (prayed.has(id) || prayingIds.has(id)) return;
    
    // Add to praying set to disable button immediately
    setPrayingIds((prev) => new Set(prev).add(id));
    
    try {
      await prayerService.pray(id, token!);
      setPrayed((prev) => new Set(prev).add(id));
      await fetchPrayers();
    } catch (err) {
      console.warn("[prayer] Failed to pray:", err);
    } finally {
      setPrayingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!prayerText.trim()) return;
    setSubmitting(true);
    try {
      await prayerService.create(
        { text: prayerText, category, isAnonymous },
        token!
      );
      setPrayerText("");
      setIsAnonymous(false);
      await fetchPrayers();
    } catch (err) {
      console.warn("Prayer submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePress = (id: string) => {
    setPrayerToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prayerToDelete) return;
    
    try {
      await prayerService.delete(prayerToDelete, token!);
      setPrayers((prev) => prev.filter((p) => p.id !== prayerToDelete));
      setPrayed((prev) => {
        const next = new Set(prev);
        next.delete(prayerToDelete);
        return next;
      });
    } catch (err) {
      console.warn("[prayer] Failed to delete:", err);
    } finally {
      setDeleteModalVisible(false);
      setPrayerToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setPrayerToDelete(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
        {/* Sticky Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Prayer Wall</Text>
              <Text style={styles.headerSubtitle}>
                Lift each other up in prayer
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Submit Prayer Section */}
          <View style={styles.submitCard}>
            <View style={styles.submitHeader}>
              <View style={styles.heartIconContainer}>
                <Heart size={14} color="#1B3A7A" />
              </View>
              <Text style={styles.submitTitle}>Share a Prayer Request</Text>
            </View>

            {/* Category Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        category === c ? "#1B3A7A" : "#F0EDE6",
                    },
                  ]}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${c} category`}
                  accessibilityState={{ selected: category === c }}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: category === c ? "#FFFFFF" : "#7B7464",
                      },
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Prayer Text Input */}
            <TextInput
              style={[
                styles.prayerInput,
                isPrayerFocused && styles.prayerInputFocused,
              ]}
              value={prayerText}
              onChangeText={setPrayerText}
              placeholder="Share your prayer request with the community..."
              placeholderTextColor="#C0B8B0"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              onFocus={() => setIsPrayerFocused(true)}
              onBlur={() => setIsPrayerFocused(false)}
              accessibilityLabel="Write your prayer request"
            />

            {/* Anonymous Toggle */}
            <TouchableOpacity
              style={styles.anonymousToggle}
              onPress={() => setIsAnonymous(!isAnonymous)}
              activeOpacity={0.7}
              accessibilityRole="switch"
              accessibilityLabel="Post anonymously"
              accessibilityState={{ checked: isAnonymous }}
            >
              <View
                style={[
                  styles.toggleTrack,
                  {
                    backgroundColor: isAnonymous ? "#1B3A7A" : "#E0DDD8",
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      left: isAnonymous ? 22 : 2,
                    },
                  ]}
                />
              </View>
              <Text style={styles.anonymousText}>Post anonymously</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Submit prayer request"
            >
              <Send size={13} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {submitting ? "Submitting..." : "Submit Prayer Request"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Community Prayers Section */}
          <Text style={styles.sectionTitle}>Community Prayers</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading prayers...</Text>
            </View>
          ) : prayers.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>No prayer requests yet</Text>
            </View>
          ) : (
            prayers.map((prayer) => {
              const isOwnPrayer = prayer.userId === user?.id;
              const isPraying = prayed.has(prayer.id) || prayingIds.has(prayer.id);
              const currentCount = prayer.prayerCount;

              return (
                <View key={prayer.id} style={styles.prayerCard}>
                  {/* Prayer Card Header */}
                  <View style={styles.prayerHeader}>
                    <View style={styles.prayerUserInfo}>
                      <View style={styles.avatarContainer}>
                        <User size={13} color="#1B3A7A" />
                      </View>
                      <View>
                        <Text style={styles.prayerUserName}>
                          {prayer.isAnonymous
                            ? "Anonymous"
                            : prayer.user.name}
                        </Text>
                        <Text style={styles.prayerTime}>
                          {formatTime(prayer.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.prayerCategoryBadge}>
                      <Text style={styles.prayerCategoryText}>
                        {prayer.category}
                      </Text>
                    </View>
                  </View>

                  {/* Prayer Text */}
                  <Text style={styles.prayerText}>{prayer.text}</Text>

                  {/* Prayer Action Row */}
                  <View style={styles.prayerActionRow}>
                    <TouchableOpacity
                      onPress={() => handlePrayerToggle(prayer.id)}
                      disabled={isOwnPrayer || prayingIds.has(prayer.id)}
                      style={[
                        styles.prayerAction,
                        {
                          backgroundColor: isPraying ? "#EDF0F8" : "#F7F5F0",
                          opacity: isOwnPrayer ? 0.5 : 1,
                        },
                      ]}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isOwnPrayer 
                          ? "You cannot pray for your own request" 
                          : isPraying 
                            ? "Already prayed" 
                            : "Pray for this"
                      }
                    >
                      <Heart
                        size={12}
                        fill={isPraying ? "#1B3A7A" : "none"}
                        color={isPraying ? "#1B3A7A" : "#7B7464"}
                      />
                      <Text
                        style={[
                          styles.prayerActionText,
                          {
                            color: isPraying ? "#1B3A7A" : "#7B7464",
                          },
                        ]}
                      >
                        {isOwnPrayer 
                          ? "Your request" 
                          : isPraying 
                            ? "Praying" 
                            : "Pray for this"} · {currentCount}
                      </Text>
                    </TouchableOpacity>

                    {isOwnPrayer && (
                      <TouchableOpacity
                        onPress={() => handleDeletePress(prayer.id)}
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Delete your prayer request"
                      >
                        <Trash2 size={12} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Trash2 size={24} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Prayer Request?</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. Are you sure you want to delete this prayer request?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleDeleteCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={handleDeleteConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  // Header Styles
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#7B7464",
    marginTop: 2,
    fontFamily: SANS,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  // Submit Card Styles
  submitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  submitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  heartIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDF0F8",
    alignItems: "center",
    justifyContent: "center",
  },
  submitTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  categoriesScroll: {
    marginBottom: 12,
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: SANS,
  },
  prayerInput: {
    backgroundColor: "#F7F5F0",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#0D1B3E",
    lineHeight: 22,
    fontFamily: SANS,
    minHeight: 100,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  prayerInputFocused: {
    borderColor: "#1B3A7A",
    backgroundColor: "#FFFFFF",
  },
  // Anonymous Toggle Styles
  anonymousToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  toggleTrack: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    position: "relative",
  },
  toggleThumb: {
    position: "absolute",
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  anonymousText: {
    fontSize: 11,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // Submit Button Styles
  submitButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },
  // Section Title Styles
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  // Loading Styles
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 13,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  // Prayer Card Styles
  prayerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  prayerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  prayerHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prayerActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  prayerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDF0F8",
    alignItems: "center",
    justifyContent: "center",
  },
  prayerUserName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  prayerTime: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  prayerCategoryBadge: {
    backgroundColor: "#EDF0F8",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  prayerCategoryText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1B3A7A",
    fontFamily: SANS,
  },
  prayerText: {
    fontSize: 11,
    color: "rgba(13,27,62,0.8)",
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: SANS,
  },
  prayerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  prayerActionText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: "#7B7464",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: SANS,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F0EDE6",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7B7464",
    fontFamily: SANS,
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  modalDeleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: SANS,
  },
});