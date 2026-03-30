export default function Avatar({ name, size = 26 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Generate a consistent color based on the name
  const colors = [
    "#E8472A", "#2A7BE8", "#2AE8A0", "#E8A02A",
    "#8A2AE8", "#E82A72", "#2AE8E8", "#72E82A"
  ];
  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0;
  const bg = colors[colorIndex];

  return (
    <div style={{
      width:           size,
      height:          size,
      borderRadius:    "50%",
      background:      bg,
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      fontSize:        size * 0.42,
      fontWeight:      500,
      color:           "#fff",
      fontFamily:      "Tenor Sans, sans-serif",
      flexShrink:      0,
      border:          "1px solid rgba(255,255,255,0.15)",
      cursor:          "pointer",
      userSelect:      "none",
    }}>
      {initial}
    </div>
  );
}