import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench } from 'lucide-react';

const UnderDevelopmentPopup: React.FC<{ onHide?: () => void }> = ({ onHide }) => {
  const [visible, setVisible] = useState(true);

  const hide = () => { setVisible(false); onHide?.(); };

  useEffect(() => {
    const timer = setTimeout(hide, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => hide()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl px-10 py-8 max-w-sm w-full mx-4 text-center"
          >
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Website Under Development</h3>
            <p className="text-gray-500 text-sm mb-4">
              We're working hard to bring you an amazing experience. Some features may not be fully available yet.
            </p>
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Closing automatically…</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnderDevelopmentPopup;
