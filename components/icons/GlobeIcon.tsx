import React from 'react';

export const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.75 4a9 9 0 0110.5 0M7.75 4a9 9 0 00-3.513 4.31M16.25 4a9 9 0 013.513 4.31M5.121 15.121A9.014 9.014 0 012.35 11m17.3 4.121a9.014 9.014 0 01-2.77 4.121M12 12a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);