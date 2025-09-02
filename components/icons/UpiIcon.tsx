import React from 'react';

export const UpiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>UPI</title>
        <path d="M4 16.333V7.667a2 2 0 012-2h12a2 2 0 012 2v8.666a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 14v-2.333a1.333 1.333 0 10-2.667 0V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 14v-4l2 4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
