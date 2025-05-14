"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { login as loginApi, register as registerApi } from "@/lib/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { User } from "@/lib/types/user";
import { useTranslations } from "next-intl";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user_name: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("toast")


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const login = (user_name: string, password: string) => {
    loginApi({ user_name, password })
      .then((res) => {
        const { data } = res;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.user_name);
        router.push("/");
        toast.success(t("login_success"));
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("login_failed"));
      });
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await registerApi({ email, password, name });
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
