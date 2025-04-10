export interface ImageProcessor {
    process: (buffer: Buffer) => Promise<Buffer>;
}

export interface ProcessorPipeline {
    processors: ImageProcessor[];
    addProcessor: (processor: ImageProcessor) => void;
    execute: (buffer: Buffer) => Promise<Buffer>;
}
