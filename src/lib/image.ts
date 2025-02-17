import {v4 as uuidv4} from 'uuid'

export const uploadImg = async (file:File) => {
  // generate unique file name
  const fileName = uuidv4()

  // get signed URL for upload to GCS
  const res = await fetch(`/api/uploadImage`, {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({fileName})
  }) 
  
  const { url, fields } = await res.json();
  const body = new FormData();
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    body.append(key, value as string | Blob );
  });
  
  const upload = await fetch(url, {method:"POST", body})

  if (!upload.ok) {
    console.log('upload failed')
    return ''
  }
  return fileName
}


export const uploadImg2 = async (file: File) => {
  const fileName = uuidv4();
  const SignedUrlForUpload = await fetch(`/api/image/postGCS`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({fileName: "original/" + fileName})
  });

  const {url, fields} = await SignedUrlForUpload.json();

  const body = new FormData();
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    body.append(key, value as string | Blob );
  });
  const isUpload = await fetch(url, {method: "POST", body:body});

  console.log("isUpload", isUpload);

  // generate image
  const generatedUrl = "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const generatedImageResponse = await fetch(generatedUrl, {method: "GET"});
  // make File object from response
  const generatedImageBlob = await generatedImageResponse.blob();

  const generatedImage = new File([generatedImageBlob], "generatedImage.png", {type: "image/png"});
  console.log("generatedImage", generatedImage);

  const SignedUrlForUploadGeneatedImage = await fetch(`/api/image/postGCS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({fileName: "generated/" + fileName})
  });

  const {urlForGeneratedImage, fieldForGeneratedImage } = await SignedUrlForUploadGeneatedImage.json();

  const bodyForGeneratedImage = new FormData();
  Object.entries({ ...fieldForGeneratedImage, generatedImage }).forEach(([key, value]) => {
    bodyForGeneratedImage.append(key, value as string | Blob );
  });
  const isUploadGeneratedImage = await fetch(urlForGeneratedImage, {method: "POST", body: bodyForGeneratedImage});

  console.log("isUploadGeneratedImage", isUploadGeneratedImage);

  return fileName;

  

}
// 一回目のfetchでサーバーから署名付きURLを取得し、二回目のfetchでそのURLに対して画像をアップロードしている

export async function fetchSignedUrlGCS(fileName: string) {
  

  const apiUrl = `/api/getImage?fileName=${encodeURIComponent(fileName)}`;
  console.log("apiUrl", apiUrl)
  try{
    const response = await fetch(apiUrl,
      {
        method: 'POST',
        headers: {
        'Catch-Control': 'max-age=3600', //GCSへのリクエスト回数はなるべく減らしたい
        },
    }
    );
    if (!response.ok){
      console.error('Failed to fetch signed URL');
      return null;
    }
    const data = await response.json();
    return data.url;
  }catch(error: unknown){
    if (error instanceof Error){
      console.error(error.message);
      return "";
    }else{
      console.error('An unknown error occurred');
      return "";
    }
  }
}

