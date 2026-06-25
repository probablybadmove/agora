import Svg, { Polygon, Rect } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

/**
 * The Agora mark: a stylized classical temple front (pediment, columns, stylobate) —
 * the agora's stoa, rendered as a crisp glyph. Cross-platform via react-native-svg.
 */
export function AgoraMark({ size = 28, color }: { size?: number; color?: string }) {
  const theme = useTheme();
  const fill = color ?? theme.accent;
  const columns = [10.3, 18.3, 26.3, 34.3];

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Agora">
      {/* pediment / roof */}
      <Polygon points="24,4 44,16.5 4,16.5" fill={fill} />
      {/* architrave */}
      <Rect x={4} y={17.5} width={40} height={3.4} rx={1} fill={fill} />
      {/* columns */}
      {columns.map((x) => (
        <Rect key={x} x={x} y={22} width={3.4} height={14} rx={1.1} fill={fill} />
      ))}
      {/* stylobate / base */}
      <Rect x={3} y={37} width={42} height={3.6} rx={1.2} fill={fill} />
    </Svg>
  );
}
