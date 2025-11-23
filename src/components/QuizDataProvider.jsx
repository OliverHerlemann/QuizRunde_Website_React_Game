import { createContext, useContext, useState } from "react";
import { quizData } from "../quizData.jsx";

const QuizContext = createContext();

export function useQuizData() {
  return useContext(QuizContext);
}

export default function QuizDataProvider({ children }) {
  const [quizDataState, setQuizDataState] = useState(quizData);

  return (
    <QuizContext.Provider
      value={{ quizData: quizDataState, setQuizData: setQuizDataState }}
    >
      {children}
    </QuizContext.Provider>
  );
}
