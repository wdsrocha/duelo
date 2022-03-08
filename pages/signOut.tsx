import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../lib/Supabase";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());

        router.push("/auth");
      }
    );

    setTimeout(() => supabase.auth.signOut(), 1000);

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-grow justify-center items-center">Saindo...</div>
  );
};

export default Page;
