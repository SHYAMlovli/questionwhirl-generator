import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';

export const generateQuestionPaperDoc = (formData: any, selectedQuestions: any[]) => {
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
          createTable(selectedQuestions),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
};

const createTable = (rows: any[][]): Table => {
  return new Table({
    rows: rows.map(row => new TableRow({
      children: row.map(content => new TableCell({
        children: [new Paragraph({ text: content.toString() })],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      })),
    })),
  });
};
