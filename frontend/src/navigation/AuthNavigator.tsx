import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";

// Screens used in the auth flow
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RoleSelectScreen from "../screens/RoleSelectScreen";
import MemberRegisterScreen from "../screens/MemberRegisterScreen";
import LeaderRegisterScreen from "../screens/LeaderRegisterScreen";
import LeaderPendingScreen from "../screens/LeaderPendingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="Welcome"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
			<Stack.Screen name="MemberRegister" component={MemberRegisterScreen} />
			<Stack.Screen name="LeaderRegister" component={LeaderRegisterScreen} />
			<Stack.Screen name="LeaderPending" component={LeaderPendingScreen} />
		</Stack.Navigator>
	);
}
