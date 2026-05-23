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
  Feed: undefined;
  LiveService: undefined;
  Giving: undefined;
  Profile: undefined;
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