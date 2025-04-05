"use client";

import envConfig from "@/config/envConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import * as ReactRedux from "react-redux";
import { Toaster } from "sonner";
import CurrentUserProvider from "./CurrentUserProvider";
import { store } from "@/redux/store";

type TProvider = {
  children: React.ReactNode;
};

export default function Provider({ children }: TProvider) {
  const clientId = envConfig.google_client_id as string;

  return (
    <ReactRedux.Provider store={store}>
      <CurrentUserProvider>
        <GoogleOAuthProvider clientId={clientId}>
          {children}
          <Toaster />
        </GoogleOAuthProvider>
      </CurrentUserProvider>
    </ReactRedux.Provider>
  );
}
