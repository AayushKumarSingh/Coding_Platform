import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface QuestionData {
  title: string;
  description: string; // Markdown string from backend
  difficulty: string;
  tags: string;
}

interface QuestionViewProps {
  questionId: number | null;
}

const QuestionView: React.FC<QuestionViewProps> = ({ questionId }) => {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionId) return;

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/v1/questions/${questionId}`) // Express API
      .then((res) => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [questionId]);

  if (!questionId) return <div className="p-6 text-gray-400">Select a question from the sidebar.</div>;
  if (loading) return <div className="p-6 text-gray-400">Loading question...</div>;
  if (!question) return <div className="p-6 text-red-400">Failed to load question.</div>;

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
      <div className="text-sm text-gray-400 mb-4">
        {question.difficulty} • {question.tags}
      </div>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default QuestionView;
