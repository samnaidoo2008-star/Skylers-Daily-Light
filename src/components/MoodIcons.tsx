import React from 'react';
import { MoodType } from '../types';

interface MoodIconProps {
  type: MoodType;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const MoodIcon: React.FC<MoodIconProps> = ({
  type,
  className = 'w-5 h-5',
  size = 20,
  strokeWidth = 1.5
}) => {
  switch (type) {
    case 'peaceful':
      // Graceful dove in flight with olive branch
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M19 12c-2.5 0-5.5-1.5-7.5-4-1 3-3.5 5.5-6.5 6 1.5 2 4 3 6.5 3 2.5 0 5-1 7.5-5z" />
          <path d="M12 8c1-3 3-5 6-5 0 2.5-1 4.5-3 5.5" />
          <path d="M5 14c-1.5 1-2.5 2.5-3 4.5 2 0 4-1 5.5-2.5" />
          <circle cx="16" cy="6" r="0.5" fill="currentColor" />
        </svg>
      );

    case 'joyful':
      // Radiant golden sunburst with clean rays
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="4.5" />
          <line x1="12" y1="2" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" />
          <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
          <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" />
          <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
        </svg>
      );

    case 'blessed':
      // Four-point celestial starburst / divine flare
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2c0 5 4 9 9 9-5 0-9 4-9 9 0-5-4-9-9-9 5 0 9-4 9-9z" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'grateful':
      // Elegant peony / blossom with delicate petals
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 21a9 9 0 0 0 9-9c0-4-3-8-9-10-6 2-9 6-9 10a9 9 0 0 0 9 9z" />
          <path d="M12 11c-2.5-3-2-6 0-8 2 2 2.5 5 0 8z" />
          <path d="M8 14c-1-2-1-4.5.5-6.5 2 1 3 3 1.5 5.5" />
          <path d="M16 14c1-2 1-4.5-.5-6.5-2 1-3 3-1.5 5.5" />
        </svg>
      );

    case 'hopeful':
      // Tender young seedling unfurling upward
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 22v-9" />
          <path d="M12 13c0-4.5 3.5-7.5 8-8-0.5 4.5-3.5 8-8 8z" />
          <path d="M12 17c0-3.5-2.8-6-6.5-6.5.4 3.5 2.8 6.5 6.5 6.5z" />
        </svg>
      );

    case 'contemplative':
      // Open scripture / illuminated devotional book
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="13" y2="11" />
        </svg>
      );

    case 'seeking-rest':
      // Serene crescent moon with calm horizon line
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          <circle cx="17" cy="8" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'persevering':
      // Noble mountain peak with path to the summit
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 20h18L12 4 3 20z" />
          <path d="M9.5 13.5l2.5-2.5 2.5 2.5" />
          <line x1="12" y1="11" x2="12" y2="20" strokeDasharray="1 1" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={className}
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
};
