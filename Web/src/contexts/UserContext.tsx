import React, { createContext, useContext, useEffect, useState } from "react";
import * as userService from "../services/userService";
import type { User } from "../types";

type UserContextValue = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  users: User[];
  reloadUsers: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      const fn = (userService as any).getAll;
      if (typeof fn === "function") {
        const res = await fn();
        setUsers(res ?? []);
      } else {
        setUsers([]);
        console.warn(
          "userService does not export a getUsers/fetchUsers/list function"
        );
      }
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, users, reloadUsers: loadUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
