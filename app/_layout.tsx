import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import AuthProvider from "../providers/AuthProvider";
import FavoritesProvider from "../providers/FavoritesProvider";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <FavoritesProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
