import { Link, useLocation } from "@remix-run/react";
import { useSidebar } from "~/contexts/SidebarContext";
import { 
  HomeIcon, 
  DocumentIcon, 
  CloudArrowUpIcon, 
  ChatBubbleLeftRightIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "My Files", href: "/dashboard/files", icon: DocumentIcon },
  { name: "Upload", href: "/dashboard/upload", icon: CloudArrowUpIcon },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: FolderIcon },
  { name: "AI Chat", href: "/dashboard/chat", icon: ChatBubbleLeftRightIcon },
  { name: "Search", href: "/dashboard/search", icon: MagnifyingGlassIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <div className={`bg-[var(--color-card)] border-r border-[var(--color-border)] transition-all gluey-transition ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Drive Pro
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--color-border-light)] transition-colors quick-transition"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors quick-transition group ${
                  isActive
                    ? 'bg-[var(--color-border-light)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)]'
                }`}
              >
                <item.icon className={`flex-shrink-0 w-5 h-5 ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="bg-[var(--color-background)] rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[var(--color-accent-bg)] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[var(--color-accent)]">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    User
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                    Free Plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
