"use client";

import { useState } from "react";
import { generatePrompt } from "@/ai/flows/generate-prompt";
import { generateDatasetStructure } from "@/ai/flows/generate-dataset-structure";
import { generateResponseFormat } from "@/ai/flows/generate-response-format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [applicationDescription, setApplicationDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [datasetStructure, setDatasetStructure] = useState<string | null>(null);
  const [responseFormat, setResponseFormat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const promptResult = await generatePrompt({ applicationDescription });
      setGeneratedPrompt(promptResult.prompt);

      const datasetResult = await generateDatasetStructure({ applicationDescription });
      setDatasetStructure(datasetResult.datasetStructure);

      const responseFormatResult = await generateResponseFormat({ applicationDescription });
      setResponseFormat(responseFormatResult.responseFormat);
    } catch (error) {
      console.error("Error generating outputs:", error);
      // Handle error appropriately (e.g., display an error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your LLM Application</CardTitle>
          <CardDescription>
            Enter a detailed description of the LLM application you want to build.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="e.g., chatbot for HR"
              value={applicationDescription}
              onChange={(e) => setApplicationDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Outputs"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
            <CardDescription>
              This is the AI-powered generated prompt based on your description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="min-h-[100px]" />
            ) : (
              <pre className="whitespace-pre-wrap">{generatedPrompt || "No prompt generated."}</pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Structure</CardTitle>
            <CardDescription>
              This is the AI-powered generated dataset structure for fine-tuning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="min-h-[100px]" />
            ) : (
              <pre className="whitespace-pre-wrap">{datasetStructure || "No dataset structure generated."}</pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Format</CardTitle>
            <CardDescription>
              This is the AI-powered generated response format from the LLM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="min-h-[100px]" />
            ) : (
              <pre className="whitespace-pre-wrap">{responseFormat || "No response format generated."}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
