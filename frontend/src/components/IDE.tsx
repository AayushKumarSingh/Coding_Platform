import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

type Language = "python" | "cpp" | "java";

interface IDEProps {
  questionId: number | null;
}

const defaultCode: Record<Language, string> = {
  python: `print("Hello, Python!")`,
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
};

const IDE: React.FC<IDEProps> = ({ questionId }) => {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<Record<Language, string>>(defaultCode);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (value: string | undefined) => {
    setCode((prev) => ({ ...prev, [language]: value || "" }));
  };

  // Play sound
  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const showPopup = (message: string, color: string, sound?: string) => {
    const popup = document.createElement("div");
    popup.innerText = message;
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.backgroundColor = color;
    popup.style.color = "#fff";
    popup.style.padding = "12px 20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    popup.style.fontWeight = "bold";
    popup.style.zIndex = "9999";
    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 4000);

    if (sound) playSound(sound);
  };

  const submitCode = async () => {
    if (!questionId) {
      showPopup("Select a question first!", "red");
      return;
    }

    setLoading(true);
    setOutput("Submitting code...");

    try {
      const submitRes = await axios.post("http://localhost:3000/api/v1/submition", {
        questionId: questionId.toString(),
        code: code[language],
        language,
      });

      const jobId = submitRes.data.jobId;
      setOutput(`Job submitted. Job ID: ${jobId}\nChecking status...`);

      const interval = setInterval(async () => {
        try {
          const statusRes = await axios.get(
            `http://localhost:3000/api/v1/submition/status/${jobId}`
          );
          const { status, result, error } = statusRes.data;

          if (status === "pending") {
            setOutput("Code is being evaluated...");
          } else {
            clearInterval(interval);
            setLoading(false);

            if (status === "completed" && result?.total) {
              const allPassed = result.results.every((r: any) => r.passed);
              const hasError = result.results.some((r: any) =>
                r.actual?.toLowerCase().includes("error") || r.actual?.toLowerCase().includes("time limit")
              );

              if (allPassed) {
                showPopup("All test cases passed ✅", "green", "/sounds/success.mp3");
              } else if (hasError) {
                showPopup("TLE / Runtime Error ❌", "purple", "/sounds/error.mp3");
              } else {
                showPopup("Some test cases failed ❌", "red", "/sounds/fail.mp3");
              }

              setOutput(JSON.stringify(result, null, 2));
            } else if (status === "error") {
              showPopup(`Error: ${error}`, "purple", "/sounds/error.mp3");
              setOutput(`Error: ${error}`);
            } else {
              showPopup("Submission rejected ❌", "red", "/sounds/fail.mp3");
              setOutput("Submission rejected.");
            }
          }
        } catch (err: any) {
          clearInterval(interval);
          setLoading(false);
          showPopup("Failed to fetch job status ❌", "red", "/sounds/fail.mp3");
          setOutput(`Error fetching job status: ${err.message}`);
        }
      }, 5000);
    } catch (err: any) {
      setLoading(false);
      showPopup("Failed to submit code ❌", "red", "/sounds/fail.mp3");
      setOutput(`Submission error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-screen flex flex-col">
      {/* Language Tabs */}
      <div className="flex space-x-4 mb-4">
        {(["python", "cpp", "java"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded ${
              language === lang ? "bg-indigo-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 border border-gray-700 rounded">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === "cpp" ? "cpp" : language}
          value={code[language]}
          onChange={handleCodeChange}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={submitCode}
          disabled={loading || !questionId}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Running..." : "Submit"}
        </button>
      </div>

      {/* Output Console */}
      <div className="mt-4 bg-black p-3 rounded h-48 overflow-auto text-sm whitespace-pre-wrap">
        {output || "Output will be shown here..."}
      </div>
    </div>
  );
};

export default IDE;
