import "~/styles/style.scss";
import React from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../lib/Supabase";
import { Auth } from "../components/Auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function SupabaseSlackClone({ Component, pageProps }) {
  return (
    <>
      <Toaster toastOptions={{ duration: 1000 }} />
      <QueryClientProvider client={queryClient}>
        <Auth.UserContextProvider supabaseClient={supabase}>
          {/* <Layout> */}
          <Component {...pageProps} />
          {/* </Layout> */}
        </Auth.UserContextProvider>
      </QueryClientProvider>
    </>
  );
}
