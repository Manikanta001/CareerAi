import React from 'react';

/** CareerAI mark: a clear upward path set inside a confident blue tile. */
const BrandMark = ({ size = 'h-10 w-10', iconSize = 'h-6 w-6' }) => (
  <span className={`${size} inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-blue-600/20`} aria-hidden="true">
    <svg className={iconSize} viewBox="0 0 24 24" fill="none">
      <path d="M4.5 18.5h15" stroke="white" strokeOpacity=".56" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m5.5 15.5 4.1-4.1 3.2 2.7 5.7-6.2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.7 7.9h3.8v3.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default BrandMark;
