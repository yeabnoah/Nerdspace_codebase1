import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  className,
  label,
}) => {
  return (
    <div className={`relative w-full h-2 bg-gray-200 font-geist rounded ${className || ""}`}>
      <div
        className="absolute top-0 left-0 h-2 bg-primary font-geist rounded"
        style={{ width: `${value}%` }}
      ></div>
      {label && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 transform font-geist text-xs text-white">
          {label}
        </span>
      )}
    </div>
  );
};
