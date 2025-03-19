// app/ssr/page.tsx
export default async function SSRPage() {
    const times = Array.from({ length: 1000 }, (_, i) => new Date().toISOString());
  
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
  