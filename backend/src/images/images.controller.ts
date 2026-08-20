import { Controller, Delete, Get, Param, ParseIntPipe, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService, type PlantImageView, type UploadedImage } from './images.service';

@Controller('plants/:plantId/images')
export class ImagesController {
  constructor(private readonly images: ImagesService) {}

  @Get()
  list(@Param('plantId', ParseIntPipe) plantId: number): Promise<PlantImageView[]> { return this.images.list(plantId); }

  @Post()
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 10 * 1024 * 1024 } }))
  add(@Param('plantId', ParseIntPipe) plantId: number, @UploadedFile() file: UploadedImage | undefined): Promise<PlantImageView> { return this.images.add(plantId, file); }

  @Get(':imageId/content')
  async content(@Param('plantId', ParseIntPipe) plantId: number, @Param('imageId', ParseIntPipe) imageId: number): Promise<StreamableFile> {
    const content = await this.images.content(plantId, imageId);
    return new StreamableFile(content.buffer, { type: content.mediaType });
  }

  @Delete(':imageId')
  remove(@Param('plantId', ParseIntPipe) plantId: number, @Param('imageId', ParseIntPipe) imageId: number): Promise<{ removedImageId: number }> { return this.images.remove(plantId, imageId); }
}
