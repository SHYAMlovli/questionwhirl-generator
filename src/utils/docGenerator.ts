import { Document, Packer, Paragraph, AlignmentType, TextRun, Table, TableRow, TableCell, BorderStyle, TableLayoutType, WidthType, convertInchesToTwip, HeightRule, VerticalAlign } from "docx";
import { FormData } from "@/types/form";
import { MappedQuestion } from "@/types/question";

const createQuestionTable = (questions: MappedQuestion[], part: string) => {
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: part === 'A' 
      ? [convertInchesToTwip(0.3), convertInchesToTwip(5.7), convertInchesToTwip(0.75), convertInchesToTwip(0.75)]
      : part === 'B'
      ? [convertInchesToTwip(0.3), convertInchesToTwip(6.2), convertInchesToTwip(0.75), convertInchesToTwip(0.75)]
      : [convertInchesToTwip(0.3), convertInchesToTwip(7.2)],
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: questions.flatMap((question, index) => {
      const rows = [];
      
      // Main question row
      rows.push(new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: (index + 1).toString() + ".", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60 },
            })],
            verticalAlign: "center",
            margins: { left: convertInchesToTwip(0.1) },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: question.content, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60 },
            })],
            verticalAlign: "center",
            margins: { left: convertInchesToTwip(0.1) },
          }),
          ...(part === 'A' || part === 'B' ? [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `K${question.kLevel || ''}`, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `CO${question.coLevel || ''}`, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
            }),
          ] : []),
        ],
      }));

      // OR question row if exists
      if (question.hasOr === "true" && question.orContent) {
        rows.push(new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "(Or)", size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: question.orContent, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.LEFT,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
              margins: { left: convertInchesToTwip(0.1) },
            }),
            ...(part === 'A' || part === 'B' ? [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: `K${question.orKLevel || question.kLevel || ''}`, size: 24, font: "Times New Roman" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                })],
                verticalAlign: "center",
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: `CO${question.orCoLevel || question.coLevel || ''}`, size: 24, font: "Times New Roman" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                })],
                verticalAlign: "center",
              }),
            ] : []),
          ],
        }));
      }

      return rows;
    }),
  });

  return table;
};

const createPartHeader = (part: string, marks: string) => {
  return new Paragraph({
    children: [
      new TextRun({ 
        text: `PART-${part} ${marks}`,
        size: 24, 
        font: "Times New Roman"
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1 }
    }
  });
};

export const generateQuestionPaperDoc = (formData: FormData, questions: MappedQuestion[]) => {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // Registration number table
        new Table({
          alignment: AlignmentType.RIGHT,
          width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
          margins: { top: 0, bottom: 0, left: convertInchesToTwip(0.1), right: 0 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Reg. No.", size: 24, font: "Times New Roman" }),
                      ],
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 0 },
                    }),
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  width: { size: convertInchesToTwip(0.8), type: WidthType.DXA },
                  verticalAlign: VerticalAlign.CENTER,
                }),
                ...Array(10).fill(null).map(() => 
                  new TableCell({
                    children: [new Paragraph({ text: "" })],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 },
                    },
                    width: { size: convertInchesToTwip(0.18), type: WidthType.DXA },
                    height: { value: convertInchesToTwip(0.18), rule: HeightRule.EXACT },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  })
                ),
              ],
            }),
          ],
        }),

        // Question Paper Code table (separate)
        new Table({
          alignment: AlignmentType.CENTER,
          width: { size: convertInchesToTwip(4), type: WidthType.DXA },
          margins: { top: convertInchesToTwip(0.2), bottom: 0, left: 0, right: 0 },
          rows: [
            new TableRow({
              height: { value: convertInchesToTwip(0.25), rule: HeightRule.EXACT },
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "" })],
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Question Paper Code    ", size: 24, font: "Times New Roman" }),
                        new TextRun({ text: `UTV CCS370`, size: 24, font: "Times New Roman" }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 120, after: 240 },
                    }),
                  ],
                  width: { size: 8, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ST.PETER'S COLLEGE OF ENGINEERING AND TECHNOLOGY", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "AVADI, CHENNAI 600 054", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "BE - DEGREE EXAMINATIONS NOVEMBER 2024", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Fifth Semester", size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "UNIT TEST- V", size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING", size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "CCS370 -UI/UX DESIGN", size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "(Regulations 2021)", size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 360 }
        }),

        // Time and Marks
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Duration: 2 Hours", size: 24, font: "Times New Roman" })
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NONE, size: 0 },
                  bottom: { style: BorderStyle.NONE, size: 0 },
                  left: { style: BorderStyle.NONE, size: 0 },
                  right: { style: BorderStyle.NONE, size: 0 },
                },
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Max. Marks 50", size: 24, font: "Times New Roman" })
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NONE, size: 0 },
                  bottom: { style: BorderStyle.NONE, size: 0 },
                  left: { style: BorderStyle.NONE, size: 0 },
                  right: { style: BorderStyle.NONE, size: 0 },
                },
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
            ],
          })],
        }),
        
        // Answer ALL Questions text
        new Paragraph({
          children: [
            new TextRun({ text: "Answer ALL Questions", size: 24, font: "Times New Roman" })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 }
        }),

        // Part A Header
        createPartHeader("A", "(5 × 2 = 10 Marks)"),

        // Part A Questions
        createQuestionTable(questions.filter(q => q.part.toUpperCase() === 'A'), 'A'),

        // Part B Header
        createPartHeader("B", "- Answer any 2    (2 × 12= 24 marks)"),

        // Part B Questions
        createQuestionTable(questions.filter(q => q.part.toUpperCase() === 'B'), 'B'),

        // Part C Header
        createPartHeader("C", "(1 ×16= 16 marks)"),

        // Part C Questions
        createQuestionTable(questions.filter(q => q.part.toUpperCase() === 'C'), 'C'),

        // Distribution of COs Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: [
            new TableRow({
              children: [new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Distribution of COs (Percentage wise)", size: 24, font: "Times New Roman" })],
                  alignment: AlignmentType.CENTER,
                })],
                columnSpan: 7,
              })],
            }),
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "Evaluation", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                }),
                ...Array(6).fill(0).map((_, i) => new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: `CO${i + 1}`, size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                })),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "Marks", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                }),
                ...Array(6).fill(0).map((_, i) => new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: i === 2 ? "100" : "-", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                })),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ 
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: "%", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                }),
                ...Array(6).fill(0).map((_, i) => new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: i === 2 ? "100" : "-", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                  })],
                })),
              ],
            }),
          ],
        }),

        // Knowledge Level Footer
        new Paragraph({
          children: [new TextRun({ 
            text: "Knowledge Level: K1 – Remember, K2 – Understand, K3 – Apply, K4 – Analyze, K5 – Evaluate, K6 – Create",
            size: 20,
            font: "Times New Roman",
          })],
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 240 },
        }),
      ],
    }],
  });

  return {
    save: async (fileName: string) => {
      try {
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating document:', error);
        throw error;
      }
    }
  };
};