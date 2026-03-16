const bubbles = [
  { size: 320, top: "5%", left: "-5%", color: "hsla(27,90%,54%,0.07)" },
  { size: 200, top: "15%", right: "3%", color: "hsla(120,37%,74%,0.09)" },
  { size: 260, top: "35%", left: "10%", color: "hsla(120,37%,74%,0.07)" },
];

const FloatingBubbles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {bubbles.map((b, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: b.size,
          height: b.size,
          top: b.top,
          left: b.left,
          right: b.right,
          backgroundColor: b.color,
        }}
      />
    ))}
  </div>
);

export default FloatingBubbles;