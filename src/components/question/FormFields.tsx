
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentRenderer } from "./ContentRenderer";
import { AlertCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FormFieldsProps {
  content: string;
  setContent: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  mark: string;
  setMark: (value: string) => void;
  kLevel: string;
  setKLevel: (value: string) => void;
  part: string;
  setPart: (value: string) => void;
  coLevel: string;
  setCoLevel: (value: string) => void;
  hasFormula: boolean;
  setHasFormula: (value: boolean) => void;
  hasOr: boolean;
  setHasOr: (value: boolean) => void;
  orContent: string;
  setOrContent: (value: string) => void;
  orContentType: string;
  setOrContentType: (value: string) => void;
  orMark: string;
  setOrMark: (value: string) => void;
  orKLevel: string;
  setOrKLevel: (value: string) => void;
  orPart: string;
  setOrPart: (value: string) => void;
  orCoLevel: string;
  setOrCoLevel: (value: string) => void;
  orHasFormula: boolean;
  setOrHasFormula: (value: boolean) => void;
}

export const parts = ["A", "B", "C"];
export const marks = ["2", "8", "12", "16"];
export const kLevels = ["K1", "K2", "K3", "K4", "K5", "K6"];
export const coLevels = ["CO1", "CO2", "CO3", "CO4", "CO5"];
export const contentTypes = ["text", "math", "mixed"];

export const FormFields = ({
  content,
  setContent,
  contentType,
  setContentType,
  mark,
  setMark,
  kLevel,
  setKLevel,
  part,
  setPart,
  coLevel,
  setCoLevel,
  hasFormula,
  setHasFormula,
  hasOr,
  setHasOr,
  orContent,
  setOrContent,
  orContentType,
  setOrContentType,
  orMark,
  setOrMark,
  orKLevel,
  setOrKLevel,
  orPart,
  setOrPart,
  orCoLevel,
  setOrCoLevel,
  orHasFormula,
  setOrHasFormula,
}: FormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>Content Type</Label>
          <HoverCard>
            <HoverCardTrigger>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Content Type Guide:</h4>
                <ul className="list-disc pl-4 text-sm">
                  <li><strong>Text:</strong> Regular text content</li>
                  <li><strong>Math:</strong> Pure mathematical formula (e.g., x^2 + y^2 = z^2)</li>
                  <li><strong>Mixed:</strong> Text with math formulas surrounded by $ symbols (e.g., The area is $x^2$ square units)</li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={contentType === 'math' ? 'Enter LaTeX math formula (e.g., x^2 + y^2 = z^2)' : 
              contentType === 'mixed' ? 'Enter text with math formulas surrounded by $ symbols' : 
              'Enter content'}
            className="min-h-[100px]"
          />
          {content && (
            <div className="rounded-md border p-4 bg-muted/50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <ContentRenderer content={content} contentType={contentType} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Part</Label>
          <Select value={part} onValueChange={setPart}>
            <SelectTrigger>
              <SelectValue placeholder="Select part" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Marks</Label>
          <Select value={mark} onValueChange={setMark}>
            <SelectTrigger>
              <SelectValue placeholder="Select marks" />
            </SelectTrigger>
            <SelectContent>
              {marks.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>K-Level</Label>
          <Select value={kLevel} onValueChange={setKLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select K-Level" />
            </SelectTrigger>
            <SelectContent>
              {kLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>CO-Level</Label>
          <Select value={coLevel} onValueChange={setCoLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select CO-Level" />
            </SelectTrigger>
            <SelectContent>
              {coLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-or"
            checked={hasOr}
            onCheckedChange={(checked) => setHasOr(checked as boolean)}
          />
          <Label htmlFor="has-or" className="font-medium">
            Add OR Question
          </Label>
        </div>

        {hasOr && (
          <div className="pl-6 border-l-2 border-gray-200 space-y-4 mt-4">
            <h4 className="font-medium mb-4">OR Question Details</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={orContentType} onValueChange={setOrContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="space-y-2">
                  <Textarea
                    value={orContent}
                    onChange={(e) => setOrContent(e.target.value)}
                    placeholder={orContentType === 'math' ? 'Enter LaTeX math formula' : 
                      orContentType === 'mixed' ? 'Enter text with math formulas surrounded by $ symbols' : 
                      'Enter content'}
                    className="min-h-[100px]"
                  />
                  {orContent && (
                    <div className="rounded-md border p-4 bg-muted/50">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <ContentRenderer content={orContent} contentType={orContentType} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Part</Label>
                  <Select value={orPart} onValueChange={setOrPart}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      {parts.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marks</Label>
                  <Select value={orMark} onValueChange={setOrMark}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marks" />
                    </SelectTrigger>
                    <SelectContent>
                      {marks.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>K-Level</Label>
                  <Select value={orKLevel} onValueChange={setOrKLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select K-Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {kLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>CO-Level</Label>
                  <Select value={orCoLevel} onValueChange={setOrCoLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CO-Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {coLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
