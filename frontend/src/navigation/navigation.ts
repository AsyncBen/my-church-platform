export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelect: undefined;
  MemberRegister: undefined;
  LeaderRegister: undefined;
  LeaderPending: undefined;
  MainTabs: { screen?: string };
  Giving: undefined;
  GivingHistory: undefined;
  SermonNotes: undefined;
  Prayer: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  LiveTab: undefined;
  MinistriesTab: undefined;
  FeedTab: undefined;
  ProfileTab: undefined;
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
  | "profile"
  | "notes"
  | "prayer"
  | "giving"
  | "giving-history";