import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@radix-ui/react-alert-dialog";

interface IConfirmDialogProps {
  children: React.ReactElement;
  title: string;
  description: string;
  action: () => void;
  okLabel: string;
  cancelLabel: string;
}

export default function ConfirmDialog({children, title, description, action, okLabel, cancelLabel}: IConfirmDialogProps) {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className={'fixed inset-0 z-0 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'}/>
      <AlertDialogContent className={'fixed bg-[var(--color-bg)] left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg'}>
        <div className={'flex flex-col space-y-2 text-center'}>
          <AlertDialogTitle className={'heading-lg'}>
            {title}
          </AlertDialogTitle>
          <AlertDialogContent className={'body-text'}>
            {description}
          </AlertDialogContent>
        </div>
        <div className={'flex justify-end gap-1'}>
          <AlertDialogCancel className={'btn-secondary'}>
            {cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            className={'btn-primary'}
            onClick={(e) => {
              e.stopPropagation();
              action();
            }}
          >
            {okLabel ?? 'Ok'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}