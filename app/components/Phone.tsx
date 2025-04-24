import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Phone() {
  return (
    <div className="relative flex justify-center items-center py-8">
      {/* Phone frame */}
      <motion.div 
        className="relative w-[280px] h-[580px] bg-white rounded-[45px] shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ 
          boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06) inset',
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-[20px] z-20 flex justify-center items-center">
          <div className="w-[8px] h-[8px] bg-gray-600 rounded-full mr-1"></div>
          <div className="w-[6px] h-[6px] bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Screen content - Nighttime cityscape */}
        <div className="relative w-full h-full bg-[#0a0e17] overflow-hidden">
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a] to-[#030612]"></div>
          
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 40}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`
                }}
              />
            ))}
          </div>
          
          {/* Moon */}
          <div className="absolute top-[10%] right-[15%] w-[40px] h-[40px] rounded-full bg-[#ebf3fe] opacity-90 shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]"></div>
          
          {/* City skyline - Illuminated buildings */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%]">
            {/* Building 1 */}
            <div className="absolute bottom-0 left-[5%] w-[40px] h-[180px] bg-[#101624]">
              <div className="grid grid-cols-4 gap-1 p-1 h-full">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full bg-[#ffeb99]"
                    style={{ 
                      opacity: Math.random() > 0.3 ? 0.8 : 0,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Building 2 */}
            <div className="absolute bottom-0 left-[20%] w-[60px] h-[220px] bg-[#101624]">
              <div className="grid grid-cols-5 gap-1 p-1 h-full">
                {[...Array(40)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full bg-[#ffeb99]"
                    style={{ 
                      opacity: Math.random() > 0.4 ? 0.8 : 0,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Building 3 - Tallest */}
            <div className="absolute bottom-0 left-[45%] w-[50px] h-[320px] bg-[#101624]">
              <div className="grid grid-cols-4 gap-1 p-1 h-full">
                {[...Array(48)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full bg-[#ffeb99]"
                    style={{ 
                      opacity: Math.random() > 0.3 ? 0.8 : 0,
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-[6px] h-[10px] bg-red-600"></div>
            </div>
            
            {/* Building 4 */}
            <div className="absolute bottom-0 left-[70%] w-[45px] h-[160px] bg-[#101624]">
              <div className="grid grid-cols-4 gap-1 p-1 h-full">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full bg-[#ffeb99]"
                    style={{ 
                      opacity: Math.random() > 0.3 ? 0.8 : 0,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Building 5 */}
            <div className="absolute bottom-0 right-[5%] w-[35px] h-[200px] bg-[#101624]">
              <div className="grid grid-cols-3 gap-1 p-1 h-full">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full bg-[#ffeb99]"
                    style={{ 
                      opacity: Math.random() > 0.3 ? 0.8 : 0,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Reflection on water */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-[#0a1a3a] to-transparent opacity-40"></div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[40%] h-[4px] bg-white rounded-full z-20"></div>
      </motion.div>
      
      {/* Phone shadow */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[220px] h-[15px] bg-black/20 blur-xl rounded-full"></div>
      
      {/* Add keyframe for twinkling stars */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 