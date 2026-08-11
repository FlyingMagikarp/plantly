export class SpeciesDefinitionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SpeciesDefinitionValidationError.name;
  }
}
