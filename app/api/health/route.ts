import {NextResponse} from "next/server";
import {SUPABASE_PUBLISHABLE_KEY,SUPABASE_URL} from "@/lib/supabase/config";

export const dynamic="force-dynamic";

export async function GET(){
  const started=Date.now();
  let supabase="unknown";
  let status=200;

  try{
    const response=await fetch(SUPABASE_URL+"/auth/v1/health",{
      headers:{apikey:SUPABASE_PUBLISHABLE_KEY},
      cache:"no-store",
    });
    supabase=response.ok?"ok":"unavailable";
    if(!response.ok) status=503;
  }catch{
    supabase="unavailable";
    status=503;
  }

  return NextResponse.json({
    ok:status===200,
    service:"iphan-preservacao-beta01",
    supabase,
    responseMs:Date.now()-started,
    checkedAt:new Date().toISOString(),
  },{status});
}
