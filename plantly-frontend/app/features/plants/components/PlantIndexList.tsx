import type {IPlantDtoData} from "~/common/types/apiTypes";
import PlantItem from "~/features/plants/components/PlantItem";


export default function PlantIndexList({plants} : {plants: IPlantDtoData[]}){

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-5">
      {plants.map((plant) => {
        return (
          <PlantItem plant={plant} key={plant.id} />
        );
      })}
    </div>
  );
}