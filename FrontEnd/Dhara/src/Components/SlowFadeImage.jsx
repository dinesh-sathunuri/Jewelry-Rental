import { useState } from "react";

export default function SlowFadeImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 2s ease-in-out",
        width: "100%",   // or your desired styling
        height: "auto",
        display: "block",
      }}
    />
  );
}
