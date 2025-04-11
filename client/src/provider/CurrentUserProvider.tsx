import { getCurrentUser } from "@/services/auth.service";
import { TMe } from "@/types/auth.type";
import { IUser } from "@/types/user.type";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type TContextValue = {
  isLoading: boolean;
  error: any;
  user: TMe | null;
  isUserExist: boolean;
  setIsLoading: (bol: boolean) => void;
  setError: (err: any) => void;
  setUser: Dispatch<SetStateAction<TMe | null>>;
  refetch: () => void;
};
const UserContext = createContext<TContextValue | null>(null);

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [user, setUser] = useState<TMe | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const handelUser = async () => {
    setIsLoading(true);
    const user = await getCurrentUser();

    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    handelUser();
  }, [toggle]);

  const refetch = () => {
    setToggle(!toggle);
  };

  const value = {
    isLoading,
    error,
    user,
    isUserExist: user ? true : false,
    setIsLoading,
    setError,
    setUser,
    refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default CurrentUserProvider;

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Use current user must be used within the currentUserProvider context");
  }
  return context as TContextValue;
}
