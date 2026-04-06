const StarField = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    dur: (Math.random() * 4 + 2).toFixed(1) + "s",
    delay: (Math.random() * 4).toFixed(1) + "s",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;