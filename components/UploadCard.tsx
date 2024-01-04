"use client";

import {
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import React from "react";

interface UploadCloudIconProps {
  className?: string;
}
export default function Component() {
  const [image, setImage] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [isdone, setIsdone] = useState(true);

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

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className=" flex-col">
        <Card className="w-full max-w-md mx-auto mt-10 bg-black rounded-lg overflow-hidden shadow-lg">
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
                    className="px-8 py-3 border  font-semibold hover:bg-gray-900 text-white bg-black rounded-full cursor-pointer"
                  >
                    Choose File
                  </Label>
                  {image !== "" ? (
                    <div className="mb-4 mt-10 border overflow-hidden">
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
                  className={`mt-6 px-8 py-2 border text-sm font-semibold text-white bg-black rounded-full ${
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

        <Card className="w-full max-w-2xl mx-auto mt-10 bg-black rounded-lg overflow-hidden shadow-lg">
          <CardContent className="p-8 text-center">
            <CardTitle className="text-2xl font-semibold text-white mb-2">
              Solution
            </CardTitle>
            {openAIResponse !== "" ? (
              <div className="border-t border-gray-300 pt-4">
                <h2 className="text-xl font-bold text-white mb-2">
                  AI Response
                </h2>
                <div className="text-white">
                  {openAIResponse.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
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
