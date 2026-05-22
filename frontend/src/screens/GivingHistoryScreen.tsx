import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface GivingRecord {
  category: string;
  amount: number;
  reference: string;
  service: string;
  date: string;
  status: string;
}

interface Props {
  onBack: () => void;
  onRecordPress?: (record: GivingRecord) => void;
}

const records: GivingRecord[] = [
  {
    category: "Tithe",
    amount: 200,
    reference: "Family Tithe",
    service: "Sunday First Service",
    date: "May 18, 2025",
    status: "Confirmed",
  },
  {
    category: "Offering",
    amount: 50,
    reference: "Weekly Offering",
    service: "Sunday Second Service",
    date: "May 11, 2025",
    status: "Confirmed",
  },
  {
    category: "Building Fund",
    amount: 150,
    reference: "Building Drive",
    service: "Sunday First Service",
    date: "May 4, 2025",
    status: "Confirmed",
  },
  {
    category: "Thanksgiving",
    amount: 75,
    reference: "Birthday Gift",
    service: "Youth Service",
    date: "Apr 27, 2025",
    status: "Confirmed",
  },
  {
    category: "Mission Support",
    amount: 100,
    reference: "Missions Drive",
    service: "Midweek Fellowship",
    date: "Apr 20, 2025",
    status: "Confirmed",
  },
];

const categoryIcon: Record<string, string> = {
  Tithe: "🌾",
  Offering: "🙏",
  Thanksgiving: "✨",
  "Building Fund": "🏛️",
  "Mission Support": "🌍",
  "Special Seed": "🌱",
};

export default function GivingHistoryScreen({ onBack, onRecordPress }: Props) {
  const total = records.reduce((sum, r) => sum + r.amount, 0);

  const formatAmount = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#07102A" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Giving History</Text>
            </View>

            {/* Total Summary */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Given (2025)</Text>
              <Text style={styles.totalAmount}>{formatAmount(total)}</Text>
              <Text style={styles.transactionCount}>
                {records.length} transactions
              </Text>
            </View>
          </View>

          {/* Records Section */}
          <View style={styles.recordsContainer}>
            <View style={styles.recordsCard}>
              {records.map((record, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.recordItem,
                    index > 0 && styles.recordItemBorder,
                  ]}
                  onPress={() => onRecordPress?.(record)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${record.category}, $${record.amount}, ${record.date}`}
                >
                  {/* Category Icon */}
                  <View style={styles.categoryIconContainer}>
                    <Text style={styles.categoryIconText}>
                      {categoryIcon[record.category] ?? "💛"}
                    </Text>
                  </View>

                  {/* Record Details */}
                  <View style={styles.recordDetails}>
                    <View style={styles.recordHeader}>
                      <Text
                        style={styles.recordCategory}
                        numberOfLines={1}
                      >
                        {record.category}
                      </Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                          {record.status}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={styles.recordInfo}
                      numberOfLines={1}
                    >
                      {record.reference} · {record.service}
                    </Text>
                    <Text style={styles.recordDate}>{record.date}</Text>
                  </View>

                  {/* Amount */}
                  <Text style={styles.recordAmount}>
                    {formatAmount(record.amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.footerText}>
              Showing last {records.length} transactions
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  // Header Styles
  header: {
    backgroundColor: "#07102A",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: SERIF,
  },
  totalSection: {
    alignItems: "center",
  },
  totalLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: SANS,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 48,
    fontFamily: SANS,
  },
  transactionCount: {
    color: "#E8C77A",
    fontSize: 11,
    marginTop: 8,
    fontFamily: SANS,
  },
  // Records Container Styles
  recordsContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
  },
  recordsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  // Record Item Styles
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  recordItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F5F0",
    flexShrink: 0,
  },
  categoryIconText: {
    fontSize: 20,
  },
  recordDetails: {
    flex: 1,
    minWidth: 0,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  recordCategory: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: "#E8F5EE",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2D8A4E",
    fontFamily: SANS,
  },
  recordInfo: {
    fontSize: 10,
    color: "#7B7464",
    fontFamily: SANS,
  },
  recordDate: {
    fontSize: 9,
    color: "#B0A89A",
    marginTop: 2,
    fontFamily: SANS,
  },
  recordAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1B3A7A",
    flexShrink: 0,
    fontFamily: SANS,
  },
  // Footer Styles
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#B0A89A",
    marginTop: 16,
    marginBottom: 16,
    fontFamily: SANS,
  },
});