import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BasicInfoForm } from "@/components/question-paper/BasicInfoForm";
import { QuestionForm } from "@/components/question-paper/QuestionForm";
import { supabase } from "@/integrations/supabase/client";
import { generateQuestionPaperDoc } from "@/utils/docGenerator";
import { PreviewSection } from "@/components/question-paper/PreviewSection";
import { selectRandomQuestions } from "@/utils/questionSelection";
import { FormData } from "@/types/form";
import { TopicQuestion, QuestionFromDB, MappedQuestion, mapDBQuestionToTopicQuestion } from "@/types/question";

const QuestionPaper = () => {
  const [formData, setFormData] = useState<FormData>({
    department: [],
    year: [],
    semester: [],
    subject_code: "",
    subject_name: "",
    tests: [],
    duration: "",
    date: [],
  });

  const [topicQuestions, setTopicQuestions] = useState<TopicQuestion[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<MappedQuestion[]>([]);

  const addNewQuestion = () => {
    const newQuestion: TopicQuestion = {
      id: Date.now(),
      part: "",
      marks: "",
      kLevel: "",
      coLevel: "",
      hasOr: "false", // Initialize hasOr as false
      orContent: "",
      orMarks: "",
      orKLevel: "",
      orPart: "",
      orCoLevel: "",
    };
    setTopicQuestions([...topicQuestions, newQuestion]);
  };

  const updateQuestion = (id: number, field: keyof TopicQuestion, value: string) => {
    setTopicQuestions(questions =>
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const deleteQuestion = (id: number) => {
    setTopicQuestions(questions => questions.filter(q => q.id !== id));
  };

  const validateForm = () => {
    if (!formData.department || !formData.year || !formData.subject_code || !formData.subject_name) {
      toast.error("Please fill in all basic information fields");
      return false;
    }
    if (topicQuestions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }
    for (const q of topicQuestions) {
      if (!q.part || !q.marks || !q.kLevel || !q.coLevel) {
        toast.error("Please fill in all question fields");
        return false;
      }
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    try {
      console.log('Form data:', formData);
      console.log('Topic questions:', topicQuestions);

      // First fetch all questions for the subject
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .match({
          subject_code: formData.subject_code,
          subject_name: formData.subject_name
        });

      if (error) {
        console.error('Database error:', error);
        toast.error("Failed to fetch questions");
        return;
      }

      if (!questions || questions.length === 0) {
        toast.error("No questions found for this subject");
        return;
      }

      console.log('Available questions from DB:', questions);

      // Try to select questions based on requirements
      const selected = selectRandomQuestions(questions as QuestionFromDB[], topicQuestions);
      console.log('Selected questions:', selected);
      
      if (!selected || selected.length === 0) {
        console.error('No matching questions found. Requirements:', topicQuestions);
        console.error('Available questions:', questions);
        toast.error("No matching questions found for your requirements");
        return;
      }

      if (selected.length !== topicQuestions.length) {
        const missing = topicQuestions.length - selected.length;
        console.error('Missing questions. Found:', selected.length, 'Required:', topicQuestions.length);
        toast.error(`Could not find enough matching questions. Missing ${missing} question(s).`);
        return;
      }

      // Map selected questions and ensure OR questions are properly handled
      const mappedQuestions = selected.map((q, index) => {
        console.log(`Mapping question ${index}:`, q);
        const mapped = mapDBQuestionToTopicQuestion(q);
        console.log(`Mapped question ${index}:`, mapped);
        return mapped;
      });

      setSelectedQuestions(mappedQuestions);
      setPreviewMode(true);
      toast.success("Preview generated successfully!");
      
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error("Failed to generate preview. Please check console for details.");
    }
  };

  const handleGeneratePaper = async () => {
    if (!validateForm()) return;
    
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

      // Create a paper for each department
      for (const dept of formData.department) {
        const { error: paperError } = await supabase
          .from('question_papers')
          .insert({
            title: `${formData.subject_code} - ${formData.subject_name}`,
            department: dept,
            course_code: formData.subject_code,
            course_name: formData.subject_name,
            year: formData.year[0], // Use first year from array
            user_id: defaultUserId
          });

        if (paperError) throw paperError;
      }

      const doc = generateQuestionPaperDoc(formData, selectedQuestions);
      doc.save(`${formData.subject_code}_question_paper.docx`);
      toast.success("Question paper generated successfully!");
    } catch (error) {
      console.error('Error generating paper:', error);
      toast.error("Failed to generate question paper");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {previewMode ? "Preview Question Paper" : "Generate Question Paper"}
          </h1>
          
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            {previewMode ? (
              <PreviewSection
                formData={formData}
                selectedQuestions={selectedQuestions}
                setPreviewMode={setPreviewMode}
                handleGeneratePaper={handleGeneratePaper}
              />
            ) : (
              <form className="space-y-6">
                <BasicInfoForm formData={formData} setFormData={setFormData} />

                <div className="col-span-2">
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Questions</h2>
                      <Button type="button" variant="outline" onClick={addNewQuestion}>
                        Add Question
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {topicQuestions.map((question, index) => (
                        <QuestionForm
                          key={question.id}
                          question={question}
                          updateQuestion={updateQuestion}
                          onDelete={deleteQuestion}
                          questionNumber={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" onClick={handlePreview}>
                    Preview
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionPaper;