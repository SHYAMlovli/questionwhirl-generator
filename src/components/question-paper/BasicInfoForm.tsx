import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { DepartmentSelect } from "./DepartmentSelect";
import { TestSelect } from "./TestSelect";
import { DurationSelect } from "./DurationSelect";
import { SemesterSelect } from "./SemesterSelect";
import { DateSelect } from "./DateSelect";
import { YearSelect } from "./YearSelect";
import { Skeleton } from "@/components/ui/skeleton";

interface BasicInfoFormProps {
  formData: {
    department: string[];
    year: string[];
    semester: string[];
    subject_code: string;
    subject_name: string;
    tests: string[];
    duration: string;
    date: string[];
  };
  setFormData: (data: any) => void;
}

export const BasicInfoForm = ({ formData, setFormData }: BasicInfoFormProps) => {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('questions')
          .select('subject_code, subject_name')
          .order('created_at', { ascending: false });
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        return data || [];
      } catch (err) {
        console.error('Error fetching subjects:', err);
        toast.error('Failed to fetch subjects. Please try again.');
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const uniqueSubjects = questions ? [...new Set(questions
    .filter(q => q.subject_code && q.subject_name)
    .map(q => `${q.subject_code}-${q.subject_name}`)
  )] : [];

  const filteredSubjects = uniqueSubjects.filter(subject => 
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleSubjectChange = (value: string) => {
    const [code, ...nameParts] = value.split('-');
    const name = nameParts.join('-');
    setFormData({ 
      ...formData, 
      subject_code: code.trim(), 
      subject_name: name.trim() 
    });
    setSubjectSearch(value);
    setShowDropdown(false);
  };

  const handleInputChange = (value: string) => {
    setSubjectSearch(value);
    setShowDropdown(true);
  };

  if (error) {
    toast.error('Error loading subjects. Please refresh the page.');
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Department</label>
          <DepartmentSelect
            selectedDepts={formData.department}
            onDepartmentChange={(depts) => setFormData({ ...formData, department: depts })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <YearSelect
            selectedYears={formData.year}
            onYearChange={(years) => setFormData({ ...formData, year: years })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Semester</label>
          <SemesterSelect
            selectedSemesters={formData.semester}
            onSemesterChange={(semesters) => setFormData({ ...formData, semester: semesters })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tests</label>
          <TestSelect
            selectedTests={formData.tests}
            onTestChange={(tests) => setFormData({ ...formData, tests })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Duration</label>
          <DurationSelect
            value={formData.duration}
            onChange={(value) => setFormData({ ...formData, duration: value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <DateSelect
            selectedDates={formData.date}
            onDateChange={(dates) => setFormData({ ...formData, date: dates })}
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <Input
                value={subjectSearch}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search or enter subject (e.g., CS1234-Computer Science)"
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && filteredSubjects.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredSubjects.map((subject) => (
                    <button
                      key={subject}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => handleSubjectChange(subject)}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};