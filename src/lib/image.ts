import {v4 as uuidv4} from 'uuid'

export const uploadImg = async (file:File) => {
  const fileName = uuidv4()
  console.log("fileName by uuid", fileName)
  const res = await fetch(`/api/uploadImage`, {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({fileName})
  }) //　
  
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

// なぜ二回fetchしているのか? answer: 一回目のfetchでサーバーから署名付きURLを取得し、二回目のfetchでそのURLに対して画像をアップロードしている

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