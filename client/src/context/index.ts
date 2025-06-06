// context/checkoutContext.ts
import { createContext } from "react";

export type TCheckoutContextValue = {
  isValid: boolean;
  values: Record<string, string>;
  errors: Record<string, string>;
};

export const checkoutContext = createContext<TCheckoutContextValue | undefined>(undefined);
