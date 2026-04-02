import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({ children, pageTitle = "Dashboard" }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 xl:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
