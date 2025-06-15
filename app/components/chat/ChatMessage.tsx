import { UserIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface DocumentReference {
  name: string;
  type: string;
  relevance: number;
}

interface ChatMessageProps {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedDocuments?: DocumentReference[];
}

export default function ChatMessage({ type, content, timestamp, relatedDocuments }: ChatMessageProps) {
  return (
    <div className={`flex animate-scaleIn ${type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-3xl ${type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-start space-x-3 ${type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            type === 'user' 
              ? 'bg-[var(--color-accent)]' 
              : 'bg-[var(--color-accent)]'
          }`}>
            {type === 'user' ? (
              <UserIcon className="w-4 h-4 text-white" />
            ) : (
              <SparklesIcon className="w-4 h-4 text-white" />
            )}
          </div>
          
          {/* Message Content */}
          <div className={`flex-1 ${type === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block p-4 rounded-2xl shadow-sm ${
              type === 'user'
                ? 'bg-[var(--color-card)] text-[var(--color-text-primary)]'
                : 'bg-[var(--color-card)] text-[var(--color-text-primary)]'
            }`}>
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
            
            {/* Related Documents */}
            {relatedDocuments && relatedDocuments.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Referenced documents:
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedDocuments.map((doc, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full 
                        text-xs text-[var(--color-text-secondary)] flex items-center space-x-1 
                        hover:bg-[var(--color-border-light)] transition-colors quick-transition"
                    >
                      <span className="font-medium">@{doc.name}</span>
                      <span className="text-[var(--color-text-tertiary)]">
                        • {doc.relevance}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Timestamp */}
            <div className="flex items-center mt-2 text-[var(--color-text-tertiary)]">
              <span className="text-xs">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
