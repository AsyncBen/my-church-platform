import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, BookOpen, ArrowRight } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/navigation';
import { scriptureService } from '../../services/scripture.service';

type BibleBooksScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'BibleBooks'
>;

interface BibleBooksRouteProp {
  selectedBook: string;
}

const { width } = Dimensions.get('window');

export default function BibleBooksScreen() {
  const navigation = useNavigation<BibleBooksScreenNavigationProp>();
  const route = useRoute();
  const { selectedBook } = (route.params as BibleBooksRouteProp) || {};
  
  const [chapters, setChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, [selectedBook]);

  const loadChapters = async () => {
    if (!selectedBook) return;
    
    try {
      setLoading(true);
      const chapterList = await scriptureService.getBookChapters(selectedBook);
      setChapters(chapterList);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = (chapter: number) => {
    navigation.navigate('BibleChapter', { book: selectedBook, chapter });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedBook}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e40af" />
          <Text style={styles.loadingText}>Loading chapters...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <BookOpen size={32} color="#1e40af" />
            </View>
            <Text style={styles.heroTitle}>Chapters</Text>
            <Text style={styles.heroSubtitle}>
              {chapters.length} chapters in {selectedBook}
            </Text>
          </View>

          <View style={styles.chaptersList}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter}
                style={styles.chapterItem}
                onPress={() => handleChapterSelect(chapter)}
                activeOpacity={0.7}
              >
                <View style={styles.chapterLeft}>
                  <View style={styles.chapterBadge}>
                    <Text style={styles.chapterBadgeText}>{chapter}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>Chapter {chapter}</Text>
                    <Text style={styles.chapterDescription}>
                      Tap to read chapter {chapter}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  chaptersList: {
    paddingHorizontal: 20,
    gap: 2,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  chapterBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  chapterDescription: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '400',
  },
});