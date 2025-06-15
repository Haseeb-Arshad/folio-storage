import { 
  DocumentIcon, 
  FolderIcon, 
  CloudArrowUpIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function DashboardHome() {
  const quickActions = [
    {
      name: "Upload Files",
      description: "Add new documents to your drive",
      icon: CloudArrowUpIcon,
      href: "/dashboard/upload",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "New Folder", 
      description: "Organize your files",
      icon: FolderIcon,
      href: "/dashboard/files?action=new-folder",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      name: "AI Chat",
      description: "Ask questions about your documents",
      icon: ChatBubbleLeftRightIcon,
      href: "/dashboard/chat",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      name: "Analytics",
      description: "View usage insights",
      icon: ChartBarIcon,
      href: "/dashboard/analytics",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const recentFiles = [
    { name: "Project Proposal.pdf", size: "2.4 MB", modified: "2 hours ago", type: "pdf" },
    { name: "Meeting Notes.docx", size: "156 KB", modified: "1 day ago", type: "doc" },
    { name: "Design Assets", size: "45.2 MB", modified: "3 days ago", type: "folder" },
    { name: "Budget Spreadsheet.xlsx", size: "892 KB", modified: "1 week ago", type: "excel" }
  ];

  const stats = [
    { label: "Total Files", value: "1,247", change: "+12%" },
    { label: "Storage Used", value: "8.4 GB", change: "+2.1%" },
    { label: "Shared Files", value: "156", change: "+8%" },
    { label: "AI Queries", value: "89", change: "+24%" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your intelligent document management system is ready. What would you like to do today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            className={`${action.color} text-white rounded-xl p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200`}
          >
            <action.icon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{action.name}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </a>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Files */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Files</h2>
            <a href="/dashboard/files" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View All
            </a>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentFiles.map((file, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {file.type === 'folder' ? (
                    <FolderIcon className="w-8 h-8 text-blue-500" />
                  ) : (
                    <DocumentIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{file.size}</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{file.modified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
