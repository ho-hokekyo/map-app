import { ImageOutput } from "@/schema/outputTypeSchema/ImageOutputSchema";

const Page = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getImages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num: 30,
        }),
        next: { revalidate: 60 }, 
      })
    const images = await res.json()
    return (
        <div>
            {images.map((image: ImageOutput) => (
                <div key={image.id}
                >{image.id}</div>
            ))}
        </div>
    )
}

export default Page;