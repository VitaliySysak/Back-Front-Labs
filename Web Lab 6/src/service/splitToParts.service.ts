import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import * as path from 'path';
import { createWorker, PSM } from 'tesseract.js';

@Injectable()
export class SplitToPartService {
  constructor() {}

  async split(imagePath: string) {
    const fullPath = imagePath;
    const bounds = await this.getBoundingBox(fullPath);

    return bounds;
  }

  private async getBoundingBox(imagePath: string) {
    const worker = await createWorker();

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT_OSD,
    });

    const image = await Jimp.read(imagePath);
    const imageBuffer = await image
      .color([{ apply: 'desaturate' as any, params: [90] }])
      .contrast(0.1)
      .invert()
      .write('processed.jpg')
      .getBufferAsync(Jimp.MIME_PNG);

    const { data } = await worker.recognize(imageBuffer);
    const bounds = data.lines
      .flatMap((el) => el.words.map((word) => word.bbox))
      .map((bbox) => ({
        x: bbox.x0,
        y: bbox.y0,
        width: bbox.x1 - bbox.x0,
        height: bbox.y1 - bbox.y0,
      }));

    await worker.terminate();

    return bounds;
  }
}
