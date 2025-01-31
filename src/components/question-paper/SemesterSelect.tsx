import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface SemesterSelectProps {
  selectedSemesters: string[];
  onSemesterChange: (semesters: string[]) => void;
}

export const SemesterSelect = ({ selectedSemesters, onSemesterChange }: SemesterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSemester, setNewSemester] = useState("");
  const [semesters, setSemesters] = useState(["1", "2", "3", "4", "5", "6", "7", "8"]);

  const handleSemesterToggle = (semester: string) => {
    const newSemesters = selectedSemesters.includes(semester)
      ? selectedSemesters.filter(s => s !== semester)
      : [...selectedSemesters, semester];
    onSemesterChange(newSemesters);
  };

  const handleAddSemester = () => {
    if (newSemester && !semesters.includes(newSemester)) {
      setSemesters([...semesters, newSemester]);
      onSemesterChange([...selectedSemesters, newSemester]);
      setNewSemester("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedSemesters.length 
            ? `${selectedSemesters.length} semester(s) selected`
            : "Select semester"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newSemester}
              onChange={(e) => setNewSemester(e.target.value)}
              placeholder="Add new semester"
            />
            <Button onClick={handleAddSemester}>Add</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {semesters.map((semester) => (
              <label key={semester} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedSemesters.includes(semester)}
                  onCheckedChange={() => handleSemesterToggle(semester)}
                />
                <span>{semester}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};