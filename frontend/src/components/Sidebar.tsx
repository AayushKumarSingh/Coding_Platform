import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import axios from "axios";

interface Question {
  id: number;
  title: string;
  difficulty: string;
}

interface SidebarProps {
  onQuestionSelect: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onQuestionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios
        .get("http://localhost:3000/api/v1/questions/all")
        .then((res) => {
          setQuestions(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-indigo-500 text-white fixed top-4 left-4 z-50 rounded-md shadow-lg hover:bg-indigo-600 transition"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 p-4`}
      >
        <h2 className="text-xl font-bold mb-4">Questions</h2>

        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && questions.length > 0 && (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                onClick={() => {
                  onQuestionSelect(q.id);
                  setIsOpen(false);
                }}
                className="bg-gray-800 p-3 rounded hover:bg-gray-700 cursor-pointer transition"
              >
                <div className="font-semibold">{q.title}</div>
                <div className="text-sm text-gray-400">{q.difficulty}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Sidebar;
