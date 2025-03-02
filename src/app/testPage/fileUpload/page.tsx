"use client";
import { ChangeEvent, FunctionComponent, useState } from 'react';

const FileUploadPage = () =>{
    const [file, setFile] = useState<File | null>(null);    
    const [image, setImage] = useState<string | null>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0]
        if (!selectedFile) return
        setFile(selectedFile)
      }
    

    const handleSubmit = async (file:File) =>{
        
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        const {latitude, longitude} = {latitude: 0, longitude: 0};
        const res = await fetch(`/api/image/postImage2`, {
            method: "POST",
          
            body: formData
        });

        if (!res.ok) {
            console.log("upload failed in handleSubmit");
            return;
        }
        console.log("res", res);    
        const {url: imageUrl} = await res.json();
        setImage(imageUrl);

    }

    const handleGenerate = async (file:File) =>{
        

    }
    

    return (
        <>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={() => file && handleSubmit(file)}>Submit</button>
                <button onClick={() => file && handleGenerate(file)}>Generate</button>
                <div>
                    { image ? (
                        <div>
                    <img src={image} alt="uploaded image" />
                    <div>{image}</div>

                    </div>
                    ): <div>no image</div>}
                </div>
            </div>
        </>
    )
}
const Page = () => {

    
    return (
        <>
            <div>
                <FileUploadPage/>
            </div>
        </>
    );
};

export default Page;