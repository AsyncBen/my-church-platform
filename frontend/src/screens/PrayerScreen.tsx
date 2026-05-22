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
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Heart, Send, User, ArrowLeft } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface Prayer {
  name: string;
  text: string;
  cat: string;
  time: string;
  count: number;
}

interface Props {
  prayerText: string;
  setPrayerText: (v: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (v: boolean) => void;
  liked: number[];
  setLiked: (fn: (l: number[]) => number[]) => void;
  onSubmitPrayer?: () => void;
  onBack?: () => void;
}

export default function PrayerScreen({
  prayerText,
  setPrayerText,
  isAnonymous,
  setIsAnonymous,
  liked,
  setLiked,
  onSubmitPrayer,
  onBack,
}: Props) {
  const [category, setCategory] = useState("Personal");
  const [isPrayerFocused, setIsPrayerFocused] = useState(false);

  const categories = [
    "Personal",
    "Family",
    "Health",
    "Work",
    "Community",
    "Praise",
  ];

  const prayers: Prayer[] = [
    {
      name: "Sarah M.",
      text: "Please pray for my mother's recovery from surgery. God, be her strength.",
      cat: "Health",
      time: "1h ago",
      count: 24,
    },
    {
      name: "Anonymous",
      text: "Praying for guidance in a major life decision. I need wisdom and peace.",
      cat: "Personal",
      time: "3h ago",
      count: 41,
    },
    {
      name: "David K.",
      text: "PRAISE! After months of searching God opened a new door. He is faithful!",
      cat: "Praise",
      time: "5h ago",
      count: 88,
    },
  ];

  const handlePrayerToggle = (index: number) => {
    setLiked((prevLiked) => {
      const isPraying = prevLiked.includes(index);
      return isPraying
        ? prevLiked.filter((x) => x !== index)
        : [...prevLiked, index];
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
        >
          {/* Sticky Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              {onBack && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onBack}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <ArrowLeft size={18} color="#0D1B3E" />
                </TouchableOpacity>
              )}
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
                style={styles.submitButton}
                onPress={onSubmitPrayer}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Submit prayer request"
              >
                <Send size={13} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  Submit Prayer Request
                </Text>
              </TouchableOpacity>
            </View>

            {/* Community Prayers Section */}
            <Text style={styles.sectionTitle}>Community Prayers</Text>

            {prayers.map((prayer, index) => {
              const isPraying = liked.includes(index);
              const currentCount = prayer.count + (isPraying ? 1 : 0);

              return (
                <View key={index} style={styles.prayerCard}>
                  {/* Prayer Card Header */}
                  <View style={styles.prayerHeader}>
                    <View style={styles.prayerUserInfo}>
                      <View style={styles.avatarContainer}>
                        <User size={13} color="#1B3A7A" />
                      </View>
                      <View>
                        <Text style={styles.prayerUserName}>
                          {prayer.name}
                        </Text>
                        <Text style={styles.prayerTime}>{prayer.time}</Text>
                      </View>
                    </View>
                    <View style={styles.prayerCategoryBadge}>
                      <Text style={styles.prayerCategoryText}>
                        {prayer.cat}
                      </Text>
                    </View>
                  </View>

                  {/* Prayer Text */}
                  <Text style={styles.prayerText}>{prayer.text}</Text>

                  {/* Prayer Action Button */}
                  <TouchableOpacity
                    onPress={() => handlePrayerToggle(index)}
                    style={[
                      styles.prayerAction,
                      {
                        backgroundColor: isPraying ? "#EDF0F8" : "#F7F5F0",
                      },
                    ]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isPraying ? "Remove prayer" : "Pray for this"
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
                      {isPraying ? "Praying" : "Pray for this"} ·{" "}
                      {currentCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
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
});