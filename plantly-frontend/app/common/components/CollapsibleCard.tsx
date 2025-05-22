import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

interface CollapsibleCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  header,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className={`card ${className}`}>
        <Collapsible.Trigger asChild>
          <button
            className="w-full text-left font-semibold flex justify-between items-center hover:opacity-80 transition"
            aria-expanded={open}
          >
            <span>{header}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-90" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content className="mt-4">
          {children}
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
};
