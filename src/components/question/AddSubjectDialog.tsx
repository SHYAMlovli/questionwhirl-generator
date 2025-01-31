import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddSubjectDialog = ({ open, onOpenChange, onSuccess }: AddSubjectDialogProps) => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (!profiles || profiles.length === 0) {
        toast.error("No default profile found");
        return;
      }

      const defaultUserId = profiles[0].id;

      // Create a placeholder question to establish the subject
      const { error } = await supabase
        .from('questions')
        .insert({
          content: `${subjectName} - Initial Question`,
          marks: 2,
          k_level: 'K1',
          part: 'A',
          co_level: 'CO1',
          subject_code: subjectCode,
          subject_name: subjectName,
          user_id: defaultUserId,
        });

      if (error) throw error;

      toast.success("Subject added successfully");
      onSuccess();
      onOpenChange(false);
      setSubjectCode("");
      setSubjectName("");
    } catch (error) {
      toast.error("Failed to add subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject Code</label>
            <Input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Enter subject code"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject Name</label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Subject"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};