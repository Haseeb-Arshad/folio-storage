import { useState, useRef, useEffect } from "react";
import { 
  LightBulbIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  CalculatorIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import ChatMessage from "~/components/chat/ChatMessage";
import ChatInput from "~/components/chat/ChatInput";
import TypingIndicator from "~/components/chat/TypingIndicator";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedDocuments?: Array<{
    id: string;
    name: string;
    type: string;
    relevance: number;
  }>;
}

interface SuggestedQuery {
  text: string;
  icon: React.ComponentType<any>;
  category: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size?: string;
  indexed?: boolean;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Orby. I can help you find information in your documents, answer questions, and provide insights based on your uploaded files. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries: SuggestedQuery[] = [
    { text: "Summarize my project documents", icon: BookOpenIcon, category: "Analysis" },
    { text: "Find budget information", icon: MagnifyingGlassIcon, category: "Search" },
    { text: "What are the key insights from my reports?", icon: LightBulbIcon, category: "Insights" },
    { text: "Calculate my budget totals", icon: CalculatorIcon, category: "Calculate" },
    { text: "Show me document analytics", icon: ChartBarIcon, category: "Analytics" },
  ];

  // Available documents for @ mentions
  const availableDocuments: Document[] = [
    { id: "1", name: "Project Proposal.pdf", type: "pdf", size: "2.4 MB", indexed: true },
    { id: "2", name: "Meeting Notes.docx", type: "doc", size: "156 KB", indexed: true },
    { id: "3", name: "Budget Analysis.xlsx", type: "xlsx", size: "892 KB", indexed: true },
    { id: "4", name: "Design Mockups.zip", type: "zip", size: "15.2 MB", indexed: false },
    { id: "5", name: "Presentation.pptx", type: "pptx", size: "4.7 MB", indexed: true },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateAIResponse = async (userMessage: string, referencedDocs: Document[] = []) => {
    setIsTyping(true);
    
    // Generate a random response time between 1-3 seconds
    const responseTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      let response = "";
      
      // Craft different responses based on user message content
      if (userMessage.toLowerCase().includes("summary") || userMessage.toLowerCase().includes("summarize")) {
        response = "I've analyzed your documents and found the following key points: 1) Project timeline is estimated at 12 weeks, 2) Budget allocation is within expected parameters, 3) There are several risk factors identified in section 3.4 of your proposal.";
      } else if (userMessage.toLowerCase().includes("budget") || userMessage.toLowerCase().includes("financial")) {
        response = "Based on your Budget Analysis, the total allocated funding is $245,000 with current expenditures at $78,350 (32%). The largest expenses are in the R&D department (45%) followed by Marketing (28%).";
      } else if (userMessage.toLowerCase().includes("meeting") || userMessage.toLowerCase().includes("notes")) {
        response = "Your recent meeting notes from July 15th indicate that the team agreed on revising the project scope to include additional user testing. Sarah was assigned to update the timeline, and Michael will adjust the budget accordingly.";
      } else if (userMessage.toLowerCase().includes("design") || userMessage.toLowerCase().includes("mockup")) {
        response = "I found 14 design mockups in your files. The most recent versions (v3.2) have comments from the design review meeting indicating that the color scheme should be adjusted for better accessibility.";
      } else if (userMessage.toLowerCase().includes("compare") || userMessage.toLowerCase().includes("difference")) {
        response = "Comparing the current project proposal with the previous version, I notice changes in the timeline (extended by 2 weeks), budget (increased by 12%), and team composition (added 2 new UI/UX specialists).";
      } else if (userMessage.toLowerCase().includes("insight") || userMessage.toLowerCase().includes("analysis")) {
        response = "Key insights from your documents suggest that user engagement metrics have improved by 34% after the latest design changes. However, conversion rates remain stable, indicating that the checkout process may need further optimization.";
      } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi") || userMessage.toLowerCase().includes("hey")) {
        response = "Hello! How can I assist you with your documents today? Would you like me to summarize recent files, find specific information, or analyze data across multiple documents?";
      } else {
        response = "I've processed your query. Based on your documents, I found several relevant pieces of information that might help. Would you like me to provide a more detailed analysis or focus on specific aspects of your data?";
      }
      
      // Create related documents from the referenced ones, or use defaults
      let relatedDocuments = referencedDocs.length > 0 
        ? referencedDocs.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            relevance: 0.95
          }))
        : [
            { id: "1", name: "Project Proposal.pdf", type: "pdf", relevance: 0.95 },
            { id: "2", name: "Meeting Notes.docx", type: "doc", relevance: 0.82 },
            { id: "3", name: "Budget Analysis.xlsx", type: "xlsx", relevance: 0.78 },
          ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        relatedDocuments,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, responseTime);
  };

  const handleSendMessage = (message: string, referencedDocs: Document[]) => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(message, referencedDocs);
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query, []);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)]">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Main chat content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
                relatedDocuments={message.relatedDocuments || []}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="max-w-4xl mx-auto">
            {messages.length === 1 && (
              <div className="mb-6">
                <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Try asking:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQueries.map((query, index) => {
                    const Icon = query.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuery(query.text)}
                        className="flex items-center space-x-3 p-4 text-left rounded-xl
                                 bg-[var(--color-card)] border border-[var(--color-border)]
                                 hover:border-[var(--color-accent-light)] transition-all quick-transition
                                 shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-bg)] text-[var(--color-accent)] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--color-text-primary)]">{query.text}</div>
                          <div className="text-xs text-[var(--color-text-tertiary)]">{query.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <ChatInput 
              onSend={handleSendMessage}
              isDisabled={isTyping}
              documents={availableDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
