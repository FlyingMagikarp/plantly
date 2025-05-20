import type { ISpeciesOverviewDtoData } from "~/common/types/apiTypes";
import { Table } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import ConfirmDialog from "~/common/components/ConfirmDialog";
import { Trash } from "lucide-react";

interface IAdminSpeciesListItemProps {
  species: ISpeciesOverviewDtoData
}

export default function AdminSpeciesListItem({species}: IAdminSpeciesListItemProps){
  const navigate = useNavigate();

  const handleClick = (speciesId: number) => {
    navigate(`/admin/species/${speciesId}`);
  }

  const handleDelete = (speciesId: number) => {
    fetch(`/admin/species/${speciesId}/delete`, {method: 'POST'});
  }

  return (
    <Table.Row onClick={() => handleClick(species.speciesId)} key={species.speciesId} className={'hover:bg-[var(--color-muted)]'}>
      <Table.Cell>{species.speciesId}</Table.Cell>
      <Table.Cell>{species.latinName}</Table.Cell>
      <Table.Cell>{species.commonName}</Table.Cell>
      <Table.Cell>
        <ConfirmDialog
          title={'Remove Species?'}
          description={'Are you sure?'}
          okLabel={'Delete'}
          cancelLabel={'Cancel'}
          action={() => {
            handleDelete(species.speciesId);
          }}
        >
          <button onClick={(e) => e.stopPropagation()}>
            <Trash className={'text-[var(--color-fg-muted)] hover:text-red-600 transition-colors'}/>
          </button>
        </ConfirmDialog>
      </Table.Cell>
    </Table.Row>
  );
}