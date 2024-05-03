"use server";

import { cookies } from "next/headers";

export async function onClose() {
  const cookie = cookies();
  cookie.set("showAiAd", "false");
}
