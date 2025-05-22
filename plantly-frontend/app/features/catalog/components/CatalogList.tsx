import type { ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import CatalogItem from "~/features/catalog/components/CatalogItem";

export default function CatalogList({species} : {species: ISpeciesOverviewDtoData[]}){

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-5">
      {species.map((s) => {
        return (
          <CatalogItem species={s} key={s.speciesId} />
        );
      })}
    </div>
  );
}