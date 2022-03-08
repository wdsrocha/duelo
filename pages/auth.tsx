import { Auth } from "./../components/Auth";
import { Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { ComponentProps, useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const [authView, setAuthView] =
    useState<ComponentProps<typeof Auth>["view"]>("sign_in");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setAuthView("forgotten_password");
        }

        if (event === "USER_UPDATED") {
          setTimeout(() => setAuthView("sign_in"), 1000);
        }

        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());

        if (event === "SIGNED_IN") {
          const callback = router.query["callback"] ?? "";
          router.push(`/${callback}`);
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-grow items-center justify-center">
      <Card style={{ width: "400px" }}>
        <Space direction="vertical" size={8}>
          <div>
            <Typography.Title level={3}>Bem-vindo ao PvP</Typography.Title>
          </div>
          <Auth
            supabaseClient={supabase}
            providers={["google", "twitter"]}
            view={authView}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Space>
      </Card>
    </div>
  );
};

export default Page;
