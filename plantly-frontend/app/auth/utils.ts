import { API_URL } from "~/common/constants/constants";
import type { User } from "~/common/types/auth";
import { parse } from "cookie";


export async function fetchUserData(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Invalid token");

    return await response.json();
  } catch (err) {
    console.error("fetchUserData failed:", err);
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookies = parse(request.headers.get('cookie') || '');
  return cookies.token || null;
}
