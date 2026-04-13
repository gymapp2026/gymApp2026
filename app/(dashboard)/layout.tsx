import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { RoutinesProvider } from "@/context/RoutinesContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoutinesProvider>
      <div className="min-h-screen bg-zinc-950">
        <Sidebar />
        <TopBar />
        <main className="md:pl-64 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto px-4 py-4 md:px-6 md:py-6">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </RoutinesProvider>
  );
}
