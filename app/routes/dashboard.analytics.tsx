import { 
  ChartBarIcon, 
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  UsersIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

export default function AnalyticsPage() {
  const stats = [
    {
      name: "Total Files",
      value: "1,247",
      change: "+12%",
      changeType: "increase",
      icon: DocumentIcon,
      color: "bg-blue-500"
    },
    {
      name: "Storage Used",
      value: "8.4 GB",
      change: "+2.1 GB",
      changeType: "increase", 
      icon: CloudArrowUpIcon,
      color: "bg-green-500"
    },
    {
      name: "AI Queries",
      value: "89",
      change: "+24%",
      changeType: "increase",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500"
    },
    {
      name: "File Views",
      value: "2,456",
      change: "+8%",
      changeType: "increase",
      icon: EyeIcon,
      color: "bg-orange-500"
    }
  ];

  const activityData = [
    { date: "Mon", uploads: 12, views: 45, queries: 8 },
    { date: "Tue", uploads: 8, views: 32, queries: 12 },
    { date: "Wed", uploads: 15, views: 58, queries: 6 },
    { date: "Thu", uploads: 22, views: 78, queries: 15 },
    { date: "Fri", uploads: 18, views: 65, queries: 11 },
    { date: "Sat", uploads: 5, views: 23, queries: 3 },
    { date: "Sun", uploads: 9, views: 31, queries: 7 }
  ];

  const topFiles = [
    { name: "Project Proposal.pdf", views: 234, type: "pdf" },
    { name: "Meeting Notes.docx", views: 189, type: "doc" },
    { name: "Budget Analysis.xlsx", views: 156, type: "excel" },
    { name: "Design Mockups", views: 98, type: "folder" },
    { name: "Marketing Plan.pptx", views: 87, type: "ppt" }
  ];

  const aiInsights = [
    {
      title: "Peak Usage Time",
      description: "Most activity occurs between 9-11 AM and 2-4 PM",
      icon: ClockIcon,
      color: "text-blue-600"
    },
    {
      title: "Popular File Types",
      description: "PDFs account for 45% of all file interactions",
      icon: DocumentIcon,
      color: "text-green-600"
    },
    {
      title: "AI Query Trends",
      description: "Document summarization is your most used AI feature",
      icon: ChatBubbleLeftRightIcon,
      color: "text-purple-600"
    },
    {
      title: "Storage Optimization",
      description: "Consider archiving files older than 6 months to save space",
      icon: CloudArrowUpIcon,
      color: "text-orange-600"
    }
  ];

  const maxValue = Math.max(...activityData.map(d => Math.max(d.uploads, d.views, d.queries)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Insights into your document management and AI usage patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.changeType === 'increase' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Activity
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Uploads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">AI Queries</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between h-64 space-x-2">
          {activityData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col items-center space-y-1 h-48">
                {/* Views bar */}
                <div
                  className="w-full bg-green-500 rounded-t-sm min-h-[4px]"
                  style={{ height: `${(day.views / maxValue) * 100}%` }}
                  title={`${day.views} views`}
                />
                {/* Uploads bar */}
                <div
                  className="w-full bg-blue-500 min-h-[4px]"
                  style={{ height: `${(day.uploads / maxValue) * 100}%` }}
                  title={`${day.uploads} uploads`}
                />
                {/* AI Queries bar */}
                <div
                  className="w-full bg-purple-500 rounded-b-sm min-h-[4px]"
                  style={{ height: `${(day.queries / maxValue) * 100}%` }}
                  title={`${day.queries} AI queries`}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Files */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Viewed Files
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {topFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.type.toUpperCase()} file
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {file.views}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Powered Insights
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-50 dark:bg-gray-700`}>
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Trends */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Usage Recommendations
          </h2>
          <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              🚀 Optimize Performance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Archive old files to improve search speed and reduce storage costs.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              🤖 AI Usage Tip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Try using more specific queries to get better AI responses from your documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
