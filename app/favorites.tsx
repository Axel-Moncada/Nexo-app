import { SafeAreaView, Text, View } from 'react-native';
import BottomNavigation from '../componentes/menu';

export default function Favorites() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Favoritos</Text>
      </View>
      <BottomNavigation activeTab={1} />
    </SafeAreaView>
  );
}