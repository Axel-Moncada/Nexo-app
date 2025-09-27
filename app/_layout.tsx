import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import AuthProvider from "../providers/AuthProvider";
import CartProvider from "../providers/CartProvider";
import FavoritesProvider from "../providers/FavoritesProvider";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
