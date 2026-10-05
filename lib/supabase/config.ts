const fallbackUrl = "https://zdgwslmwgipyzvnfpaii.supabase.co";
const fallbackPublishableKey = "sb_publishable_C0cw9B8QbitzhkmvC_qkoQ_nNJ3kwCr";

function clean(value: string | undefined) {
  return (value || "").trim().replace(/^["']|["']$/g, "");
}

function validUrl(value: string) {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value);
}

function validPublishableKey(value: string) {
  return value.startsWith("sb_publishable_") || value.startsWith("eyJ");
}

const envUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const envPublishableKey = clean(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const SUPABASE_URL = validUrl(envUrl) ? envUrl : fallbackUrl;
export const SUPABASE_PUBLISHABLE_KEY = validPublishableKey(envPublishableKey)
  ? envPublishableKey
  : fallbackPublishableKey;
