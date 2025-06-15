import { DocumentIcon, DocumentTextIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { TableCellsIcon } from "@heroicons/react/24/outline";

interface DocumentMentionProps {
  name: string;
  type: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function DocumentMention({ name, type, selected = false, onClick }: DocumentMentionProps) {
  // Determine the icon based on document type
  const getDocumentIcon = () => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return DocumentIcon;
      case 'doc':
      case 'docx':
        return DocumentTextIcon;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return TableCellsIcon;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return PhotoIcon;
      default:
        return DocumentIcon;
    }
  };
  
  const Icon = getDocumentIcon();

  return (
    <div 
      className={`px-3 py-2 rounded-xl flex items-center space-x-2 animate-slideIn cursor-pointer
        ${selected 
          ? 'bg-[var(--color-accent)] text-white' 
          : 'bg-[var(--color-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)]'}
        transition-all quick-transition`}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm truncate">{name}</span>
    </div>
  );
}
