import { Link } from "@remix-run/react";
import { FolderIcon } from "@heroicons/react/24/outline";

const folders = [
  { id: "1", name: "Summer Vacation", count: 42, color: "bg-blue-500" },
  { id: "2", name: "Project Alpha", count: 128, color: "bg-green-500" },
  { id: "3", name: "Family Photos", count: 256, color: "bg-yellow-500" },
  { id: "4", name: "Work Documents", count: 88, color: "bg-red-500" },
  { id: "5", name: "Design Assets", count: 215, color: "bg-indigo-500" },
  { id: "6", name: "Invoices", count: 73, color: "bg-purple-500" },
];

export default function FoldersPage() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Folders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {folders.map((folder) => (
          <Link
            to={`/folders/${folder.id}`}
            key={folder.id}
            className="block p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 group"
          >
            <div className={`w-16 h-16 rounded-full ${folder.color} flex items-center justify-center mb-4`}>
              <FolderIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-500 transition-colors duration-300">{folder.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{folder.count} items</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
