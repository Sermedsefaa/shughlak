"use client";

import type { Role } from "@/lib/enums";
import { useSession } from "next-auth/react";

export function useSessionRole(): Role | null {
  const { data } = useSession();
  return (data?.user?.role as Role | undefined) ?? null;
}
