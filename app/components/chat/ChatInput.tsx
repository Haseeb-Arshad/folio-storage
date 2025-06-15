import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import DocumentMention from "./DocumentMention";

interface Document {
  id: string;
  name: string;
  type: string;
}

interface ChatInputProps {
  onSend: (message: string, referencedDocuments: Document[]) => void;
  isDisabled?: boolean;
  documents: Document[];
}

export default function ChatInput({ onSend, isDisabled = false, documents }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [referencedDocuments, setReferencedDocuments] = useState<Document[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mentionContainerRef = useRef<HTMLDivElement>(null);

  // Filter documents based on the current mention query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(mentionFilter.toLowerCase())
  ).slice(0, 5); // Limit to 5 suggestions

  // Check for @ mentions
  useEffect(() => {
    const atIndex = inputValue.lastIndexOf('@');
    if (atIndex >= 0) {
      const afterAt = inputValue.substring(atIndex + 1);
      const spaceAfterAt = afterAt.indexOf(' ');
      const mentionText = spaceAfterAt >= 0 ? afterAt.substring(0, spaceAfterAt) : afterAt;
      setMentionFilter(mentionText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  }, [inputValue]);

  // Handle selecting a document from mentions
  const handleSelectDocument = (doc: Document) => {
    // Replace the @mention with the document name
    const atIndex = inputValue.lastIndexOf('@');
    if (atIndex >= 0) {
      const beforeAt = inputValue.substring(0, atIndex);
      const afterAt = inputValue.substring(atIndex + 1);
      const spaceAfterAt = afterAt.indexOf(' ');
      const afterMention = spaceAfterAt >= 0 ? afterAt.substring(spaceAfterAt) : '';
      
      setInputValue(`${beforeAt}@${doc.name}${afterMention}`);
      
      // Add to referenced documents if not already there
      if (!referencedDocuments.some(d => d.id === doc.id)) {
        setReferencedDocuments([...referencedDocuments, doc]);
      }
    }
    
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // Handle sending the message
  const handleSend = () => {
    if (inputValue.trim() && !isDisabled) {
      onSend(inputValue, referencedDocuments);
      setInputValue("");
      setReferencedDocuments([]);
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Click outside to close mentions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionContainerRef.current && !mentionContainerRef.current.contains(event.target as Node)) {
        setShowMentions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative">
      {/* Input field - styled like the reference image */}
      <div className="relative rounded-2xl bg-[var(--color-background)] p-[1px]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
          placeholder="Ask Orby anything..."
          className="w-full px-4 py-3 pr-12 outline-none rounded-2xl bg-[var(--color-background)] 
                    text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]
                    shadow-sm border border-[var(--color-border)]
                    focus:border-[var(--color-accent-light)] focus:ring-1 focus:ring-[var(--color-accent-light)]
                    transition-all quick-transition"
        />
        
        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isDisabled}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full
                    bg-[var(--color-accent)] text-white
                    hover:bg-opacity-80 transition-all quick-transition
                    ${(!inputValue.trim() || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ArrowUpIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Document mention dropdown */}
      {showMentions && filteredDocuments.length > 0 && (
        <div 
          ref={mentionContainerRef}
          className="absolute bottom-full mb-2 w-full bg-[var(--color-card)] 
                   rounded-2xl shadow-lg border border-[var(--color-border)]
                   max-h-60 overflow-y-auto z-10"
        >
          <div className="p-2 space-y-1">
            {filteredDocuments.map((doc) => (
              <DocumentMention 
                key={doc.id}
                name={doc.name}
                type={doc.type}
                onClick={() => handleSelectDocument(doc)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Referenced documents chips */}
      {referencedDocuments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {referencedDocuments.map((doc) => (
            <div 
              key={doc.id}
              className="px-2 py-1 bg-[var(--color-background)] text-[var(--color-text-secondary)]
                      text-xs rounded-full border border-[var(--color-border)]
                      flex items-center space-x-1"
            >
              <span>@{doc.name}</span>
              <button
                onClick={() => setReferencedDocuments(referencedDocuments.filter(d => d.id !== doc.id))}
                className="ml-1 w-4 h-4 rounded-full bg-[var(--color-accent-light)] 
                        text-white flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-xs text-[var(--color-text-tertiary)] mt-2 ml-1">
        Type @ to reference a document • Enter to send
      </p>
    </div>
  );
}
