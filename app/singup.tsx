import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text } from 'react-native';
import { Session } from '@supabase/supabase-js';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
    TextInput,
  
} from "react-native";
interface SignUpForm {
  email: string;
  password: string;
  full_name: string;
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        Alert.alert("Signup Error", signupError.message);
      } else {
        // Only sign in if signup was successful
        const { error: profileError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (profileError) {
          Alert.alert("Sign In Error", profileError.message);
        } else {
          Alert.alert("Bienvenido", "Tu cuenta fue creada exitosamente");
          router.replace("/home");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/Bg2.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding" })}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Ingresa tus datos para crear una cuenta
          </Text>
        </View>

        <View style={styles.form}>
          <View style={{ position: "relative", width: 300 }}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={{ position: "relative", width: 300 }}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />
          </View>
          <View style={{ position: "relative", width: 300 }}>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nombre completo"
            />


    <View style={{ position: "relative", width: 300, alignItems: "center"}}>
            <Pressable
            style={styles.button}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}> Crear cuenta</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push("/")}>
              <Text style={{ fontWeight: "700", color: "#174b93", textDecorationLine: "underline", marginTop: 16 }}>
                Iniciar Sesion
              </Text>
            </Pressable>
          </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 190,
    height: 150,
    alignSelf: "center",
    marginBottom: 4,
    resizeMode: "contain",
  },
  backgroundImage: {
    flex: 1,
    zIndex: 999,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffffb2",
    justifyContent: "center",
  },
  form: {
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: { textAlign: "center", opacity: 0.7, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 6, color: "#111827", marginTop: 24 },
  input: {
    backgroundColor: "#e2e2e2da",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
   
    alignItems: "center",
   
    textAlign: "center",
    width: "70%",
    backgroundColor: "#174b93",
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "700" },
  eye: { position: "absolute", right: 10, top: 10, padding: 6 },
});
