import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useSidebar } from "~/contexts/SidebarContext";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode toggle logic here
  };

  return (
    <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--color-border-light)] transition-colors quick-transition lg:hidden"
          >
            <Bars3Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files, folders, and documents..."
              className="block w-80 pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg leading-5 bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-light)] focus:border-[var(--color-accent-light)] orby-input"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors quick-transition">
              New Folder
            </button>
            <button className="px-4 py-2 bg-[var(--color-button-primary)] hover:bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg transition-colors quick-transition orby-button orby-button-primary">
              Upload Files
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-[var(--color-border-light)] transition-colors quick-transition"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
            ) : (
              <MoonIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-[var(--color-border-light)] transition-colors quick-transition relative">
            <BellIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[var(--color-error)] rounded-full flex items-center justify-center animate-scaleIn">
              <span className="text-xs font-medium text-white">3</span>
            </span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--color-border-light)] transition-colors quick-transition">
              <UserCircleIcon className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
