
const Page = () => {
   
        return (
          <div>
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="box">
                Box {i}
              </div>
            ))}
          </div>
        );
   
}

export default Page;