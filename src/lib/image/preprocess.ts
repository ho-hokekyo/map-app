import sharp from "sharp";

export const convertImageToPng = async (file: File): Promise<File> => {
    try{
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let image = sharp(buffer).toFormat("png");
    
        // メタデータ取得
        const metadata = await image.metadata();
    
        // 幅が 1024px 超えたらリサイズする
        if (metadata.width && metadata.width > 1024) {
        image = image.resize({ width: 1024 });
        }
    
        // PNG 変換 & 圧縮
        let outputBuffer = await image.png({ quality: 80 }).toBuffer();
    
        // 4MB 超える場合、品質を下げて再圧縮
        let quality = 80;
        while (outputBuffer.length > 4 * 1024 * 1024 && quality > 50) {
        quality -= 10;
        outputBuffer = await sharp(outputBuffer).png({ quality }).toBuffer();
        }
    
        // `Buffer` を `File` に変換
        const newFile = new File([outputBuffer], file.name.replace(/\.[^/.]+$/, ".png"), {
        type: "image/png",
        });
    
        return newFile;

    }catch(error: unknown){
        if (error instanceof Error){
            console.error(error.message);
            throw new Error(error.message);
        }else{
            console.error('An unknown error occurred');
            throw new Error('An unknown error occurred');
        }
    }
  };