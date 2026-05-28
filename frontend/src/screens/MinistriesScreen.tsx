import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Users, X, Send, MessageCircle, Plus, Check, LogOut } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { ministryService } from "../services/ministry.service";
import { socketService } from "../services/socket.service";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MinistryGroup {
  id: string;
  name: string;
  description: string;
  accent: string;
  _count: { members: number; messages: number };
}

interface Message {
  id: string;
  text: string;
  createdAt: string;
  user: { name: string };
}

export default function MinistriesScreen() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<MinistryGroup[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<Set<string>>(new Set());
  const [activeGroup, setActiveGroup] = useState<MinistryGroup | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "joined">("all");

  const fetchGroups = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [allGroups, myGroups] = await Promise.all([
        ministryService.getAll(token),
        ministryService.getMyGroups(token),
      ]);

      setGroups(allGroups);

      const joinedIds = new Set<string>(
        myGroups.map((membership: any) => membership.groupId)
      );
      setMyGroupIds(joinedIds);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredMinistries = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "joined") {
      return matchesSearch && myGroupIds.has(group.id);
    }
    return matchesSearch;
  });

  const joinedGroups = groups.filter(group => myGroupIds.has(group.id));
  const allGroups = groups.filter(group => !myGroupIds.has(group.id));

  const handleJoin = async (groupId: string) => {
    if (!token) return;
    try {
      await ministryService.join(groupId, token);
      await fetchGroups();
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!token) return;
    try {
      await ministryService.leave(groupId, token);
      await fetchGroups();
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  const handleOpenChat = async (group: MinistryGroup) => {
    if (!token) return;
    try {
      const groupMessages = await ministryService.getMessages(group.id, token);
      setMessages(groupMessages);
      setActiveGroup(group);
      
      const socket = socketService.getSocket();
      socket?.emit("ministry:join_room", { groupId: group.id });
      
      setShowChat(true);
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };

  const handleCloseChat = () => {
    if (activeGroup) {
      const socket = socketService.getSocket();
      socket?.emit("ministry:leave_room", { groupId: activeGroup.id });
    }
    setShowChat(false);
    setActiveGroup(null);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeGroup || !token || sending) return;
    
    try {
      setSending(true);
      await ministryService.sendMessage(activeGroup.id, messageText.trim(), token);
      setMessageText("");
      
      const updatedMessages = await ministryService.getMessages(activeGroup.id, token);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!showChat || !activeGroup) return;

    const socket = socketService.getSocket();
    
    const handleNewMessage = ({ groupId, message }: { groupId: string; message: Message }) => {
      if (groupId === activeGroup.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket?.on("ministry:message", handleNewMessage);

    return () => {
      socket?.off("ministry:message", handleNewMessage);
    };
  }, [showChat, activeGroup]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5F0" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ministries</Text>
        {joinedGroups.length > 0 && (
          <Text style={styles.headerSubtitle}>
            {joinedGroups.length} group{joinedGroups.length !== 1 ? 's' : ''} joined
          </Text>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#7B7464" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search ministries..."
            placeholderTextColor="#C0B8B0"
            accessibilityLabel="Search ministries"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "joined" && styles.activeTab]}
          onPress={() => setActiveTab("joined")}
        >
          <Text style={[styles.tabText, activeTab === "joined" && styles.activeTabText]}>
            My Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading ministries...</Text>
          </View>
        ) : (
          <>
            {/* Joined Groups Section */}
            {activeTab === "all" && joinedGroups.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Communities</Text>
                <View style={styles.joinedGrid}>
                  {joinedGroups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      style={styles.joinedCard}
                      onPress={() => handleOpenChat(group)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.joinedAvatar, { backgroundColor: group.accent }]}>
                        <Text style={styles.joinedAvatarText}>
                          {getInitials(group.name)}
                        </Text>
                      </View>
                      <Text style={styles.joinedName} numberOfLines={2}>
                        {group.name}
                      </Text>
                      <Text style={styles.joinedCount}>
                        {group._count.members} members
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Groups List */}
            <View style={styles.section}>
              {activeTab === "joined" && (
                <Text style={styles.sectionTitle}>Your Communities</Text>
              )}
              {activeTab === "all" && (
                <Text style={styles.sectionTitle}>
                  {joinedGroups.length > 0 ? "Discover More" : "All Communities"}
                </Text>
              )}
              
              {filteredMinistries.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Users size={48} color="#D1CEC5" />
                  <Text style={styles.emptyText}>
                    {activeTab === "joined" 
                      ? "You haven't joined any groups yet" 
                      : "No ministries found"}
                  </Text>
                  {activeTab === "joined" && (
                    <TouchableOpacity
                      style={styles.discoverButton}
                      onPress={() => setActiveTab("all")}
                    >
                      <Text style={styles.discoverButtonText}>Discover Groups</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {filteredMinistries.map((group) => {
                    const isJoined = myGroupIds.has(group.id);
                    return (
                      <View key={group.id} style={styles.listItem}>
                        <TouchableOpacity
                          style={styles.listItemMain}
                          onPress={() => isJoined && handleOpenChat(group)}
                          activeOpacity={isJoined ? 0.7 : 1}
                        >
                          <View style={[styles.listAvatar, { backgroundColor: group.accent }]}>
                            <Text style={styles.listAvatarText}>
                              {getInitials(group.name)}
                            </Text>
                          </View>
                          <View style={styles.listInfo}>
                            <Text style={styles.listName} numberOfLines={1}>
                              {group.name}
                            </Text>
                            <Text style={styles.listDescription} numberOfLines={1}>
                              {group.description}
                            </Text>
                            <View style={styles.listMeta}>
                              <Users size={12} color="#7B7464" />
                              <Text style={styles.listMembers}>
                                {group._count.members} members
                              </Text>
                              <View style={styles.dot} />
                              <MessageCircle size={12} color="#7B7464" />
                              <Text style={styles.listMembers}>
                                {group._count.messages} messages
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        
                        <View style={styles.listActions}>
                          {isJoined ? (
                            <View style={styles.actionGroup}>
                              <TouchableOpacity
                                style={[styles.actionBtn, styles.chatBtn, { backgroundColor: group.accent }]}
                                onPress={() => handleOpenChat(group)}
                              >
                                <MessageCircle size={16} color="#FFFFFF" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionBtn, styles.leaveBtn]}
                                onPress={() => handleLeave(group.id)}
                              >
                                <LogOut size={16} color="#EF4444" />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={[styles.joinBtn, { backgroundColor: group.accent }]}
                              onPress={() => handleJoin(group.id)}
                            >
                              <Plus size={18} color="#FFFFFF" />
                              <Text style={styles.joinBtnText}>Join</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseChat}
      >
        <SafeAreaView style={styles.chatSafeArea} edges={["top"]}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleCloseChat} style={styles.chatBack}>
              <X size={24} color="#0D1B3E" />
            </TouchableOpacity>
            
            <View style={[styles.chatAvatar, { backgroundColor: activeGroup?.accent || "#1B3A7A" }]}>
              <Text style={styles.chatAvatarText}>
                {activeGroup ? getInitials(activeGroup.name) : ""}
              </Text>
            </View>
            
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderTitle} numberOfLines={1}>
                {activeGroup?.name}
              </Text>
              <Text style={styles.chatHeaderSubtitle}>
                {activeGroup?._count.members} members
              </Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isOwnMessage = item.user.name === user?.name;
              const showSender = !isOwnMessage && 
                (index === 0 || messages[index - 1]?.user.name !== item.user.name);
              
              return (
                <View
                  style={[
                    styles.messageRow,
                    isOwnMessage ? styles.ownMessageRow : styles.otherMessageRow,
                  ]}
                >
                  {!isOwnMessage && (
                    <View style={styles.messageAvatarContainer}>
                      {showSender && (
                        <View style={[styles.messageAvatar, { backgroundColor: activeGroup?.accent + "33" }]}>
                          <Text style={[styles.messageAvatarText, { color: activeGroup?.accent }]}>
                            {item.user.name?.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble,
                  ]}>
                    {showSender && !isOwnMessage && (
                      <Text style={[styles.messageSenderName, { color: activeGroup?.accent }]}>
                        {item.user.name}
                      </Text>
                    )}
                    <Text style={[
                      styles.messageText,
                      isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                    ]}>
                      {item.text}
                    </Text>
                    <View style={styles.messageFooter}>
                      <Text style={styles.messageTime}>
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            inverted={false}
          />

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Message"
                placeholderTextColor="#C0B8B0"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: activeGroup?.accent || "#1B3A7A" },
                  !messageText.trim() && styles.sendDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!messageText.trim() || sending}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#F7F5F0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D1B3E",
    fontFamily: SERIF,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#7B7464",
    marginTop: 2,
    fontFamily: SANS,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#F7F5F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0D1B3E",
    fontFamily: SANS,
    padding: 0,
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    backgroundColor: "#F7F5F0",
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  activeTab: {
    backgroundColor: "#0D1B3E",
  },
  tabText: {
    fontSize: 13,
    color: "#7B7464",
    fontFamily: SANS,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7B7464",
    fontFamily: SANS,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  // Joined Grid
  joinedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  joinedCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  joinedAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  joinedAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: SANS,
  },
  joinedName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D1B3E",
    fontFamily: SANS,
    textAlign: "center",
    marginBottom: 4,
  },
  joinedCount: {
    fontSize: 11,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // List
  listContainer: {
    gap: 8,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  listItemMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  listAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: SANS,
  },
  listInfo: {
    flex: 1,
    gap: 2,
  },
  listName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  listDescription: {
    fontSize: 12,
    color: "#7B7464",
    fontFamily: SANS,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listMembers: {
    fontSize: 11,
    color: "#7B7464",
    fontFamily: SANS,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1CEC5",
    marginHorizontal: 2,
  },
  // Actions
  listActions: {
    marginLeft: 8,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtn: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leaveBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: SANS,
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#7B7464",
    fontFamily: SANS,
    textAlign: "center",
  },
  discoverButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0D1B3E",
    borderRadius: 20,
  },
  discoverButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: SANS,
  },
  // Loading
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#7B7464",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 40,
  },
  // Chat Modal
  chatSafeArea: {
    flex: 1,
    backgroundColor: "#F0EDE6",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E4D9",
    gap: 12,
  },
  chatBack: {
    padding: 4,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: SANS,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 4,
    maxWidth: "85%",
  },
  ownMessageRow: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    alignSelf: "flex-start",
  },
  messageAvatarContainer: {
    width: 28,
    marginRight: 6,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  messageAvatarText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: SANS,
  },
  messageBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
  },
  ownBubble: {
    backgroundColor: "#0D1B3E",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  messageSenderName: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    fontFamily: SANS,
  },
  messageText: {
    fontSize: 15,
    fontFamily: SANS,
    lineHeight: 21,
  },
  ownMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#0D1B3E",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    color: "#A8A398",
    fontFamily: SANS,
  },
  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E4D9",
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#F7F5F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0D1B3E",
    fontFamily: SANS,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sendDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
});