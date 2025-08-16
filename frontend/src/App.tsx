import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import IDE from "./components/IDE";
import QuestionView from "./components/QuestionView";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  return (
    <>
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<Login />} />
    </Routes>

    <div className="bg-gray-100 dark:bg-gray-800">
      <Navbar />
      <Sidebar onQuestionSelect={setSelectedQuestion} />

      <div className="grid grid-cols-2 gap-4 p-4 ml-16">
        <QuestionView questionId={selectedQuestion} />
        <IDE questionId={selectedQuestion} />
      </div>

    </div>
    </>
  );
}

export default App;
