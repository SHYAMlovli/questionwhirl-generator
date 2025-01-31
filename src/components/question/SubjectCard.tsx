import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SubjectCardProps {
  subjectCode: string;
  subjectName: string;
  questionCount: number;
  onClick: () => void;
}

export const SubjectCard = ({ subjectCode, subjectName, questionCount, onClick }: SubjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState(subjectCode);
  const [newName, setNewName] = useState(subjectName);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditing) {
      try {
        const { error } = await supabase
          .from('questions')
          .update({
            subject_code: newCode,
            subject_name: newName
          })
          .match({ subject_code: subjectCode, subject_name: subjectName });

        if (error) throw error;
        
        toast.success("Subject updated successfully");
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to update subject");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success("Question bank refreshed");
    } catch (error) {
      toast.error("Failed to refresh question bank");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onClick();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          {isEditing ? (
            <Input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-32"
            />
          ) : (
            <span>{subjectCode}</span>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="mb-2"
          />
        ) : (
          <p className="text-gray-600 mb-2">{subjectName}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{questionCount} questions</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};