import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <TopBar />
      <main className="md:pl-60 pb-6">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
