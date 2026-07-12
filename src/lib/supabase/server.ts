import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 用于前端/页面组件：使用 anon key + cookie auth（受 RLS 控制） */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

/** 用于管理后台 API：使用 service_role key（绕过 RLS） */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    },
  );
}
