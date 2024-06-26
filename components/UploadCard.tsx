"use client";

import {
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import React, { ChangeEvent, FormEvent, useState } from "react";

import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["input/asciimath", "output/svg"] },
  tex: {
    inlineMath: [["\\(", "\\)"]], // Add this line to your existing config
  },
};

interface UploadCloudIconProps {
  className?: string;
}
type TextBlock = { type: "text"; value: string };
type LaTeXBlock = { type: "latex"; value: string };
type ResponseBlock = TextBlock | LaTeXBlock;
export default function UploadCard() {
  const [image, setImage] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [isdone, setIsdone] = useState(true);
  // function isMathExpression(line: string): boolean {
  //   // Example using LaTeX delimiters
  //   return line.includes("$$") || line.includes("\\(") || line.includes("\\[");
  // }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      window.alert("no file selected.");
      return;
    }
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        console.log(reader.result);
        setImage(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.log("error: " + error);
    };
  }

  async function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (image === "") {
      alert("Upload an image.");
      return;
    }

    await fetch("api/analyzeimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image, // base64 image
      }),
    }).then(async (response: any) => {
      const reader = response.body?.getReader();
      setOpenAIResponse("");
      setIsdone(false);

      while (true) {
        const { done, value } = await reader?.read();
        if (done) {
          setIsdone(true);
          break;
        }

        // value : uint8array -> a string.
        var currentChunk = new TextDecoder().decode(value);
        setOpenAIResponse((prev) => prev + currentChunk);
      }
    });
  }
  function extractLaTeXBlocks(text: string): ResponseBlock[] {
    const latexRegex = /(\$\$|\\\[).*?(\$\$|\\\])/gs;
    let result: ResponseBlock[] = [];
    let lastIndex = 0;

    text.replace(latexRegex, (match, _startTag, _endTag, offset) => {
      if (offset > lastIndex) {
        const textBlock = text.substring(lastIndex, offset);
        textBlock.split("\n").forEach((line) => {
          if (line) {
            result.push({ type: "text", value: line });
          }
          // Add a special marker for new lines
          result.push({ type: "text", value: "\n" });
        });
      }
      result.push({ type: "latex", value: match });
      lastIndex = offset + match.length;
      return match;
    });

    // Process remaining text after the last LaTeX block
    const remainingText = text.substring(lastIndex);
    remainingText.split("\n").forEach((line) => {
      if (line) {
        result.push({ type: "text", value: line });
      }
      result.push({ type: "text", value: "\n" });
    });

    return result;
  }
  const sanitizeLaTeX = (latex: string): string => {
    // Fix common LaTeX formatting issues

    // Replace "fracfrac" with "frac"
    latex = latex.replace(/fracfrac/g, "frac");

    // Ensure that there are braces {} around each \frac numerator and denominator
    latex = latex.replace(
      /\\frac\s*{?([^{}]+)}?\s*{?([^{}]+)}?/g,
      "\\frac{$1}{$2}"
    );

    // Replace incorrect "e " with the exponential constant "e^"
    latex = latex.replace(/e\s+/g, "e^");

    // Add any additional specific replacements needed
    // ...

    return latex;
  };

  const processResponse = (responseText: string): JSX.Element[] => {
    const blocks = extractLaTeXBlocks(responseText);
    return blocks.map((block, index) => {
      if (block.type === "latex") {
        // Sanitize and fix the LaTeX string
        let sanitizedLaTeX = sanitizeLaTeX(block.value);
        sanitizedLaTeX = fixSuperscriptAndSubscript(sanitizedLaTeX);
        return (
          <MathJax key={`block-${index}`} dynamic>
            {sanitizedLaTeX}
          </MathJax>
        );
      } else if (block.value === "\n") {
        return <br key={`newline-${index}`} />;
      } else {
        return <span key={`text-${index}`}>{block.value}</span>;
      }
    });
  };

  function fixSuperscriptAndSubscript(latex: string): string {
    // Regex to find superscript and subscript without proper arguments
    const regex = /(\^|_)(?!\{)/g;

    // Replace with the proper LaTeX command by adding empty braces if needed
    latex = latex.replace(regex, "$1{}");

    // Handle cases where the ^ or _ is followed by a space or a non-alphanumeric character
    // which should be enclosed in curly braces
    latex = latex.replace(/(\^|_)\s/g, "$1{ }");
    latex = latex.replace(/(\^|_)(\W)/g, "$1{$2}");

    // Note: This is a simple fix and may not cover all edge cases.
    // Complex mathematical expressions might need a more robust solution.

    return latex;
  }

  // // Implement a function to clean up LaTeX strings
  // function cleanLaTeXString(latex: string): string {
  //   // Example: Replace double backslashes with single backslashes
  //   return latex.replace(/\\\\/g, "\\");
  // }

  return (
    <MathJaxContext config={config}>
      <div className="flex justify-center items-center w-full h-full">
        <div className=" flex-col">
          <Card className="w-full max-w-md mx-auto mt-10 bg-black rounded-lg border-slate-300 overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <UploadCloudIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <CardTitle className="text-2xl font-semibold text-white mb-2">
                Upload Your Problem
              </CardTitle>
              <CardDescription className="text-gray-400 mb-4">
                Please select a file from your device
              </CardDescription>
              <div className="flex items-center justify-center mt-4">
                <form onSubmit={(e) => handleOnSubmit(e)}>
                  <div className="relative my-4">
                    <input
                      type="file"
                      id="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e)}
                    />
                    <Label
                      htmlFor="file"
                      className="px-8 py-3 border border-slate-300 font-semibold hover:bg-gray-900 text-white bg-black rounded-full cursor-pointer"
                    >
                      Choose File
                    </Label>
                    {image !== "" ? (
                      <div className="mb-4 mt-10 border border-slate-300 overflow-hidden">
                        <img
                          src={image}
                          className="w-full object-contain max-h-72"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 p-8 text-center">
                        <p className="text-white">
                          Once you upload an image, you will see it here.
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className={`mt-6 px-8 py-2 border border-slate-300 text-sm font-semibold text-white bg-black rounded-full ${
                      !isdone && "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isdone}
                  >
                    {isdone === false ? "Select a file" : "Upload"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl mx-auto mt-10 bg-black border-slate-300 rounded-lg overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <CardTitle className="text-2xl font-semibold text-white mb-2">
                Solution
              </CardTitle>
              {openAIResponse && (
                <div className="border-t border-gray-300 pt-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    AI Response
                  </h2>
                  <div className="text-white prose">
                    {processResponse(openAIResponse)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MathJaxContext>
  );
}
function UploadCloudIcon({ className, ...rest }: UploadCloudIconProps) {
  return (
    <svg
      className={className}
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
