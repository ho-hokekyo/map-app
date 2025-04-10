import { ImageProcessor } from '@/lib/image/interface';
// img2img by stability ai

export class img2imgProcessor implements ImageProcessor {
    // private config;
    private apikey: string;
    private prompt: string;

    constructor(prompt: string) {
        this.apikey = process.env.NEXT_STABILITY_API_KEY as string;
        if (!this.apikey) {
            throw new Error('API key is missing');
        }
        this.prompt = prompt;
        // this.config = config;
    }

    async process(buffer: Buffer): Promise<Buffer> {
        const formData = new FormData();
        formData.append('image', new Blob([buffer]));
        formData.append('prompt', this.prompt);
        formData.append('output_format', 'webp');

        // Stability AI の API にリクエストする
        const response = await fetch('https://api.stability.ai/v2beta/stable-image/control/style', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apikey}`,
                Accept: 'image/*',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.status}: ${errorText}`);
        }
        const blob = await response.blob();
        const newBuffer = Buffer.from(await blob.arrayBuffer());

        return newBuffer;
    }
}
