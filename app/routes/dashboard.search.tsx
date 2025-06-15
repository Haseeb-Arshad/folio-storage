import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  FolderIcon,
  SparklesIcon,
  TagIcon,
  CalendarIcon,
  UserIcon
} from "@heroicons/react/24/outline";

interface SearchResult {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: string;
  path: string;
  size?: string;
  modified: string;
  preview?: string;
  relevance: number;
  matches: string[];
  tags: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    fileType: "all",
    dateRange: "all",
    size: "all",
    tags: [] as string[]
  });
  const [searchHistory, setSearchHistory] = useState([
    "project proposal",
    "budget analysis",
    "meeting notes 2024",
    "design mockups",
    "quarterly report"
  ]);

  const mockResults: SearchResult[] = [
    {
      id: "1",
      name: "Project Proposal Final.pdf",
      type: "file",
      fileType: "pdf",
      path: "/Documents/Projects",
      size: "2.4 MB",
      modified: "2 hours ago",
      relevance: 95,
      matches: ["project", "proposal", "final"],
      tags: ["important", "2024", "client"]
    },
    {
      id: "2", 
      name: "Project Planning Notes.docx",
      type: "file",
      fileType: "doc",
      path: "/Documents/Projects",
      size: "156 KB",
      modified: "1 day ago",
      relevance: 87,
      matches: ["project", "planning"],
      tags: ["notes", "meeting"]
    },
    {
      id: "3",
      name: "Projects Archive",
      type: "folder",
      path: "/Documents",
      modified: "1 week ago",
      relevance: 78,
      matches: ["project"],
      tags: ["archive", "old"]
    }
  ];

  const popularTags = [
    "important", "2024", "client", "meeting", "draft", "final", 
    "presentation", "analysis", "notes", "archive"
  ];

  const aiSuggestions = [
    "Find all documents from last month",
    "Show me presentations about project X",
    "Documents shared with team members",
    "Large files taking up storage space",
    "Files I haven't opened in 30 days"
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const filteredResults = mockResults
          .filter(result => 
            result.name.toLowerCase().includes(query.toLowerCase()) ||
            result.matches.some(match => 
              match.toLowerCase().includes(query.toLowerCase())
            )
          )
          .sort((a, b) => b.relevance - a.relevance);
        
        setResults(filteredResults);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);

  const getFileIcon = (result: SearchResult) => {
    if (result.type === 'folder') return FolderIcon;
    
    switch (result.fileType) {
      case 'pdf':
      case 'doc':
        return DocumentIcon;
      case 'image':
        return PhotoIcon;
      case 'video':
        return FilmIcon;
      case 'audio':
        return MusicalNoteIcon;
      default:
        return DocumentIcon;
    }
  };

  const highlightMatch = (text: string, matches: string[]) => {
    let highlightedText = text;
    matches.forEach(match => {
      const regex = new RegExp(`(${match})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-1">$1</mark>');
    });
    return highlightedText;
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find anything in your documents using natural language or keywords
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, content, or ask a question like 'Find my project documents from last month'"
            className="block w-full pl-12 pr-4 py-4 text-lg border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <SparklesIcon className="h-5 w-5 text-blue-500" />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <select
              value={filters.fileType}
              onChange={(e) => setFilters(prev => ({ ...prev, fileType: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="documents">Documents</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="folders">Folders</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1">
            <FunnelIcon className="w-4 h-4" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Search Results */}
      {query.length > 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Results
              </h2>
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((result) => {
              const FileIcon = getFileIcon(result);
              
              return (
                <div key={result.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <FileIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 
                          className="text-lg font-medium text-gray-900 dark:text-white"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightMatch(result.name, result.matches) 
                          }}
                        />
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          {result.relevance}% match
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>{result.path}</span>
                        {result.size && <span>{result.size}</span>}
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{result.modified}</span>
                        </div>
                      </div>
                      
                      {result.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-3 h-3 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {results.length === 0 && !isSearching && query.length > 2 && (
            <div className="px-6 py-12 text-center">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                Search in AI Chat instead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {query.length === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Searches
            </h3>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI-Powered Suggestions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-purple-500" />
              <span>AI Suggestions</span>
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {query.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleSearch(`tag:${tag}`)}
                className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
