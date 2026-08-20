import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Plant } from '../plants/plant.entity';
import { ImageStorageService } from './image-storage.service';
import { PlantImage } from './plant-image.entity';

export interface UploadedImage { buffer: Buffer; mimetype: string; size: number }
export interface PlantImageView { id: number; plantId: number; mediaType: string; byteSize: number; addedAt: string; contentUrl: string }

@Injectable()
export class ImagesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, private readonly storage: ImageStorageService) {}

  async list(plantId: number): Promise<PlantImageView[]> {
    await this.requirePlant(plantId);
    const images = await this.dataSource.getRepository(PlantImage).find({ where: { plantId }, order: { addedAt: 'DESC', id: 'DESC' } });
    return images.map(toView);
  }

  async add(plantId: number, file: UploadedImage | undefined): Promise<PlantImageView> {
    const type = imageType(file);
    const plant = await this.requirePlant(plantId);
    if (plant.status !== 'active') throw new ConflictException('Images can only be added to active plants');
    const key = await this.storage.write(file!.buffer, type === 'image/jpeg' ? 'jpg' : 'png');
    try {
      const repository = this.dataSource.getRepository(PlantImage);
      return toView(await repository.save(repository.create({ plantId, storageKey: key, mediaType: type, byteSize: file!.size })));
    } catch (error) {
      await this.storage.remove(key);
      throw error;
    }
  }

  async content(plantId: number, imageId: number): Promise<{ buffer: Buffer; mediaType: string }> {
    const image = await this.findImage(plantId, imageId);
    try {
      return { buffer: await this.storage.read(image.storageKey), mediaType: image.mediaType };
    } catch {
      throw new NotFoundException('Image content unavailable');
    }
  }

  async remove(plantId: number, imageId: number): Promise<{ removedImageId: number }> {
    const plant = await this.requirePlant(plantId);
    if (plant.status !== 'active') throw new ConflictException('Images can only be removed from active plants');
    const image = await this.findImage(plantId, imageId);
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.getRepository(PlantImage).delete({ id: imageId, plantId });
      if (result.affected !== 1) throw new NotFoundException('Image not found');
    });
    await this.removeStoredFiles([image.storageKey]);
    return { removedImageId: imageId };
  }

  async storageKeys(plantId: number): Promise<string[]> {
    const images = await this.dataSource.getRepository(PlantImage).findBy({ plantId });
    return images.map((image) => image.storageKey);
  }

  async removeStoredFiles(keys: string[]): Promise<void> {
    await Promise.allSettled(keys.map((key) => this.storage.remove(key)));
  }

  private async requirePlant(plantId: number): Promise<Plant> {
    const plant = await this.dataSource.getRepository(Plant).findOneBy({ id: plantId });
    if (!plant) throw new NotFoundException('Plant not found');
    return plant;
  }

  private async findImage(plantId: number, imageId: number): Promise<PlantImage> {
    const image = await this.dataSource.getRepository(PlantImage).findOneBy({ id: imageId, plantId });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }
}

function imageType(file: UploadedImage | undefined): 'image/jpeg' | 'image/png' {
  if (!file || file.size === 0 || file.size > 10 * 1024 * 1024) throw new BadRequestException('Select a JPEG or PNG image no larger than 10 MB');
  const jpeg = file.mimetype === 'image/jpeg' && file.buffer[0] === 0xff && file.buffer[1] === 0xd8 && file.buffer[2] === 0xff;
  const png = file.mimetype === 'image/png' && file.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!jpeg && !png) throw new BadRequestException('Select a JPEG or PNG image no larger than 10 MB');
  return jpeg ? 'image/jpeg' : 'image/png';
}

function toView(image: PlantImage): PlantImageView {
  return { id: image.id, plantId: image.plantId, mediaType: image.mediaType, byteSize: image.byteSize, addedAt: image.addedAt.toISOString(), contentUrl: `/api/plants/${image.plantId}/images/${image.id}/content` };
}
