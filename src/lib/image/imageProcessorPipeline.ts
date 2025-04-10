import { ImageProcessor, ProcessorPipeline } from './interface';

export class ImageProcessorPipeline implements ProcessorPipeline {
    processors: ImageProcessor[] = [];

    addProcessor(processor: ImageProcessor) {
        this.processors.push(processor);
    }

    async execute(buffer: Buffer): Promise<Buffer> {
        for (const processor of this.processors) {
            buffer = await processor.process(buffer);
        }
        return buffer;
    }
}
