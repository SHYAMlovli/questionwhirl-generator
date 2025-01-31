import { FileText, Database, BookOpen } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateSampleQuestionPaper } from "@/utils/testQuestionPaper";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: subjectsCount } = useQuery({
    queryKey: ['subjects-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('subject_code, subject_name');
      
      if (error) throw error;
      
      const uniqueSubjects = new Set(
        data
          .filter(q => q.subject_code && q.subject_name)
          .map(q => `${q.subject_code}-${q.subject_name}`)
      );
      
      return uniqueSubjects.size;
    }
  });

  const { data: questionsCount } = useQuery({
    queryKey: ['questions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Question Papers"
              value={12}
              icon={FileText}
              description="Total question papers generated this month"
            />
            <DashboardCard
              title="Questions"
              value={questionsCount}
              icon={Database}
              description="Questions available in the database"
            />
            <DashboardCard
              title="Subjects"
              value={subjectsCount}
              icon={BookOpen}
              description="Number of subjects in question bank"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => window.location.href = '/question-paper'}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate New Question Paper
              </button>
              <button
                onClick={() => window.location.href = '/questions'}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Question Bank
              </button>
              <Button
                onClick={generateSampleQuestionPaper}
                variant="outline"
              >
                Generate Sample Paper
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
