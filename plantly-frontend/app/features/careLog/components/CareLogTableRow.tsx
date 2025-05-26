import {Table} from "@radix-ui/themes";
import type {ICareLogDtoData} from "~/common/types/apiTypes";


export default function CareLogTableRow({careLog}: {careLog: ICareLogDtoData}) {

  const handleClick = (logId: number) => {

  }

  return (
      <Table.Row onClick={() => handleClick(careLog.id)} key={careLog.id} className={'hover:bg-[var(--color-muted)]'}>
        <Table.Cell>{careLog.eventDate}</Table.Cell>
        <Table.Cell>{careLog.eventType}</Table.Cell>
        <Table.Cell>{careLog.notes}</Table.Cell>
      </Table.Row>
  );
}