"use client";

const Page = () => {
    return (
      <div>
        {Array.from({ length: 1000 }, (_, i) => (
          <div key={i} className="box">
            Box {i}
          </div>
        ))}
      </div>
    );
  };

export default Page;