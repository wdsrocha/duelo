import "~/styles/style.scss";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function SupabaseSlackClone({ Component, pageProps }) {
  return (
    <>
      <Toaster toastOptions={{ duration: 1000 }} />
      <Component {...pageProps} />
    </>
  );
}
