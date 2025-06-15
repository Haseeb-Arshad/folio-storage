import { useState } from "react";
import { 
  BookOpenIcon,
  TagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentIcon,
  FolderIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'note' | 'document' | 'collection';
  content?: string;
  tags: string[];
  created: string;
  modified: string;
  author: string;
  starred: boolean;
  views: number;
  size?: string;
}

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "Project Planning Guidelines",
      type: "note",
      content: "Comprehensive guide for project planning and execution...",
      tags: ["planning", "guidelines", "project"],
      created: "2024-01-15",
      modified: "2024-01-20",
      author: "You",
      starred: true,
      views: 45
    },
    {
      id: "2", 
      title: "Meeting Minutes Collection",
      type: "collection",
      tags: ["meetings", "notes", "archive"],
      created: "2024-01-10",
      modified: "2024-01-22",
      author: "Team",
      starred: false,
      views: 23
    },
    {
      id: "3",
      title: "API Documentation",
      type: "document",
      tags: ["technical", "api", "reference"],
      created: "2024-01-05",
      modified: "2024-01-18",
      author: "Dev Team",
      starred: true,
      views: 78,
      size: "2.4 MB"
    },
    {
      id: "4",
      title: "Design System Notes",
      type: "note",
      content: "Color schemes, typography, and component guidelines...",
      tags: ["design", "ui", "guidelines"],
      created: "2024-01-12",
      modified: "2024-01-19",
      author: "Design Team",
      starred: false,
      views: 34
    }
  ];

  const categories = [
    { id: "all", name: "All Items", count: knowledgeItems.length },
    { id: "notes", name: "Notes", count: knowledgeItems.filter(item => item.type === 'note').length },
    { id: "documents", name: "Documents", count: knowledgeItems.filter(item => item.type === 'document').length },
    { id: "collections", name: "Collections", count: knowledgeItems.filter(item => item.type === 'collection').length },
    { id: "starred", name: "Starred", count: knowledgeItems.filter(item => item.starred).length }
  ];

  const popularTags = [
    "planning", "guidelines", "project", "meetings", "technical", 
    "design", "api", "reference", "notes", "archive"
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" ||
                           (selectedCategory === "starred" && item.starred) ||
                           (selectedCategory === item.type + "s");
    
    return matchesSearch && matchesCategory;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'note': return PencilIcon;
      case 'document': return DocumentIcon;
      case 'collection': return FolderIcon;
      default: return BookOpenIcon;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'note': return 'text-blue-500';
      case 'document': return 'text-green-500';
      case 'collection': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Your organized collection of notes, documents, and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>New Note</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2">
            <ArchiveBoxIcon className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const ItemIcon = getItemIcon(item.type);
          
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700`}>
                    <ItemIcon className={`w-5 h-5 ${getItemColor(item.type)}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {item.type}
                    </p>
                  </div>
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.starred ? (
                    <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                  )}
                </button>
              </div>

              {/* Content Preview */}
              {item.content && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {item.content}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="w-3 h-3" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{new Date(item.modified).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <ShareIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No knowledge items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery ? `No items match "${searchQuery}"` : 'Start building your knowledge base'}
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Create Your First Note
          </button>
        </div>
      )}

      {/* Popular Tags */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <TagIcon className="w-5 h-5 text-purple-500" />
          <span>Popular Tags</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
