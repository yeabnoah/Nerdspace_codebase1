import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
  label?: string; // Add label prop
}

export const Progress: React.FC<ProgressProps> = ({ value, className, label }) => {
  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded ${className}`}>
      <div
        className="absolute top-0 left-0 h-2 bg-primary rounded"
        style={{ width: `${value}%` }}
      ></div>
      {label && (
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-white">
          {label}
        </span>
      )}
    </div>
  );
};
