const transparentStyle = {
  pointerEvents: 'none',
};

export default function TransparentOverlay({ children }) {
  return (
    <div className="transparent-overlay" style={transparentStyle}>
      {children}
    </div>
  );
}
