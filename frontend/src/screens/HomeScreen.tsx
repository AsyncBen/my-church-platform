import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Play,
  Gift,
  Heart,
  PenLine,
  Calendar,
  Clock,
  Bookmark,
} from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EVENT_CARD_WIDTH = 148;
const MINISTRY_AVATAR_SIZE = 56;
const LIVE_BANNER_HEIGHT = 180;
const FLOATING_BUTTON_SIZE = 56;

interface Event {
  title: string;
  date: string;
  time: string;
  type: string;
  accent: string;
}

interface Sermon {
  title: string;
  pastor: string;
  duration: string;
  date: string;
  img: string;
}

interface Announcement {
  title: string;
  time: string;
}

interface MinistryAvatar {
  label: string;
  img: string;
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  bg: string;
  action: () => void;
}

interface Props {
  onLive: () => void;
  onNotes: () => void;
  onPrayer: () => void;
  onMinistries: () => void;
  onGive: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onSeeAllEvents?: () => void;
  onSeeAllSermons?: () => void;
  onEventPress?: (event: Event) => void;
  onSermonPress?: (sermon: Sermon) => void;
  onAnnouncementPress?: (announcement: Announcement) => void;
}

export default function HomeScreen({
  onLive,
  onNotes,
  onPrayer,
  onMinistries,
  onGive,
  onNotifications,
  onProfile,
  onSeeAllEvents,
  onSeeAllSermons,
  onEventPress,
  onSermonPress,
  onAnnouncementPress,
}: Props) {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Banner shrink animation
  const bannerHeight = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT],
    outputRange: [LIVE_BANNER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT * 0.6, LIVE_BANNER_HEIGHT],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });

  const bannerScale = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  // Floating button animation (appears as banner disappears)
  const floatingOpacity = scrollY.interpolate({
    inputRange: [LIVE_BANNER_HEIGHT * 0.4, LIVE_BANNER_HEIGHT * 0.8],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const floatingScale = scrollY.interpolate({
    inputRange: [LIVE_BANNER_HEIGHT * 0.4, LIVE_BANNER_HEIGHT * 0.8],
    outputRange: [0.3, 1],
    extrapolate: "clamp",
  });

  const floatingTranslateX = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT],
    outputRange: [0, SCREEN_WIDTH - 90],
    extrapolate: "clamp",
  });

  const floatingTranslateY = scrollY.interpolate({
    inputRange: [0, LIVE_BANNER_HEIGHT],
    outputRange: [0, -LIVE_BANNER_HEIGHT + 100],
    extrapolate: "clamp",
  });

  const events: Event[] = [
    {
      title: "Sunday Service",
      date: "May 25",
      time: "9:00 AM",
      type: "Worship",
      accent: "#1B3A7A",
    },
    {
      title: "Youth Night",
      date: "May 23",
      time: "6:30 PM",
      type: "Youth",
      accent: "#C4933A",
    },
    {
      title: "Prayer Meeting",
      date: "May 21",
      time: "7:00 PM",
      type: "Prayer",
      accent: "#2D7A6A",
    },
  ];

  const sermons: Sermon[] = [
    {
      title: "Walking in Obedience",
      pastor: "Pastor James Adeyemi",
      duration: "42 min",
      date: "May 18",
      img: "1518005020951-eccb494ad742",
    },
    {
      title: "The Power of Grace",
      pastor: "Pastor Sarah Mensah",
      duration: "38 min",
      date: "May 11",
      img: "1465929639076-28b5f5d9a33c",
    },
  ];

  const announcements: Announcement[] = [
    { title: "Baptism Service — June 1st", time: "2h ago" },
    { title: "Annual Convention Registration Open", time: "5h ago" },
    { title: "New Bible Study Series Starting Soon", time: "1d ago" },
  ];

  const ministryAvatars: MinistryAvatar[] = [
    { label: "Youth", img: "1529156069898-49953e39b3ac" },
    { label: "Worship", img: "1511367461989-f85a21fda167" },
    { label: "Media", img: "1574717024653-61fd2cf4d44d" },
    { label: "Men", img: "1507003211169-0a1dd7228f2d" },
    { label: "Women", img: "1494790108377-be9c29b29330" },
  ];

  const quickActions: QuickAction[] = [
    { label: "Notes", icon: PenLine, color: "#1B3A7A", bg: "#EDF0F8", action: onNotes },
    { label: "Prayer", icon: Heart, color: "#C4933A", bg: "#FDF6E8", action: onPrayer },
    { label: "Give", icon: Gift, color: "#2D7A6A", bg: "#E8F5F2", action: onGive },
    { label: "Watch", icon: Play, color: "#6B3A7A", bg: "#F2EAF8", action: onLive },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>Michael 👋</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={onNotifications}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              >
                <Bell size={17} color="#0D1B3E" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={onProfile}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Profile"
              >
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Live Banner - Shrinks on scroll */}
          <Animated.View
            style={[
              styles.liveBanner,
              {
                height: bannerHeight,
                opacity: bannerOpacity,
                transform: [
                  { scale: bannerScale },
                  { translateY: bannerTranslateY },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPress={onLive}
              activeOpacity={0.9}
              style={styles.liveBannerTouchable}
              accessibilityRole="button"
              accessibilityLabel="Join live service, Walking in Obedience"
            >
              <View style={styles.liveBannerDecor} />
              <View style={styles.liveBannerContent}>
                <View style={styles.liveBannerHeader}>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                  <Text style={styles.liveSubtext}>Sunday Morning</Text>
                </View>
                <Text style={styles.liveTitle}>Walking in Obedience</Text>
                <Text style={styles.livePastor}>Pastor James Adeyemi</Text>
                <View style={styles.liveFooter}>
                  <View style={styles.viewerCount}>
                    <View style={styles.viewerDot} />
                    <Text style={styles.viewerText}>247 watching</Text>
                  </View>
                  <View style={styles.joinButton}>
                    <Play size={11} fill="#FFFFFF" color="#FFFFFF" />
                    <Text style={styles.joinText}>Join Service</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Daily Scripture */}
          <View style={styles.scriptureCard}>
            <Text style={styles.scriptureLabel}>Today's Scripture</Text>
            <Text style={styles.scriptureText}>
              "Be still, and know that I am God; I will be exalted among the
              nations, I will be exalted in the earth."
            </Text>
            <View style={styles.scriptureFooter}>
              <Text style={styles.scriptureReference}>— Psalm 46:10 NIV</Text>
              <TouchableOpacity
                style={styles.bookmarkButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Bookmark scripture"
              >
                <Bookmark size={13} color="#7A5C1E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {quickActions.map(({ label, icon: Icon, color, bg, action }) => (
              <TouchableOpacity
                key={label}
                style={[styles.quickActionButton, { backgroundColor: bg }]}
                onPress={action}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${color}18` }]}>
                  <Icon size={17} color={color} />
                </View>
                <Text style={styles.quickActionLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upcoming Events */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={onSeeAllEvents} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsScroll}
            >
              {events.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.eventCard}
                  onPress={() => onEventPress?.(event)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${event.title}, ${event.date} at ${event.time}`}
                >
                  <View style={styles.eventTypeRow}>
                    <View style={[styles.eventTypeDot, { backgroundColor: event.accent }]} />
                    <Text style={[styles.eventType, { color: event.accent }]}>
                      {event.type}
                    </Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventDetail}>
                    <Calendar size={9} color="#7B7464" />
                    <Text style={styles.eventDetailText}>{event.date}</Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Clock size={9} color="#7B7464" />
                    <Text style={styles.eventDetailText}>{event.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Announcements */}
          <View style={styles.announcementsCard}>
            <View style={styles.announcementsHeader}>
              <View style={styles.announcementAccent} />
              <Text style={styles.sectionTitle}>Announcements</Text>
            </View>
            {announcements.map((announcement, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.announcementItem,
                  index > 0 && styles.announcementItemBorder,
                ]}
                onPress={() => onAnnouncementPress?.(announcement)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={announcement.title}
              >
                <View style={styles.announcementIcon}>
                  <Bell size={13} color="#1B3A7A" />
                </View>
                <Text style={styles.announcementText}>{announcement.title}</Text>
                <Text style={styles.announcementTime}>{announcement.time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Sermons */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sermons</Text>
              <TouchableOpacity onPress={onSeeAllSermons} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>See all</Text>
              </TouchableOpacity>
            </View>
            {sermons.map((sermon, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sermonCard}
                onPress={() => onSermonPress?.(sermon)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${sermon.title} by ${sermon.pastor}`}
              >
                <View style={styles.sermonImageContainer}>
                  <Image
                    source={{
                      uri: `https://images.unsplash.com/photo-${sermon.img}?w=80&h=80&fit=crop&auto=format`,
                    }}
                    style={styles.sermonImage}
                  />
                  <View style={styles.sermonPlayOverlay}>
                    <View style={styles.sermonPlayButton}>
                      <Play size={10} fill="#FFFFFF" color="#FFFFFF" />
                    </View>
                  </View>
                </View>
                <View style={styles.sermonInfo}>
                  <Text style={styles.sermonTitle} numberOfLines={1}>
                    {sermon.title}
                  </Text>
                  <Text style={styles.sermonPastor}>{sermon.pastor}</Text>
                  <View style={styles.sermonMeta}>
                    <Text style={styles.sermonMetaText}>{sermon.duration}</Text>
                    <Text style={styles.sermonMetaDot}>•</Text>
                    <Text style={styles.sermonMetaText}>{sermon.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.sermonPlayCircle}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${sermon.title}`}
                >
                  <Play size={11} fill="#FFFFFF" color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ministry Shortcuts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Ministries</Text>
              <TouchableOpacity onPress={onMinistries} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ministriesScroll}
            >
              {ministryAvatars.map((ministry) => (
                <TouchableOpacity
                  key={ministry.label}
                  style={styles.ministryItem}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={ministry.label}
                >
                  <View style={styles.ministryAvatarContainer}>
                    <Image
                      source={{
                        uri: `https://images.unsplash.com/photo-${ministry.img}?w=80&h=80&fit=crop&auto=format`,
                      }}
                      style={styles.ministryAvatar}
                    />
                  </View>
                  <Text style={styles.ministryLabel}>{ministry.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Floating Live Button - Appears as banner shrinks */}
        <Animated.View
          style={[
            styles.floatingButton,
            {
              opacity: floatingOpacity,
              transform: [
                { scale: floatingScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={onLive}
            activeOpacity={0.8}
            style={styles.floatingButtonInner}
            accessibilityRole="button"
            accessibilityLabel="Join live service"
          >
            <View style={styles.floatingLiveDot} />
            <Play size={22} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: "#F7F5F0",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 10,
    color: "#7B7464",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: SANS,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE6",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(196,147,58,0.4)",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 95,
  },
  // Live Banner Styles
  liveBanner: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#07102A",
    position: "relative",
  },
  liveBannerTouchable: {
    flex: 1,
  },
  liveBannerDecor: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFFFFF",
    opacity: 0.1,
    transform: [{ translateX: 40 }, { translateY: -48 }],
  },
  liveBannerContent: {
    padding: 20,
  },
  liveBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: SANS,
  },
  liveSubtext: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontFamily: SANS,
  },
  liveTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 4,
    fontFamily: SERIF,
  },
  livePastor: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 16,
    fontFamily: SANS,
  },
  liveFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewerCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8C77A",
  },
  viewerText: {
    color: "#E8C77A",
    fontSize: 11,
    fontWeight: "500",
    fontFamily: SANS,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: SANS,
  },
  // Floating Live Button
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 10,
    right: 10,
  },
  // Scripture Card Styles
  scriptureCard: {
    borderRadius: 24,
    backgroundColor: "#D4A849",
    padding: 20,
  },
  scriptureLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "rgba(122,92,30,0.7)",
    marginBottom: 12,
    fontFamily: SANS,
  },
  scriptureText: {
    color: "#2D1E00",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: SERIF,
    fontStyle: "italic",
  },
  scriptureFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scriptureReference: {
    color: "#7A5C1E",
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: SANS,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  // Quick Actions Styles
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  // Section Styles
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  seeAllLink: {
    fontSize: 11,
    color: "#C4933A",
    fontWeight: "bold",
    fontFamily: SANS,
  },
  // Events Styles
  eventsScroll: {
    gap: 12,
    marginBottom: 6,
  },
  eventCard: {
    width: EVENT_CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  eventTypeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventType: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: SANS,
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 8,
    lineHeight: 16,
    fontFamily: SANS,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  eventDetailText: {
    fontSize: 9,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // Announcements Styles
  announcementsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  announcementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  announcementAccent: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#C4933A",
  },
  announcementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  announcementItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  announcementIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF0F8",
  },
  announcementText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  announcementTime: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  // Sermons Styles
  sermonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sermonImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1B3A7A",
    position: "relative",
  },
  sermonImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  sermonPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sermonPlayButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sermonInfo: {
    flex: 1,
  },
  sermonTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  sermonPastor: {
    fontSize: 10,
    color: "#7B7464",
    marginTop: 2,
    fontFamily: SANS,
  },
  sermonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  sermonMetaText: {
    fontSize: 9,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  sermonMetaDot: {
    fontSize: 9,
    color: "#B0A89A",
  },
  sermonPlayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B3A7A",
  },
  // Ministries Styles
  ministriesScroll: {
    gap: 16,
  },
  ministryItem: {
    alignItems: "center",
    gap: 8,
  },
  ministryAvatarContainer: {
    width: MINISTRY_AVATAR_SIZE,
    height: MINISTRY_AVATAR_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EDF0F8",
    borderWidth: 2,
    borderColor: "rgba(27,58,122,0.1)",
  },
  ministryAvatar: {
    width: "100%",
    height: "100%",
  },
  ministryLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
});