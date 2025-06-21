import { motion } from 'framer-motion';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

interface FabActionProps {
  icon: IconComponent;
  label: string;
  onClick: () => void;
}

const FabAction = ({ icon: Icon, label, onClick }: FabActionProps) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div 
        className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        {label}
      </motion.div>
      <motion.button
        onClick={onClick}
        className="w-12 h-12 bg-white text-blue-600 rounded-full shadow-md flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon size={24} />
      </motion.button>
    </div>
  );
};

export default FabAction;
