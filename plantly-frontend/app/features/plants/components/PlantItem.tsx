import type {IPlantDtoData} from "~/common/types/apiTypes";
import { Link } from "react-router";


export default function PlantItem({plant}:{plant: IPlantDtoData}){
  return (
      <Link className={'card w-full max-w-sm'} to={`/plants/${plant.id}`}>
        <h2 className={'heading-lg'}>{plant.nickname}</h2>
        <p className={'subheading italic'}>{plant.speciesLatinName}</p>
        <p className={'caption'}>{plant.locationName}</p>
      </Link>
  );
}