import { useState } from "react";

import RecipeInstructions from "./RecipeInstructions";

import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";

export default function InstructionsInput({ value, onChange, ...props }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Cooking Instructions *
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <HiInformationCircle className="w-4 h-4" />
            Formatting Guide
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            {showPreview ? (
              <>
                <HiEyeOff className="w-4 h-4" />
                Hide Preview
              </>
            ) : (
              <>
                <HiEye className="w-4 h-4" />
                Show Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formatting Guide */}
      {showHelp && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <HiInformationCircle className="w-5 h-5" />
            How to Format Instructions
          </h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-1">📝 Numbered Steps:</p>
              <div className="bg-white/50 p-2 rounded font-mono text-xs">
                1. Preheat the oven to 350°F
                <br />
                2. Mix the dry ingredients
                <br />
                3. Add wet ingredients and stir
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">📋 Section Headers:</p>
              <div className="bg-white/50 p-2 rounded font-mono text-xs">
                **Prepare the Dough:** Mix flour and water
                <br />
                **Bake:** Place in oven for 30 minutes
              </div>
              <p className="text-xs mt-1 italic">Or use ALL CAPS:</p>
              <div className="bg-white/50 p-2 rounded font-mono text-xs">
                PREPARE THE DOUGH: Mix flour and water
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Each new line becomes a new step</li>
                <li>Use section headers to organize complex recipes</li>
                <li>Be clear and concise in each step</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Write step-by-step instructions...

Example:
1. Preheat oven to 350°F and grease a baking pan
2. Mix flour, sugar, and baking powder in a bowl
3. Add eggs and milk, stir until smooth

Or with sections:
**Prepare the Batter:** Mix all dry ingredients
**Bake:** Pour into pan and bake for 30 minutes"
        rows={showPreview ? "8" : "12"}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition resize-none font-mono text-sm"
        {...props}
      />

      {/* Preview */}
      {showPreview && value && (
        <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
          <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            👁️ Live Preview
          </h4>
          <RecipeInstructions content={value} />
        </div>
      )}
    </div>
  );
}
