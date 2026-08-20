import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ImageStorageService {
  private readonly directory: string;

  constructor(config: ConfigService) {
    this.directory = config.get('IMAGE_STORAGE_PATH', join(process.cwd(), 'storage', 'images'));
  }

  async write(buffer: Buffer, extension: 'jpg' | 'png'): Promise<string> {
    await mkdir(this.directory, { recursive: true });
    const key = `${randomUUID()}.${extension}`;
    const temporaryKey = `${key}.uploading`;
    await writeFile(this.path(temporaryKey), buffer, { flag: 'wx' });
    try {
      await rename(this.path(temporaryKey), this.path(key));
      return key;
    } catch (error) {
      await rm(this.path(temporaryKey), { force: true });
      throw error;
    }
  }

  read(key: string): Promise<Buffer> {
    return readFile(this.path(key));
  }

  remove(key: string): Promise<void> {
    return rm(this.path(key), { force: true });
  }

  private path(key: string): string {
    return join(this.directory, key);
  }
}
