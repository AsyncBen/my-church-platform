import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Users } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Ministry {
  name: string;
  desc: string;
  members: number;
  update: string;
  accent: string;
  img: string;
}

export default function MinistriesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const ministries: Ministry[] = [
    {
      name: "Youth Ministry",
      desc: "Empowering the next generation of leaders",
      members: 142,
      update: "Movie Night this Friday",
      accent: "#F59E0B",
      img: "1529156069898-49953e39b3ac",
    },
    {
      name: "Worship Team",
      desc: "Leading hearts into the presence of God",
      members: 38,
      update: "Rehearsal Thursday 6PM",
      accent: "#8B5CF6",
      img: "1511367461989-f85a21fda167",
    },
    {
      name: "Media Team",
      desc: "Capturing and sharing God's glory",
      members: 22,
      update: "New equipment arrived",
      accent: "#10B981",
      img: "1574717024653-61fd2cf4d44d",
    },
    {
      name: "Men Fellowship",
      desc: "Brothers standing firm in faith and purpose",
      members: 89,
      update: "Monthly breakfast Saturday",
      accent: "#1B3A7A",
      img: "1507003211169-0a1dd7228f2d",
    },
    {
      name: "Women Fellowship",
      desc: "Women of valor, grace, and strength",
      members: 115,
      update: "New Bible study series",
      accent: "#EC4899",
      img: "1494790108377-be9c29b29330",
    },
    {
      name: "Children Ministry",
      desc: "Nurturing young hearts for Christ",
      members: 78,
      update: "VBS registration now open",
      accent: "#F97316",
      img: "1516627145497-ae6968895b74",
    },
  ];

  const filteredMinistries = ministries.filter(
    (ministry) =>
      ministry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ministry.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ministry.update.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ministries</Text>
          <Text style={styles.headerSubtitle}>
            Connect with your church family
          </Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={14} color="#7B7464" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Find a ministry..."
                placeholderTextColor="#C0B8B0"
                accessibilityLabel="Search ministries"
              />
            </View>
          </View>

          {/* Ministry Cards */}
          <View style={styles.cardsContainer}>
            {filteredMinistries.map((ministry, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ministryCard}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={`${ministry.name}, ${ministry.members} members`}
              >
                {/* Card Image Header */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{
                      uri: `https://images.unsplash.com/photo-${ministry.img}?w=390&h=110&fit=crop&auto=format`,
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View
                    style={[
                      styles.cardImageOverlay,
                      {
                        backgroundColor: `${ministry.accent}BB`,
                      },
                    ]}
                  />
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{ministry.name}</Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardDescription}>{ministry.desc}</Text>

                  {/* Stats Row */}
                  <View style={styles.statsRow}>
                    <View style={styles.membersContainer}>
                      <Users size={11} color="#7B7464" />
                      <Text style={styles.membersText}>
                        {ministry.members} members
                      </Text>
                    </View>
                    <View style={styles.updateBadge}>
                      <Text style={styles.updateText} numberOfLines={1}>
                        {ministry.update}
                      </Text>
                    </View>
                  </View>

                  {/* View Button */}
                  <TouchableOpacity
                    style={[
                      styles.viewButton,
                      {
                        backgroundColor: `${ministry.accent}14`,
                      },
                    ]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${ministry.name}`}
                  >
                    <Text
                      style={[
                        styles.viewButtonText,
                        {
                          color: ministry.accent,
                        },
                      ]}
                    >
                      View Ministry
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

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
  // Header Styles
  header: {
    backgroundColor: "#F7F5F0",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
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
    paddingBottom: 95,
  },
  // Search Styles
  searchContainer: {
    backgroundColor: "#F7F5F0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 14,
    color: "#0D1B3E",
    fontFamily: SANS,
    padding: 0,
  },
  // Cards Container
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  // Ministry Card Styles
  ministryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    height: 90,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#0D1B3E",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    opacity: 0.55,
  },
  cardImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.73,
  },
  cardTitleContainer: {
    position: "absolute",
    bottom: 12,
    left: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: SERIF,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Card Content Styles
  cardContent: {
    padding: 16,
  },
  cardDescription: {
    fontSize: 11,
    color: "#7B7464",
    marginBottom: 12,
    fontFamily: SANS,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  membersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  membersText: {
    fontSize: 10,
    color: "#7B7464",
    fontFamily: SANS,
  },
  updateBadge: {
    flex: 1,
    backgroundColor: "#F0EDE6",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 0,
  },
  updateText: {
    fontSize: 9,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // View Button Styles
  viewButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
});