// server component

// 画像のフェッチと表示
import  {LikeIcon} from "@/components/Icon/LikeIcon";
import { ImageOutput } from "@/schema/outputTypeSchema/ImageOutputSchema";
import Image from "next/image";

const Page = async () => {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getImages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num: 30,
        }),
      })
    const images = await res.json()


   
        return (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {images.map((image: ImageOutput) => (
                  <div
                    key={image.id}
                    className="relative cursor-pointer"
                    // onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.generatedUrl}
                      alt="Gallery"
                      className="w-full h-auto aspect-square object-cover rounded-md"
                      width={300}
                      height={300}
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center text-white text-lg font-semibold">
                        <LikeIcon className="w-6 h-6 mr-2" />
                        {image.favorite}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        
              
            </div>
    )
}


export default Page;