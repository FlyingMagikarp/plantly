import {Table} from "@radix-ui/themes";
import type {ICareLogDtoData} from "~/common/types/apiTypes";
import ConfirmDialog from "~/common/components/ConfirmDialog";
import {Trash} from "lucide-react";
import {useNavigate} from "react-router";


export default function CareLogTableRow({careLog}: { careLog: ICareLogDtoData }) {
  const navigate = useNavigate();

  const handleDelete = (careLogId: number) => {
    fetch(`/care/${careLog.plantId}/${careLogId}/delete`, {method: 'POST'});
  }

  const handleClick = () => {
    navigate(`/care/${careLog.plantId}/${careLog.id}`);
  }

  return (
      <Table.Row key={careLog.id} onClick={handleClick}>
        <Table.Cell>{careLog.eventDate}</Table.Cell>
        <Table.Cell>{careLog.eventType}</Table.Cell>
        <Table.Cell>{careLog.notes}</Table.Cell>
        <Table.Cell>
          <ConfirmDialog
              title={'Remove Species?'}
              description={'Are you sure?'}
              okLabel={'Delete'}
              cancelLabel={'Cancel'}
              action={() => {
                handleDelete(careLog.id);
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