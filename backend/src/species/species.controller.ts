import { Controller, Logger, Post, Res } from '@nestjs/common';
import { SpeciesDefinitionValidationError } from './species-definition-validation.error';
import { SpeciesService } from './species.service';

interface EmptyHttpResponse {
  status(code: number): { send(): void };
}

@Controller('admin/species')
export class SpeciesController {
  private readonly logger = new Logger(SpeciesController.name);

  constructor(private readonly speciesService: SpeciesService) {}

  @Post('sync')
  async synchronize(@Res() response: EmptyHttpResponse): Promise<void> {
    try {
      await this.speciesService.synchronize();
      response.status(204).send();
    } catch (error: unknown) {
      if (error instanceof SpeciesDefinitionValidationError) {
        this.logger.warn(`Species synchronization rejected: ${error.message}`);
        response.status(422).send();
        return;
      }

      const detail = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`Species synchronization failed: ${detail}`);
      response.status(500).send();
    }
  }
}
