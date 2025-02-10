
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { MappedQuestion } from '@/types/question';
import { FormData } from '@/types/form';

export const generateQuestionPaperDoc = (formData: FormData, selectedQuestions: MappedQuestion[]) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `Question Paper: ${formData.subject_code} - ${formData.subject_name}`,
            heading: 'Heading1',
          }),
          new Paragraph({
            text: `Department: ${formData.department.join(', ')}`,
          }),
          new Paragraph({
            text: `Year: ${formData.year.join(', ')}`,
          }),
          new Paragraph({
            text: `Semester: ${formData.semester.join(', ')}`,
          }),
          new Paragraph({
            text: `Duration: ${formData.duration}`,
          }),
          new Paragraph({
            text: `Date: ${formData.date.join(', ')}`,
          }),
          new Paragraph({
            text: '',
          }),
          createQuestionsTable(selectedQuestions),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
};

const createQuestionsTable = (questions: MappedQuestion[]): Table => {
  const rows: TableRow[] = [];

  // Add header row
  rows.push(
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "No." })] }),
        new TableCell({ children: [new Paragraph({ text: "Question" })] }),
        new TableCell({ children: [new Paragraph({ text: "Marks" })] }),
        new TableCell({ children: [new Paragraph({ text: "K-Level" })] }),
        new TableCell({ children: [new Paragraph({ text: "CO" })] }),
      ],
    })
  );

  // Add question rows
  questions.forEach((question, index) => {
    // Main question row
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: `${index + 1}` })],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: question.content })],
            width: { size: 60, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(question.marks) })],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: `K${question.kLevel}` })],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: `CO${question.coLevel}` })],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
        ],
      })
    );

    // Add OR question if it exists
    if (question.hasOr === "true" && question.orContent) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "OR" })],
              width: { size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: question.orContent })],
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: String(question.orMarks || question.marks) })],
              width: { size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: `K${question.orKLevel || question.kLevel}` })],
              width: { size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: `CO${question.orCoLevel || question.coLevel}` })],
              width: { size: 10, type: WidthType.PERCENTAGE },
            }),
          ],
        })
      );
    }
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
  });
};
