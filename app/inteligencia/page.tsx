import AppShell from "@/components/AppShell";
import IntelligenceClient from "@/components/IntelligenceClient";

export default function Page() {
  return (
    <AppShell active="/inteligencia">
      <main className="pageWrap">
        <IntelligenceClient />
      </main>
    </AppShell>
  );
}
