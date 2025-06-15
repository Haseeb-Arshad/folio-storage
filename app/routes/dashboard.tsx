import { useState } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import Sidebar from "~/components/dashboard/Sidebar";
import Header from "~/components/dashboard/Header";
import { SidebarProvider } from "~/contexts/SidebarContext";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[var(--color-background)] dark:bg-[var(--color-card)]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
