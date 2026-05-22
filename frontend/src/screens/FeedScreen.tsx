import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Bell, Heart, MessageCircle, Share2 } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface FeedItem {
  type: "announcement" | "devotional" | "sermon" | "testimony";
  title: string;
  body: string;
  time: string;
  likes: number;
  hasImage?: boolean;
  imageUrl?: string;
}

interface TypeStyle {
  color: string;
  bg: string;
  label: string;
}

interface Props {
  onNotification?: () => void;
  onComment?: (item: FeedItem, index: number) => void;
  onShare?: (item: FeedItem, index: number) => void;
}

export default function FeedScreen({ onNotification, onComment, onShare }: Props) {
  const [liked, setLiked] = useState<number[]>([]);

  const feedItems: FeedItem[] = [
    {
      type: "announcement",
      title: "Baptism Service",
      body: "We are celebrating new beginnings! Join us on June 1st as we witness the baptism of 12 new believers.",
      time: "2h ago",
      likes: 47,
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=390&h=130&fit=crop&auto=format",
    },
    {
      type: "devotional",
      title: "Morning Devotional",
      body: '"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7',
      time: "6h ago",
      likes: 93,
    },
    {
      type: "sermon",
      title: "New Sermon Posted",
      body: '"Walking in Obedience" by Pastor James is now available for replay. A powerful message on John 14.',
      time: "1d ago",
      likes: 156,
    },
    {
      type: "testimony",
      title: "God's Faithfulness",
      body: "Sharing how God opened a door for our family during a difficult season. Thank you for your prayers!",
      time: "2d ago",
      likes: 203,
    },
  ];

  const typeStyle: Record<string, TypeStyle> = {
    announcement: { color: "#1B3A7A", bg: "#EDF0F8", label: "Announcement" },
    devotional: { color: "#C4933A", bg: "#FDF6E8", label: "Devotional" },
    sermon: { color: "#6B3A7A", bg: "#F2EAF8", label: "Sermon" },
    testimony: { color: "#2D7A6A", bg: "#E8F5F2", label: "Testimony" },
  };

  const toggleLike = (index: number) => {
    setLiked((prevLiked) => {
      const isLiked = prevLiked.includes(index);
      return isLiked
        ? prevLiked.filter((x) => x !== index)
        : [...prevLiked, index];
    });
  };

  const getItemLikes = (item: FeedItem, index: number): number => {
    return item.likes + (liked.includes(index) ? 1 : 0);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Church Feed</Text>
            <Text style={styles.headerSubtitle}>
              Stay updated with your community
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotification}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={15} color="#0D1B3E" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.feedContainer}>
            {feedItems.map((item, index) => {
              const style = typeStyle[item.type];
              const isLiked = liked.includes(index);
              const currentLikes = getItemLikes(item, index);

              return (
                <View key={index} style={styles.feedCard}>
                  {/* Image Header for Announcements */}
                  {item.hasImage && item.imageUrl && (
                    <View style={styles.imageHeader}>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.feedImage}
                        resizeMode="cover"
                      />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageLabel}>Upcoming Event</Text>
                        <Text style={styles.imageTitle}>{item.title}</Text>
                      </View>
                    </View>
                  )}

                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    {/* Type Badge and Time */}
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: style.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeText,
                            { color: style.color },
                          ]}
                        >
                          {style.label}
                        </Text>
                      </View>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    {/* Title (for non-image items) */}
                    {!item.hasImage && (
                      <Text
                        style={[
                          styles.itemTitle,
                          item.type === "devotional" && styles.devotionalTitle,
                        ]}
                      >
                        {item.title}
                      </Text>
                    )}

                    {/* Body Text */}
                    <Text
                      style={[
                        styles.itemBody,
                        item.type === "devotional" && styles.devotionalBody,
                      ]}
                    >
                      {item.body}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                      {/* Like Button */}
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => toggleLike(index)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={
                          isLiked ? "Unlike" : "Like"
                        }
                      >
                        <Heart
                          size={14}
                          fill={isLiked ? "#C4933A" : "none"}
                          color={isLiked ? "#C4933A" : "#7B7464"}
                        />
                        <Text style={styles.actionText}>
                          {currentLikes}
                        </Text>
                      </TouchableOpacity>

                      {/* Comment Button */}
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onComment?.(item, index)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Comment"
                      >
                        <MessageCircle size={14} color="#7B7464" />
                        <Text style={styles.actionText}>Comment</Text>
                      </TouchableOpacity>

                      {/* Share Button */}
                      <TouchableOpacity
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={() => onShare?.(item, index)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Share"
                      >
                        <Share2 size={14} color="#7B7464" />
                        <Text style={styles.actionText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
  },
  headerInfo: {
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
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE6",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 95,
  },
  feedContainer: {
    padding: 16,
    gap: 16,
  },
  // Feed Card Styles
  feedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  // Image Header Styles
  imageHeader: {
    height: 110,
    overflow: "hidden",
    backgroundColor: "#0D1B3E",
    position: "relative",
  },
  feedImage: {
    width: "100%",
    height: "100%",
    opacity: 0.4,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  imageLabel: {
    color: "#E8C77A",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: SANS,
  },
  imageTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: SERIF,
  },
  // Card Content Styles
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: SANS,
  },
  timeText: {
    fontSize: 9,
    color: "#B0A89A",
    marginLeft: "auto",
    fontFamily: SANS,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 4,
    fontFamily: SANS,
  },
  devotionalTitle: {
    fontFamily: SERIF,
  },
  itemBody: {
    fontSize: 11,
    color: "#7B7464",
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: SANS,
  },
  devotionalBody: {
    fontFamily: SERIF,
    fontStyle: "italic",
  },
  // Action Row Styles
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shareButton: {
    marginLeft: "auto",
  },
  actionText: {
    fontSize: 11,
    color: "#7B7464",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
});