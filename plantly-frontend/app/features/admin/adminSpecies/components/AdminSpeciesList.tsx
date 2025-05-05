import type { ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import AdminSpeciesListItem from "~/features/admin/adminSpecies/components/AdminSpeciesListItem";
import { Table } from "@radix-ui/themes";

interface IAdminSpeciesListProps {
  species: ISpeciesOverviewDtoData[]
}

export default function AdminSpeciesList({species}: IAdminSpeciesListProps){

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Latin Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Common Name</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {species.map((species) => {
            return <AdminSpeciesListItem species={species} key={species.speciesId} />
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
}