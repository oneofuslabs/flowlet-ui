import { User } from "@supabase/supabase-js";

export const ACCESS_TOKEN_KEY = "access_token";
export const USER_KEY = "user";

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logOut = () => {
  removeToken();
  removeUser();
  window.location.pathname = "/login";
};
