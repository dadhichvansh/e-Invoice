import { Path, Svg } from '@react-pdf/renderer';

type PdfIconName = 'location' | 'mail' | 'phone' | 'website';

export function PdfIcon({ name }: { name: PdfIconName }) {
  const paths = {
    location: (
      <Path
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="#52525B"
        strokeWidth={2}
        fill="none"
      />
    ),
    mail: (
      <Path
        d="M4 6h16v12H4z M4 7l8 6 8-6"
        stroke="#52525B"
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
      />
    ),
    phone: (
      <Path
        d="M6.5 3.5 9 3l2 5-2 1.5a14 14 0 0 0 5 5L15.5 13l5 2-.5 2.5a2 2 0 0 1-2 1.5C10.3 18.5 5.5 13.7 5 6a2 2 0 0 1 1.5-2.5Z"
        stroke="#52525B"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    website: (
      <Path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18 M12 3c2.2 2.4 3.5 5.4 3.5 9S14.2 18.6 12 21c-2.2-2.4-3.5-5.4-3.5-9S9.8 5.4 12 3Z"
        stroke="#52525B"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      {paths[name]}
    </Svg>
  );
}
