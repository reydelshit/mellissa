import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PlotProps {
  id: string;
  d: string;
  onClick: () => void;
  fillColor: string;
}

export default function PathContainer({
  id,
  d,
  onClick,
  fillColor,
}: PlotProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current && showTooltip) {
      const rect = pathRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  }, [showTooltip]);

  const renderTooltip = () => {
    if (!showTooltip) return null;

    return createPortal(
      <div
        style={{
          position: 'fixed',
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translate(-50%, -100%)',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        <div className="relative flex flex-col items-center">
          <div className="bg-white text-black rounded-lg px-3 py-2 shadow-lg mb-1">
            <span className="text-sm whitespace-nowrap text-black">{id}</span>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white text-black transform rotate-45" />
          </div>
          <MapPin className="text-green-600" size={24} />
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        d={d}
        fill={fillColor}
        fillOpacity="1"
        fillRule="nonzero"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
      {renderTooltip()}
    </>
  );
}
