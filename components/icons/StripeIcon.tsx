import React from 'react';

export const StripeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="38" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Stripe</title>
      <g fill="#fff">
        <path d="M34.8 3.5c-2.3 0-4.2 1.9-4.2 4.2h8.3c0-2.3-1.8-4.2-4.1-4.2zM21.1 7.7v13.5c0 2.3 1.9 4.2 4.2 4.2h5.3V7.7h-9.5zM3.5 3.5C1.6 3.5 0 5.1 0 7v1.7h14.9V3.5H3.5zM0 12.3v3.5C0 18 1.6 19.6 3.5 19.6h11.4V12.3H0z" />
      </g>
    </svg>
);