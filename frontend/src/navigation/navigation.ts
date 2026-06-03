export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelect: undefined;
  MemberRegister: undefined;
  LeaderRegister: undefined;
  LeaderPending: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Ministries: undefined;
  Feed: undefined;
  Bible: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  SermonNotes: {
    serviceId?: string;
    serviceTitle?: string;
  } | undefined;
  LiveService: undefined;
  Giving: undefined;
  GivingHistory: undefined;
  Prayer: undefined;
  BookmarkedScriptures: undefined;
  AccountSettings: undefined;
  BibleBooks: {
    selectedBook: string;
  };
  BibleChapter: {
    book: string;
    chapter: number;
  };
  BibleSearch: {
    query: string;
  };
};

export type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "register"
  | "role-select"
  | "member-register"
  | "leader-register"
  | "leader-pending"
  | "home"
  | "live"
  | "ministries"
  | "feed"
  | "bible"
  | "bible-books"
  | "bible-chapter"
  | "bible-search"
  | "profile"
  | "notes"
  | "prayer"
  | "giving"
  | "giving-history";