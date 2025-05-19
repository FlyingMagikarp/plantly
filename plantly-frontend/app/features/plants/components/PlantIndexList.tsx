import type {IPlantDtoData} from "~/common/types/apiTypes";
import PlantItem from "~/features/plants/components/PlantItem";


export default function PlantIndexList({plants} : {plants: IPlantDtoData[]}){

  return (
      <>
        {plants.map((plant) => {
          return (
            <PlantItem plant={plant} />
          );
        })}
      </>
  );
}