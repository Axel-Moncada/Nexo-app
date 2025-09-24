import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from '../componentes/menu';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';



export default function Profile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
      
      setUserName(user?.user_metadata?.full_name || null);
      setLastSignIn(user?.last_sign_in_at || null);

      const lastSign = new Date(user?.last_sign_in_at || '').toLocaleString();
      setLastSignIn(lastSign);
    };
    
    getUserData();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 25 }}>Mi perfil</Text>
        <Text style={{ fontSize: 14, fontWeight: '400',  color: '#174b93' }}>
          Email: 
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 38, color: '#174b93' }}>
          {userEmail || 'No disponible'}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '400',  color: '#174b93' }}>
          Nombre:
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 38, color: '#174b93'  }}>
         {userName || 'No disponible'}
        </Text>

         <Text style={{ fontSize: 14, fontWeight: '400',  color: '#174b93' }}>
          Ultimo ingreso
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 38, color: '#174b93'  }}>
         {lastSignIn || 'No disponible'}
        </Text>
      </View>

    

      <TouchableOpacity onPress={logout} style={{ padding: 12, backgroundColor: '#174b93', borderRadius: 8, margin: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Cerrar sesion</Text>
      </TouchableOpacity>

      <BottomNavigation activeTab={1} />
    </SafeAreaView>
  );
}