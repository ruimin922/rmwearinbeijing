import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SVGPreviewListProps {
  svgPreviews: string[];
  handlePreviewClick: (index: number) => void;
}

const SVGPreviewList: React.FC<SVGPreviewListProps> = ({ svgPreviews, handlePreviewClick }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide">
      <AnimatePresence>
        {svgPreviews.map((svg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 mb-2 mr-2 cursor-pointer"
            onClick={() => handlePreviewClick(index)}
          >
            <div className="w-24 h-36 bg-card rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SVGPreviewList;
