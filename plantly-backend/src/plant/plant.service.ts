import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { PlantImage } from './entities/plant-image.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { UpdatePlantImageDto } from './dto/update-plant-image.dto';
import { Species } from '../species/entities/species.entity';

import { PlantStatus } from './enums/plant-status.enum';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(PlantImage)
    private readonly plantImageRepository: Repository<PlantImage>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const species = await this.speciesRepository.findOneBy({
      id: createPlantDto.speciesId,
    });
    if (!species) {
      throw new NotFoundException(
        `Species with ID ${createPlantDto.speciesId} not found`,
      );
    }

    const plant = this.plantRepository.create({
      ...createPlantDto,
      acquiredAt: createPlantDto.acquiredAt
        ? new Date(createPlantDto.acquiredAt)
        : null,
    });

    return this.plantRepository.save(plant);
  }

  async findOne(id: string): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id },
      relations: ['species', 'images'],
    });

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }

    // Sort images: primary first, then by date (newest first)
    plant.images.sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return (
        new Date(b.imageDate || b.createdAt).getTime() -
        new Date(a.imageDate || a.createdAt).getTime()
      );
    });

    return plant;
  }

  async findAll(
    showInactive = false,
    search?: string,
    status?: PlantStatus,
    speciesId?: string,
  ): Promise<Plant[]> {
    const query = this.plantRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.species', 'species')
      .leftJoinAndSelect(
        'plant.images',
        'images',
        'images.isPrimary = :isPrimary',
        { isPrimary: true },
      );

    if (status) {
      query.andWhere('plant.status = :status', { status });
    } else if (!showInactive) {
      query.andWhere('plant.status = :status', { status: PlantStatus.ACTIVE });
    }

    if (speciesId) {
      query.andWhere('plant.speciesId = :speciesId', { speciesId });
    }

    if (search) {
      query.andWhere(
        '(LOWER(plant.nickname) LIKE LOWER(:search) OR LOWER(species.commonName) LIKE LOWER(:search) OR LOWER(species.scientificName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.orderBy('plant.nickname', 'ASC').getMany();
  }

  async update(id: string, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    const plant = await this.findOne(id);

    if (updatePlantDto.speciesId) {
      const species = await this.speciesRepository.findOneBy({
        id: updatePlantDto.speciesId,
      });
      if (!species) {
        throw new NotFoundException(
          `Species with ID ${updatePlantDto.speciesId} not found`,
        );
      }
    }

    const updatedPlant = this.plantRepository.merge(plant, {
      ...updatePlantDto,
      acquiredAt: updatePlantDto.acquiredAt
        ? new Date(updatePlantDto.acquiredAt)
        : plant.acquiredAt,
    });

    return this.plantRepository.save(updatedPlant);
  }

  async remove(id: string): Promise<void> {
    const plant = await this.findOne(id);
    plant.status = PlantStatus.REMOVED;
    await this.plantRepository.save(plant);
  }

  async uploadImages(id: string, files: Array<any>): Promise<PlantImage[]> {
    const plant = await this.findOne(id);
    const images = files.map((file) => {
      return this.plantImageRepository.create({
        plantId: plant.id,
        data: file.buffer as Buffer,
        mimeType: file.mimetype as string,
        originalFilename: file.originalname as string,
        isPrimary: false,
      });
    });

    // If plant has no primary image, set the first one uploaded as primary
    const existingPrimary = plant.images.find((img) => img.isPrimary);
    if (!existingPrimary && images.length > 0) {
      images[0].isPrimary = true;
    }

    return this.plantImageRepository.save(images);
  }

  async getImage(imageId: string): Promise<PlantImage> {
    const image = await this.plantImageRepository
      .createQueryBuilder('image')
      .addSelect('image.data')
      .where('image.id = :imageId', { imageId })
      .getOne();
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return image;
  }

  async updateImage(
    imageId: string,
    updateImageDto: UpdatePlantImageDto,
  ): Promise<PlantImage> {
    const image = await this.getImage(imageId);

    if (updateImageDto.isPrimary === true) {
      // Unset other primary images for this plant
      await this.plantImageRepository.update(
        { plantId: image.plantId, isPrimary: true },
        { isPrimary: false },
      );
    }

    const updatedImage = this.plantImageRepository.merge(image, {
      ...updateImageDto,
      imageDate: updateImageDto.imageDate
        ? new Date(updateImageDto.imageDate)
        : (image.imageDate as Date),
    });

    return this.plantImageRepository.save(updatedImage);
  }

  async removeImage(imageId: string): Promise<void> {
    const image = await this.getImage(imageId);
    await this.plantImageRepository.remove(image);
  }
}
