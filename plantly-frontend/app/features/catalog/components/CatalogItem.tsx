import type { ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { Link } from "react-router";


export default function CatalogItem({species}:{species: ISpeciesOverviewDtoData}){
  return (
    <Link className={'card w-full max-w-sm'} to={`/catalog/${species.speciesId}`}>
      <h2 className={'heading-lg'}>{species.latinName}</h2>
      <p className={'subheading italic'}>{species.commonName}</p>
    </Link>
  );
}