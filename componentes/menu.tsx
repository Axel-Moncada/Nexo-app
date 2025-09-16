import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
type BottomNavigationProps = {
  activeTab: number;
};

type FontAwesomeProps = {
  name: string;
  size: number;
  color: string;
};

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const navItems = [
    { icon: <FontAwesome name="home" size={24} color="#174b93" />, route: '/home', index: 0 },
    { icon: <FontAwesome name="heart" size={24} color="#174b93" />, route: '/favorites', index: 1 },
    { icon: <FontAwesome name="shopping-cart" size={24} color="#174b93" />, route: '/cart', index: 2 },
    { icon: <FontAwesome name="camera" size={24} color="#174b93" />, route: '/camara', index: 3 },
    { icon: <FontAwesome name="user" size={24} color="#174b93" />, route: '/profile', index: 4 }
  ];

  const handleNavigation = (route: string): void => {
  router.replace(route as any);
};

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <Pressable 
          key={item.index}
          style={styles.navItem} 
          onPress={() => handleNavigation(item.route)}
        >
          <Text style={[
            styles.navIcon, 
            activeTab === item.index && styles.navActive
          ]}>
            {item.icon}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    elevation: 8,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8
  },
  navIcon: {
    fontSize: 24,
    color: "#9ca3af"
  },
  navActive: {
    color: "#a4e635"
  }
});