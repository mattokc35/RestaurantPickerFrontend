import {create} from "zustand";

type Role = "host" | "guest" | null;

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: null, // Initialize role as null
  setRole: (role: Role) => set({ role }),
}));
