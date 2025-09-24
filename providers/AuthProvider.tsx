import { createContext, useState, useEffect, useContext, use } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

type AuthData = {
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
});

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSession() {
      const { error, data } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
      } else {
        setSession(null);
        router.replace("/");
      }

      setLoading(false);
    }

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setLoading(false);

      if (session) {
        router.replace("/home"); // or your authenticated route
      } else {
        router.replace("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
