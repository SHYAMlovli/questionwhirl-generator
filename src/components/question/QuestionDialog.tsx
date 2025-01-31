import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionForm } from "./QuestionForm";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestion: any;
  onSuccess: () => void;
}

export const QuestionDialog = ({ 
  open, 
  onOpenChange, 
  selectedQuestion, 
  onSuccess 
}: QuestionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>
        <QuestionForm
          initialData={selectedQuestion || undefined}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};