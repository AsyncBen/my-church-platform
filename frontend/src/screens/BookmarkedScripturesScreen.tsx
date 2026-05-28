import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Bookmark, Search, Trash2, Share2 } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface BookmarkedScripture {
  id: string;
  reference: string;
  text: string;
  date: string;
  version: string;
}

export default function BookmarkedScripturesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkedScripture[]>([
    {
      id: "1",
      reference: "John 14:15–17",
      text: "If you love me, keep my commands. And I will ask the Father, and he will give you another advocate to help you and be with you forever — the Spirit of truth.",
      date: "May 21, 2026",
      version: "NIV",
    },
    {
      id: "2",
      reference: "Ephesians 2:8–9",
      text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.",
      date: "May 14, 2026",
      version: "NIV",
    },
    {
      id: "3",
      reference: "Isaiah 41:10",
      text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
      date: "May 7, 2026",
      version: "NIV",
    },
    {
      id: "4",
      reference: "Psalm 23:1–4",
      text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
      date: "April 28, 2026",
      version: "NIV",
    },
  ]);

  const handleRemove = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
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
        <Text style={styles.headerTitle}>Bookmarked Scriptures</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={14} color="#7B7464" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search bookmarks..."
            placeholderTextColor="#C0B8B0"
            accessibilityLabel="Search bookmarks"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookmarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Bookmark size={48} color="#D1CEC8" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No bookmarks found" : "No bookmarked scriptures"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Bookmark scriptures during service to see them here"}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              {filteredBookmarks.length} {filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </Text>
            
            {filteredBookmarks.map((bookmark) => (
              <View key={bookmark.id} style={styles.bookmarkCard}>
                <View style={styles.bookmarkHeader}>
                  <View style={styles.referenceBadge}>
                    <Text style={styles.referenceText}>{bookmark.reference}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => {}}
                      accessibilityLabel="Share scripture"
                    >
                      <Share2 size={14} color="#7B7464" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleRemove(bookmark.id)}
                      accessibilityLabel="Remove bookmark"
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.scriptureText}>{bookmark.text}</Text>
                
                <View style={styles.bookmarkFooter}>
                  <Text style={styles.versionText}>{bookmark.version}</Text>
                  <Text style={styles.dateText}>{bookmark.date}</Text>
                </View>
              </View>
            ))}
          </>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  headerSpacer: {
    width: 36,
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
    flexGrow: 1,
  },
  countText: {
    fontSize: 11,
    color: "#7B7464",
    marginBottom: 12,
    fontFamily: SANS,
    fontWeight: "500",
  },
  bookmarkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#C4933A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookmarkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  referenceBadge: {
    backgroundColor: "#EDF0F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  referenceText: {
    color: "#1B3A7A",
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: SANS,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F5F0",
  },
  scriptureText: {
    fontSize: 14,
    color: "#0D1B3E",
    lineHeight: 22,
    fontFamily: SERIF,
    marginBottom: 12,
  },
  bookmarkFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  versionText: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  dateText: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#7B7464",
    textAlign: "center",
    fontFamily: SANS,
    paddingHorizontal: 40,
  },
  bottomSpacer: {
    height: 16,
  },
});