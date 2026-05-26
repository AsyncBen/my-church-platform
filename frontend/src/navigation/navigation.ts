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
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  SermonNotes: undefined;
  LiveService: undefined;
  Giving: undefined;
  GivingHistory: undefined;
  Prayer: undefined;
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