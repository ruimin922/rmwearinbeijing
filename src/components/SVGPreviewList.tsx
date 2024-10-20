import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SVGPreviewListProps {
  svgPreviews: string[];
  handlePreviewClick: (index: number) => void;
  selectedSvgIndex: number | null;
}

const SVGPreviewList: React.FC<SVGPreviewListProps> = ({ svgPreviews, handlePreviewClick, selectedSvgIndex }) => {
  const [svgDimensions, setSvgDimensions] = useState<{ [key: number]: { width: number; height: number } }>({});
  const svgContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    svgPreviews.forEach((svgCode, index) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      const viewBox = svgElement.getAttribute('viewBox');
      const width = svgElement.getAttribute('width');
      const height = svgElement.getAttribute('height');

      let dimensions = { width: 0, height: 0 };

      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
        dimensions = { width: vbWidth, height: vbHeight };
      } else if (width && height) {
        dimensions = { width: parseFloat(width), height: parseFloat(height) };
      }

      setSvgDimensions(prev => ({ ...prev, [index]: dimensions }));
    });
  }, [svgPreviews]);

  const getColumnItems = (columnIndex: number) => {
    return svgPreviews.filter((_, index) => index % 2 === columnIndex);
  };

  return (
    <div className="mt-4">
      <div className="flex -mx-2">
        {[0, 1].map((columnIndex) => (
          <div key={columnIndex} className="w-1/2 px-2">
            <AnimatePresence>
              {getColumnItems(columnIndex).map((svg, index) => {
                const actualIndex = columnIndex + index * 2;
                const dimensions = svgDimensions[actualIndex] || { width: 0, height: 0 };
                const aspectRatio = dimensions.width / dimensions.height;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 cursor-pointer ${selectedSvgIndex === actualIndex ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handlePreviewClick(actualIndex)}
                  >
                    <div 
                      className="bg-card rounded-lg shadow-md overflow-hidden"
                      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%`, position: 'relative' }}
                    >
                      <div 
                        ref={(el: HTMLDivElement | null) => {
                          svgContainerRefs.current[actualIndex] = el;
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: svg.replace(
                              /<svg/, 
                              '<svg style="width: 100%; height: 100%; object-fit: contain;" preserveAspectRatio="xMidYMid meet"'
                            ) 
                          }} 
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SVGPreviewList;
