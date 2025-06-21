import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface Action {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    isDestructive?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    actions: Action[];
    onClose: () => void;
}

const menuVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1 },
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.1 },
    }),
};

const ContextMenu = ({ x, y, actions, onClose }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                style={{ top: y, left: x }}
                className="fixed z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <ul className="py-1">
                    {actions.map((action, i) => (
                        <motion.li
                            key={action.label}
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <button
                                onClick={() => {
                                    action.onClick();
                                    onClose();
                                }}
                                className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${action.isDestructive
                                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="mr-3 w-5 h-5">{action.icon}</span>
                                {action.label}
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContextMenu;
