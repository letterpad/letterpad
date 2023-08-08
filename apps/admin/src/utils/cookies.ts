"use client";

import { cookies } from "next/headers";

export function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const date = new Date();

  // Set it expire in 7 days
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

export function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length == 2) {
    return parts.pop()?.split(";").shift();
  }
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  const date = new Date();
  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
  // Set it
  document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}
