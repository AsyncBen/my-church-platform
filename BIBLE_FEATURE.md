# Bible Feature Implementation Guide

## Overview
A simple Bible reading feature has been added to the frontend as a new bottom tab. Users can browse books, read chapters, and search scriptures from the KJV Bible.

## What Was Added

### 1. **New Services**
- **`frontend/src/services/scripture.service.ts`** - Service to fetch scripture data from the backend
  - `getScripture()` - Fetch a specific scripture by reference
  - `searchScriptures()` - Search scriptures by keyword
  - `getBibleBooks()` - Get all Bible books
  - `getBookChapters()` - Get chapters for a book
  - `getChapterContent()` - Get full chapter content

### 2. **New Bible Screens**
Created a new folder: `frontend/src/screens/bible/`

- **`BibleScreen.tsx`** - Main tab screen
  - Lists all 66 books organized by Old Testament and New Testament
  - Search functionality to find scriptures
  - Books are organized in scrollable sections

- **`BibleChaptersScreen.tsx`** - Chapter selection screen
  - Shows all chapters for a selected book
  - Grid layout with chapter numbers
  - Navigation back to book list

- **`BibleChapterScreen.tsx`** - Bible reader screen
  - Displays full chapter with verse numbers
  - Previous/Next chapter navigation
  - Clean, readable verse layout

- **`BibleSearchScreen.tsx`** - Scripture search screen
  - Search bar to find scriptures by keyword
  - Results list with references and snippets
  - Tap to view full chapter

### 3. **Navigation Updates**
- Updated `MainTabParamList` to include `Bible` tab
- Updated `MainStackParamList` to include Bible-related screens:
  - `BibleBooks` - For chapter selection
  - `BibleChapter` - For reading chapters
  - `BibleSearch` - For searching scriptures
- Updated `Screen` type union to include new screens
- Added Bible screen imports to `MainTabNavigator.tsx`
- Added Bible tab to the bottom tab navigator (5 tabs now)

### 4. **UI Components**
- Updated `BottomTabBar.tsx` to include Bible icon (BookOpen from lucide-react-native)
- Bible tab shows between Feed and Profile tabs

## Features

✅ **Browse Books** - All 66 books organized by testament
✅ **Read Chapters** - Full chapter view with verse numbers
✅ **Search** - Find scriptures by keyword
✅ **Navigation** - Seamless navigation between books, chapters, and search
✅ **Clean Design** - Simple, readable interface with blue theme
✅ **KJV Support** - Uses KJV from backend via `/scripture` endpoints

## Backend Integration

The Bible feature uses these backend endpoints:

```
GET /scripture/get?reference=John+3:16&version=kjv
GET /scripture/search?query=love&version=kjv&limit=20
```

Make sure your backend is running with the scripture module enabled.

## How to Use

1. **Open Bible Tab** - Tap the Bible icon in the bottom navigation
2. **Browse Books** - Scroll through Old Testament or New Testament
3. **Select a Book** - Tap any book to see its chapters
4. **Select a Chapter** - Tap a chapter number to read it
5. **Read Verses** - Scroll through the chapter content
6. **Navigate** - Use Previous/Next buttons to move between chapters
7. **Search** - Use the search bar on the Bible home screen to find scriptures

## File Structure

```
frontend/src/
├── screens/
│   └── bible/
│       ├── BibleScreen.tsx           (Main tab - book list)
│       ├── BibleChaptersScreen.tsx   (Chapter selection)
│       ├── BibleChapterScreen.tsx    (Chapter reader)
│       └── BibleSearchScreen.tsx     (Scripture search)
├── services/
│   └── scripture.service.ts          (API service)
└── navigation/
    ├── navigation.ts                 (Types updated)
    └── MainTabNavigator.tsx          (Navigation updated)
```

## Styling

- **Primary Color**: `#1e40af` (Blue)
- **Font**: Uses existing theme (SANS/SERIF)
- **Icons**: lucide-react-native icons
- **Layout**: SafeAreaView with ScrollView

## Future Enhancements

- [ ] Bookmark verses/chapters
- [ ] Notes on verses
- [ ] Different Bible versions (API Bible integration)
- [ ] Reading history
- [ ] Share verses
- [ ] Font size settings
- [ ] Night mode
- [ ] Audio Bible
- [ ] Daily reading plan

## Testing Checklist

- [ ] Bottom navigation shows 5 tabs including Bible
- [ ] Tapping Bible tab opens book list
- [ ] Books are organized by testament
- [ ] Tapping a book shows its chapters
- [ ] Tapping a chapter loads and displays content
- [ ] Chapter content displays with verse numbers
- [ ] Previous/Next buttons navigate between chapters
- [ ] Search functionality finds scriptures
- [ ] All screens navigate correctly

## Notes

- Currently using local chapter count data for Bible structure
- Backend provides verse content through `/scripture` endpoints
- Simple design focused on core reading functionality
- No complex features yet - perfect starting point for expansion
