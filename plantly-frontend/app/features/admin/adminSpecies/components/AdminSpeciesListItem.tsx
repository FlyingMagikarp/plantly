import type { ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { Table } from "@radix-ui/themes";
import { useNavigate } from "react-router";

interface IAdminSpeciesListItemProps {
  species: ISpeciesOverviewDtoData
}

export default function AdminSpeciesListItem({species}: IAdminSpeciesListItemProps){
  const navigate = useNavigate();

  const handleClick = (speciesId: number) => {
    navigate(`/admin/species/${speciesId}`);
  }

  return (
    <Table.Row onClick={() => handleClick(species.speciesId)} key={species.speciesId}>
      <Table.Cell>{species.speciesId}</Table.Cell>
      <Table.Cell>{species.latinName}</Table.Cell>
      <Table.Cell>{species.commonName}</Table.Cell>
    </Table.Row>
  );
}