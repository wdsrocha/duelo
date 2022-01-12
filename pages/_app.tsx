import "~/styles/style.scss";
import React, { useState, useEffect } from "react";
import UserContext from "lib/UserContext";
import { supabase, fetchUserRoles } from "lib/Store";
import { Layout } from "../components/Layout";
import { Session, User } from "@supabase/supabase-js";

export default function SupabaseSlackClone({ Component, pageProps }) {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    setUserLoaded(session ? true : false);
    if (user) {
      signIn();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setUserLoaded(!!currentUser);
        if (currentUser) {
          signIn();
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  const signIn = async () => {
    await fetchUserRoles((userRoles) =>
      setUserRoles(userRoles.map((userRole) => userRole.role))
    );
  };

  const signOut = async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        userRoles,
        signIn,
        signOut,
        session,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}
