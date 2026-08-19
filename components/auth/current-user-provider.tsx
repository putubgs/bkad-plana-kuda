"use client";

import { createContext, useContext, type ReactNode } from "react";
import { isAdmin, isSuperadmin, type CurrentUser } from "@/lib/auth/roles";

const CurrentUserContext = createContext<CurrentUser | null>(null);

export function CurrentUserProvider({
  user,
  children,
}: {
  user: CurrentUser;
  children: ReactNode;
}) {
  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }
  return user;
}

export function useIsAdmin() {
  return isAdmin(useCurrentUser().role);
}

export function useIsSuperadmin() {
  return isSuperadmin(useCurrentUser().role);
}
