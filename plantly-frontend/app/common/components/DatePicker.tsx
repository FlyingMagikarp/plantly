import * as Popover from "@radix-ui/react-popover";
import { DayPicker} from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { formatDateToISO, parseDateFromISO } from "~/common/utils/dateUtil";

export function DatePicker({initDate, onChange}: { initDate: string, onChange: (date: string) => void}) {
  const [date, setDate] = useState<Date>(parseDateFromISO(initDate));
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Date) => {
    setDate(date);
    onChange(formatDateToISO(date));
    setOpen(false);
  }

  return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
              className={'flex items-center gap-2 px-4 py-2 rounded border border-[var(--color-accent)] bg-[var(--color-base)] text-[var(--color-fg)] hover:bg-[var(--color-accent-secondary)] transition'}
          >
            📅 {date ? format(date, "PPP") : "Pick a date"}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
              className={'bg-[var(--color-base)] text-[var(--color-fg)] dark:bg-[var(--color-bg)] dark:text-[var(--color-fg)] border border-[var(--color-accent-dark)] rounded p-2 shadow-xl z-50'}
              sideOffset={5}
          >
          <DayPicker
                mode="single"
                required={true}
                selected={date}
                onSelect={handleDateChange}

                styles={{
                  head_cell: { color: "var(--color-accent-dark)" },
                  day_selected: {
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  },
                  day_today: {
                    color: "var(--color-accent)",
                  },
                }}
                className={'bg-[var(--color-base)] dark:bg-[var(--color-bg)] text-[var(--color-fg)] dark:text-[var(--color-fg)] rounded'}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
  );
}
