export default function DemoBadge({ source = "demo" }: { source?: "demo" | "supabase" }) {
  if (source !== "demo") return null;
  return <span className="demoBadge">Dados demonstrativos</span>;
}
