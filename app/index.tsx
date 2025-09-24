import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ImageBackground } from "react-native";

import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // validación mínima
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk || pass.length < 6) {
      Alert.alert("Error", "Correo inválido o contraseña muy corta (mín. 6).");
      return;
    }
    
    setLoading(true);
    
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    setLoading(false);

    if (loginError) {
      Alert.alert("Error", 'Usuario o contraseña incorrecta');
    } else {
      router.replace("/home");
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

        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Correo</Text>
            <View style={{ position: "relative", width: 300 }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            </View>

            <Text style={styles.label}>Contraseña</Text>
            <View style={{ position: "relative", width: 300 }}>
              <TextInput
                value={pass}
                onChangeText={setPass}
                placeholder="••••••"
                secureTextEntry={secure}
                style={styles.input}
              />
              <Pressable
                style={styles.eye}
                onPress={() => setSecure((s) => !s)}
              >
                <Text>{secure ? "Mostrar" : "Ocultar"}</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.button} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </Pressable>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#174b93" }}>
            ¿No tienes una cuenta?{" "}
            <Pressable onPress={() => router.push("/singup")}>
              <Text style={{ fontWeight: "700", color: "#174b93", textDecorationLine: "underline" }}>
                Regístrate
              </Text>
            </Pressable>
          </Text>
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
  },
  button: {
    width: "70%",
    backgroundColor: "#174b93",
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "700" },
  eye: { position: "absolute", right: 10, top: 10, padding: 6 },
});
