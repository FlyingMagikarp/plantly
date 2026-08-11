import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { DataSource, In } from 'typeorm';
import { SpeciesDefinitionValidationError } from './species-definition-validation.error';
import { parseSpeciesDefinition } from './species-definition.parser';
import { Species } from './species.entity';
import type { SpeciesDefinition } from './species.types';

export interface SpeciesOverviewItem {
  id: number;
  name: string;
  archived: boolean;
  plantCount: number;
}

export interface SpeciesPlantSummary {
  id: number;
  nickname: string;
}

export interface SpeciesDetail {
  id: number;
  name: string;
  archived: boolean;
  moisture: Species['moisture'];
  light: Species['light'];
  preferredTemperatureMin: number;
  preferredTemperatureMax: number;
  minimumTemperature: number;
  growthPeriod: string;
  bloomPeriod: string;
  dormancyPeriod: string;
  growthFertilizer: Species['growthFertilizer'];
  bloomFertilizer: Species['bloomFertilizer'];
  dormancyFertilizer: Species['dormancyFertilizer'];
  notes: string[];
  plants: SpeciesPlantSummary[];
}

const SUPPORTING_FILES = new Set(['README.md', 'TEMPLATE.md']);
const SPECIES_FILENAME_PATTERN = /^SP-\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export class SpeciesDefinitionsDirectory {
  constructor(readonly path: string) {}
}

@Injectable()
export class SpeciesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly definitionsDirectory: SpeciesDefinitionsDirectory,
  ) {}

  async list(): Promise<SpeciesOverviewItem[]> {
    const species = await this.dataSource.getRepository(Species).find({
      order: { id: 'ASC' },
    });

    return species.map(({ id, name, archived }) => ({
      id,
      name,
      archived,
      plantCount: 0,
    }));
  }

  async find(id: number): Promise<SpeciesDetail | null> {
    const species = await this.dataSource.getRepository(Species).findOneBy({ id });
    if (!species) {
      return null;
    }

    return {
      id: species.id,
      name: species.name,
      archived: species.archived,
      moisture: species.moisture,
      light: species.light,
      preferredTemperatureMin: species.preferredTemperatureMin,
      preferredTemperatureMax: species.preferredTemperatureMax,
      minimumTemperature: species.minimumTemperature,
      growthPeriod: species.growthPeriod,
      bloomPeriod: species.bloomPeriod,
      dormancyPeriod: species.dormancyPeriod,
      growthFertilizer: species.growthFertilizer,
      bloomFertilizer: species.bloomFertilizer,
      dormancyFertilizer: species.dormancyFertilizer,
      notes: species.notes,
      plants: [],
    };
  }

  async synchronize(): Promise<void> {
    const definitions = await this.readDefinitions();

    await this.dataSource.transaction('SERIALIZABLE', async (manager) => {
      const repository = manager.getRepository(Species);
      const existing = await repository.find();
      this.validatePermanentIdentity(definitions, existing);

      const definitionsById = new Map(
        definitions.map((definition) => [definition.id, definition]),
      );
      const existingById = new Map(existing.map((species) => [species.id, species]));

      for (const definition of definitions) {
        const species = existingById.get(definition.id);
        if (!species) {
          await repository.insert({ ...definition, archived: false });
          continue;
        }
        if (species.sourceHash !== definition.sourceHash || species.archived) {
          await repository.update(definition.id, {
            ...definition,
            archived: false,
          });
        }
      }

      const removedIds = existing
        .filter((species) => !definitionsById.has(species.id) && !species.archived)
        .map((species) => species.id);
      if (removedIds.length > 0) {
        await repository.update({ id: In(removedIds) }, { archived: true });
      }
    });
  }

  private async readDefinitions(): Promise<SpeciesDefinition[]> {
    const entries = await fs.readdir(this.definitionsDirectory.path, {
      withFileTypes: true,
    });
    const markdownFiles = entries
      .filter(
        (entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'),
      )
      .map((entry) => entry.name)
      .filter((name) => !SUPPORTING_FILES.has(name))
      .sort();

    for (const filename of markdownFiles) {
      if (!SPECIES_FILENAME_PATTERN.test(filename)) {
        throw new SpeciesDefinitionValidationError(
          `${filename}: filename does not follow SP-000-name.md`,
        );
      }
    }

    const definitions = await Promise.all(
      markdownFiles.map(async (filename) =>
        parseSpeciesDefinition(
          filename,
          await fs.readFile(join(this.definitionsDirectory.path, filename), 'utf8'),
        ),
      ),
    );
    this.validateDefinitionUniqueness(definitions);
    return definitions;
  }

  private validateDefinitionUniqueness(definitions: SpeciesDefinition[]): void {
    const ids = new Set<number>();
    const slugs = new Set<string>();
    for (const definition of definitions) {
      if (ids.has(definition.id)) {
        throw new SpeciesDefinitionValidationError(
          `Duplicate species identifier ${definition.id.toString().padStart(3, '0')}`,
        );
      }
      if (slugs.has(definition.definitionSlug)) {
        throw new SpeciesDefinitionValidationError(
          `Multiple definitions use species name ${definition.definitionSlug}`,
        );
      }
      ids.add(definition.id);
      slugs.add(definition.definitionSlug);
    }
  }

  private validatePermanentIdentity(
    definitions: SpeciesDefinition[],
    existing: Species[],
  ): void {
    const existingById = new Map(existing.map((species) => [species.id, species]));
    const existingBySlug = new Map(
      existing.map((species) => [species.definitionSlug, species]),
    );

    for (const definition of definitions) {
      const sameId = existingById.get(definition.id);
      if (sameId && sameId.definitionSlug !== definition.definitionSlug) {
        throw new SpeciesDefinitionValidationError(
          `Species identifier ${definition.id.toString().padStart(3, '0')} belongs to ${sameId.definitionSlug}`,
        );
      }
      const sameSlug = existingBySlug.get(definition.definitionSlug);
      if (sameSlug && sameSlug.id !== definition.id) {
        throw new SpeciesDefinitionValidationError(
          `Species ${definition.definitionSlug} belongs to identifier ${sameSlug.id.toString().padStart(3, '0')}`,
        );
      }
    }
  }
}
