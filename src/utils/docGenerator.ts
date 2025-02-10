
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
  const rows = questions.map((question, index) => {
    const cells = [
      // Question number cell
      new TableCell({
        children: [new Paragraph({ text: `${index + 1}` })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
      // Question content cell
      new TableCell({
        children: [new Paragraph({ text: question.content })],
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
      // Marks cell
      new TableCell({
        children: [new Paragraph({ text: question.marks })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
      // K-Level cell
      new TableCell({
        children: [new Paragraph({ text: `K${question.kLevel}` })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
      // CO-Level cell
      new TableCell({
        children: [new Paragraph({ text: `CO${question.coLevel}` })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
    ];

    const row = new TableRow({ children: cells });

    // If there's an OR question, add it as a separate row
    if (question.hasOr === "true" && question.orContent) {
      const orCells = [
        new TableCell({
          children: [new Paragraph({ text: "OR" })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: question.orContent })],
          width: { size: 60, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: question.orMarks || question.marks })],
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
      ];
      return [row, new TableRow({ children: orCells })];
    }

    return [row];
  });

  // Flatten the array since some questions might have two rows (for OR questions)
  const flattenedRows = rows.flat();

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header row
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "No." })] }),
          new TableCell({ children: [new Paragraph({ text: "Question" })] }),
          new TableCell({ children: [new Paragraph({ text: "Marks" })] }),
          new TableCell({ children: [new Paragraph({ text: "K-Level" })] }),
          new TableCell({ children: [new Paragraph({ text: "CO" })] }),
        ],
      }),
      ...flattenedRows,
    ],
  });
};
