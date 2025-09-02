import React from 'react';

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <title>QR Code</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v3m0-3h3m-3 0L9 9m10.5-4.5v3m0-3h-3m3 0L15 9M4.5 19.5v-3m0 3h3m-3 0L9 15m10.5 4.5v-3m0 3h-3m3 0L15 15M9 12h6" />
  </svg>
);
