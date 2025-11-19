export default function RecipeInstructions({ content }) {
  const parseInstructions = (text) => {
    if (!text) return [];

    const lines = text.split("\n").filter((line) => line.trim());
    const parsed = [];
    let stepNumber = 1;

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check for section headers (bold text with ** or ALL CAPS with :)
      const boldHeaderMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
      const capsHeaderMatch = trimmed.match(/^([A-Z\s]{3,}):(.*)$/);

      if (boldHeaderMatch) {
        // Bold header format: **Header:** content
        parsed.push({
          type: "section",
          title: boldHeaderMatch[1].trim(),
          content: boldHeaderMatch[2].trim(),
        });
      } else if (capsHeaderMatch && !capsHeaderMatch[1].match(/^STEP \d+$/)) {
        // ALL CAPS header format: HEADER: content
        parsed.push({
          type: "section",
          title: capsHeaderMatch[1].trim(),
          content: capsHeaderMatch[2].trim(),
        });
      } else if (
        // Numbered steps: "1.", "1)", "Step 1:", "Step 1."
        trimmed.match(/^(\d+\.|\d+\)|Step\s+\d+[:.])\s*/i)
      ) {
        const cleanedStep = trimmed
          .replace(/^(\d+\.|\d+\)|Step\s+\d+[:.])\s*/i, "")
          .trim();
        if (cleanedStep) {
          parsed.push({
            type: "step",
            number: stepNumber++,
            content: cleanedStep,
          });
        }
      } else if (trimmed.length > 0) {
        // Regular paragraph - check if it should be a step
        if (
          parsed.length === 0 ||
          parsed[parsed.length - 1].type === "section"
        ) {
          // First item or after a section, make it a step
          parsed.push({
            type: "step",
            number: stepNumber++,
            content: trimmed,
          });
        } else {
          // Continuation of previous step
          const lastItem = parsed[parsed.length - 1];
          if (lastItem.type === "step") {
            lastItem.content += " " + trimmed;
          } else {
            parsed.push({
              type: "step",
              number: stepNumber++,
              content: trimmed,
            });
          }
        }
      }
    });

    return parsed;
  };

  const instructions = parseInstructions(content);

  return (
    <div className="space-y-6">
      {instructions.map((instruction, index) => {
        if (instruction.type === "section") {
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
                <span className="w-2 h-8 bg-green-500 rounded"></span>
                {instruction.title}
              </h3>
              {instruction.content && (
                <p className="text-gray-700 leading-relaxed ml-5 pl-3 border-l-2 border-green-200">
                  {instruction.content}
                </p>
              )}
            </div>
          );
        }

        return (
          <div
            key={index}
            className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition group"
          >
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition">
                {instruction.number}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-gray-700 leading-relaxed">
                {instruction.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SimpleInstructions({ content }) {
  const steps = content
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => ({
      number: index + 1,
      text: line.trim().replace(/^(\d+\.|\d+\)|Step\s+\d+[:.])\s*/i, ""),
    }));

  return (
    <ol className="space-y-4">
      {steps.map((step) => (
        <li key={step.number} className="flex gap-4">
          <span className="shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
            {step.number}
          </span>
          <p className="flex-1 text-gray-700 leading-relaxed pt-1">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
