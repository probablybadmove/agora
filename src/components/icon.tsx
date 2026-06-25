import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export type IconName =
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'copy'
  | 'check'
  | 'chevron-right'
  | 'github'
  | 'terminal';

/**
 * A small, consistent line-icon set (1.6px stroke, currentColor) used everywhere instead of
 * emoji. Keeping one family — rather than a grab-bag of emoji — is most of what makes the UI
 * read as designed-on-purpose.
 */
export function Icon({
  name,
  size = 18,
  color,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const theme = useTheme();
  const c = color ?? theme.text;
  const stroke = {
    stroke: c,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'search' && (
        <>
          <Circle cx={10.5} cy={10.5} r={6.5} {...stroke} />
          <Line x1={15.5} y1={15.5} x2={20} y2={20} {...stroke} />
        </>
      )}
      {name === 'arrow-right' && (
        <>
          <Line x1={4} y1={12} x2={19} y2={12} {...stroke} />
          <Polyline points="13 6 19 12 13 18" {...stroke} />
        </>
      )}
      {name === 'arrow-left' && (
        <>
          <Line x1={20} y1={12} x2={5} y2={12} {...stroke} />
          <Polyline points="11 6 5 12 11 18" {...stroke} />
        </>
      )}
      {name === 'arrow-up-right' && (
        <>
          <Line x1={7} y1={17} x2={17} y2={7} {...stroke} />
          <Polyline points="8 7 17 7 17 16" {...stroke} />
        </>
      )}
      {name === 'copy' && (
        <>
          <Rect x={9} y={9} width={11} height={11} rx={2} {...stroke} />
          <Path d="M5 15V6a2 2 0 0 1 2-2h9" {...stroke} />
        </>
      )}
      {name === 'check' && <Polyline points="5 12.5 10 17.5 19 7" {...stroke} />}
      {name === 'chevron-right' && <Polyline points="9 5 16 12 9 19" {...stroke} />}
      {name === 'terminal' && (
        <>
          <Polyline points="5 8 9 12 5 16" {...stroke} />
          <Line x1={12} y1={16} x2={19} y2={16} {...stroke} />
        </>
      )}
      {name === 'github' && (
        <Path
          fill={c}
          d="M12 1.5A10.5 10.5 0 0 0 8.68 22a.79.79 0 0 0 1-.55c0-.27-.01-1-.02-1.96-2.92.63-3.54-1.41-3.54-1.41-.48-1.21-1.17-1.53-1.17-1.53-.95-.65.07-.64.07-.64 1.05.07 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.07a10 10 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96 0 1.42-.01 2.56-.01 2.91 0 .28.19.61 1.01.51A10.5 10.5 0 0 0 12 1.5Z"
        />
      )}
    </Svg>
  );
}
