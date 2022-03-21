import "~/styles/style.scss";
import React from "react";
import { Toaster } from "react-hot-toast";
import * as Portal from "@radix-ui/react-portal";

export default function SupabaseSlackClone({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Portal.Root>
        <Toaster
          toastOptions={{
            success: {
              iconTheme: {
                primary: "rgb(34,197,94)", // green-500
                secondary: "white",
              },
            },
          }}
        />
      </Portal.Root>
    </>
  );
}
