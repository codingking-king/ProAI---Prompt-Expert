import React from 'react';

export const RazorpayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 1024 286" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Razorpay</title>
    <g fill="#FFFFFF">
        <path d="M228 102h45l-42 153h-46zM279 102h46l-20 78-22 75h-46z" />
        <path d="M432 255V102h-53v153h123v-40H432zM566 102h-53v153h53V102zM625 102v119h77v34h-130V102h53zM858 102l-51 153h-47l-50-153h54l25 82 25-82h44zM1024 102v153h-52l-71-93v93h-50V102h52l71 93V102h50z" />
        <path d="M126 126l-36-24-34 24v106l34 24 36-24V126zm-35 91L58 194v-52l33 23v52zM0 102h120l3 12-42 29v85l-39 27-42-27V143L0 102z" />
    </g>
  </svg>
);