import { SparklesIcon } from "@heroicons/react/24/solid";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div className="p-4 rounded-2xl shadow-sm bg-[var(--color-card)]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent-light)] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent-light)] animate-pulse" 
                 style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent-light)] animate-pulse"
                 style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
