import React from 'react';

/**
 * Four-dot "..." loading animation component.
 * - 4 dots, each 8px wide
 * - 1.2s infinite animation loop with 0.2s stagger delay
 * - Accessible with aria-label="Loading" and role="status"
 * - Respects prefers-reduced-motion
 */
const DotLoader = ({ className = '', dotClassName = 'text-white' }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`four-dot-loader ${dotClassName} ${className}`}
    >
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default DotLoader;
