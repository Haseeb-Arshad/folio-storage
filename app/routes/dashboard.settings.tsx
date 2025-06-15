import { useState } from "react";
import { 
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CloudIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    fileUploads: true,
    aiResponses: true,
    sharing: false,
    storage: true
  });
  
  const [privacy, setPrivacy] = useState({
    indexFiles: true,
    shareAnalytics: false,
    aiTraining: true
  });

  const [theme, setTheme] = useState("system");

  const settingSections = [
    {
      title: "Profile",
      icon: UserCircleIcon,
      items: [
        { label: "Personal Information", description: "Update your profile details" },
        { label: "Account Security", description: "Password and two-factor authentication" },
        { label: "Connected Apps", description: "Manage third-party integrations" }
      ]
    },
    {
      title: "Notifications", 
      icon: BellIcon,
      items: [
        { 
          label: "File Upload Complete",
          description: "Get notified when uploads finish",
          toggle: true,
          value: notifications.fileUploads,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, fileUploads: value }))
        },
        {
          label: "AI Response Ready",
          description: "Notifications for AI chat responses", 
          toggle: true,
          value: notifications.aiResponses,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, aiResponses: value }))
        },
        {
          label: "File Sharing Activity",
          description: "When files are shared with you",
          toggle: true,
          value: notifications.sharing,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, sharing: value }))
        },
        {
          label: "Storage Alerts",
          description: "Low storage and quota warnings",
          toggle: true,
          value: notifications.storage,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, storage: value }))
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: ShieldCheckIcon,
      items: [
        {
          label: "AI File Indexing",
          description: "Allow AI to index your files for better search",
          toggle: true,
          value: privacy.indexFiles,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, indexFiles: value }))
        },
        {
          label: "Usage Analytics",
          description: "Share anonymous usage data to improve the service",
          toggle: true,
          value: privacy.shareAnalytics,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, shareAnalytics: value }))
        },
        {
          label: "AI Model Training",
          description: "Use your data to improve AI responses",
          toggle: true,
          value: privacy.aiTraining,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, aiTraining: value }))
        }
      ]
    },
    {
      title: "Storage & Sync",
      icon: CloudIcon,
      items: [
        { label: "Storage Usage", description: "8.4 GB of 15 GB used", showUsage: true },
        { label: "Auto-Sync Settings", description: "Configure automatic file synchronization" },
        { label: "Backup & Recovery", description: "Set up automatic backups" }
      ]
    },
    {
      title: "Appearance",
      icon: PaintBrushIcon,
      items: [
        {
          label: "Theme",
          description: "Choose your preferred color scheme",
          select: true,
          value: theme,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" }
          ],
          onChange: (value: string) => setTheme(value)
        },
        { label: "Sidebar Layout", description: "Customize sidebar behavior" },
        { label: "File View Options", description: "Default view modes and sorting" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account, preferences, and application settings
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Welcome, User!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              user@example.com • Free Plan
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last active: 2 minutes ago
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <section.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                      
                      {/* Storage Usage Bar */}
                      {item.showUsage && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>8.4 GB used</span>
                            <span>15 GB total</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: '56%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {/* Toggle Switch */}
                      {item.toggle && (
                        <button
                          onClick={() => item.onChange?.(!(item.value as boolean))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {/* Select Dropdown */}
                      {item.select && (
                        <select
                          value={item.value as string}
                          onChange={(e) => item.onChange?.(e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          {item.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {/* Arrow for navigation */}
                      {!item.toggle && !item.select && !item.showUsage && (
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Danger Zone
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                Clear All Data
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete all your files and data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              Clear Data
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                Delete Account
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drive Pro v1.0.0 • Made with ❤️ for better document management
        </p>
      </div>
    </div>
  );
}
