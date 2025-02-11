
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface ContentRendererProps {
  content: string;
  contentType: string;
}

export const ContentRenderer = ({ content, contentType }: ContentRendererProps) => {
  if (contentType === 'math') {
    try {
      return <BlockMath math={content} />;
    } catch (error) {
      console.error('Error rendering math:', error);
      return <span className="text-red-500">Error rendering math formula</span>;
    }
  }

  if (contentType === 'mixed') {
    // Handle mixed content with inline math denoted by $...$ symbols
    const parts = content.split(/(\$.*?\$)/g);
    return (
      <div>
        {parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            try {
              // Remove the $ symbols and render as math
              const mathContent = part.slice(1, -1);
              return <InlineMath key={index} math={mathContent} />;
            } catch (error) {
              console.error('Error rendering inline math:', error);
              return <span key={index} className="text-red-500">Error rendering math formula</span>;
            }
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  }

  // Default to regular text
  return <div className="whitespace-pre-wrap">{content}</div>;
};
