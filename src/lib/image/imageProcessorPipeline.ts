import { ImageProcessor, ProcessorPipeline } from './interface';

export class ImageProcessorPipeline implements ProcessorPipeline {
    processors: ImageProcessor[] = [];

    addProcessor(processor: ImageProcessor) {
        this.processors.push(processor);
    }

    async execute(buffer: Buffer): Promise<Buffer> {
        let output = Buffer.from(buffer) as Buffer;
        for (const processor of this.processors) {
            output = await processor.process(buffer);
        }
        return output;
    }
}
