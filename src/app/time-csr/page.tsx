// app/csr/page.tsx
"use client"; // クライアントコンポーネントとして明示

import { useEffect, useState } from "react";

export default function CSRPage() {
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    setTimes(Array.from({ length: 1000 }, (_, i) => new Date().toISOString()));
  }, []);

  return (
    <div>
        {times.map((time, i) => (
            <div key={i}>
            <h1>Server-Side Rendering (SSR)</h1>
            <p>Time: {time}</p>
            </div>
        ))}
      </div>
  );
}
