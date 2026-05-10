const COLORS = {
  bicycle: '#00FFFF',      // cyan
  bus: '#0066FF',          // blue
  car: '#00FF00',          // green
  jeepney: '#FF00FF',      // magenta
  motorcycle: '#FFFF00',   // yellow
  tricycle: '#FF6600',     // orange
  truck: '#FF0000',        // red
  van: '#FF69B4',          // pink
};

export default function BoundingBox({ box, scaleX, scaleY }) {
  const [x1, y1, x2, y2] = box.bbox;
  const color = COLORS[box.class?.toLowerCase()] || '#FFFFFF';

  return (
    <div style={{
      position: 'absolute',
      left: x1 * scaleX,
      top: y1 * scaleY,
      width: (x2 - x1) * scaleX,
      height: (y2 - y1) * scaleY,
      border: `2px solid ${color}`,
      pointerEvents: 'none',
    }}>
      <span style={{
        background: color,
        color: '#000',
        fontSize: 11,
        fontWeight: 'bold',
        padding: '0 4px',
        whiteSpace: 'nowrap',
      }}>
        {box.class} {(box.confidence * 100).toFixed(0)}%
      </span>
    </div>
  );
}