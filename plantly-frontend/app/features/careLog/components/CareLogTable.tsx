import {Table} from "@radix-ui/themes";
import type {ICareLogDtoData} from "~/common/types/apiTypes";
import CareLogTableRow from "~/features/careLog/components/CareLogTableRow";


export default function CareLogTable({careLogs}: {careLogs: ICareLogDtoData[]}) {
  if (careLogs.length === 0){
    return (
        <span className={'caption-large'}>No Care Logs yet.</span>
    );
  }

  return (
      <>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>&nbsp;</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {careLogs.map((careLog) => {
              return <CareLogTableRow careLog={careLog} key={careLog.id} />
            })}
          </Table.Body>
        </Table.Root>
      </>
  );
}