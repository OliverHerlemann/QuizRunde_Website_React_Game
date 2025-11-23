import { useState } from "react";
import { useQuizData } from "./QuizDataProvider.jsx";

export default function QuizOverview() {
  const { quizData, setQuizData } = useQuizData();
  const rows = 5;
  const cols = 5;
  const selectedIndex = quizData.findIndex((data) => data.isSelected === true);

  // in einem array alle indizes speichern die "finsihed" sind
  const finishedIndices =
    selectedIndex !== -1
      ? quizData[selectedIndex].content
          .map((item, i) => (item.questionFinished ? i : null))
          .filter((i) => i !== null)
      : [];

  const categories = [
    ...new Set(
      quizData[selectedIndex]?.content?.map((item) => item.category) || []
    ),
  ];

  function handleQuestionClick(index) {
    if (selectedIndex !== -1) {
      if (quizData[selectedIndex].isSelected) {
        setQuizData((prevQuizData) => {
          // 1️⃣ gesamte Kopie des quizData-Arrays erstellen
          const updatedQuizData = [...prevQuizData];
          // 2️⃣ Kopie des ausgewählten Quiz-Datensatzes
          const selectedQuiz = { ...updatedQuizData[selectedIndex] };
          // 3️⃣ Kopie der content-Liste
          const updatedContent = selectedQuiz.content.map((q, i) =>
            i === index ? { ...q, questionIsActive: true } : q
          );
          // 4️⃣ neue content-Liste einsetzen
          selectedQuiz.content = updatedContent;
          // 5️⃣ das Element im Hauptarray ersetzen
          updatedQuizData[selectedIndex] = selectedQuiz;
          // 6️⃣ zurückgeben → das ist der neue State
          return updatedQuizData;
        });
      }
    }
  }

  return (
    <div className="quiz-grid">
      {/*   <div className="quiz-categories">
        <button className="cat-element" id="cat-one">
          {quizData[selectedIndex].content[0].category}
        </button>
        <button className="cat-element" id="cat-two">
          {quizData[selectedIndex].content[5].category}
        </button>
        <button className="cat-element" id="cat-three">
          {quizData[selectedIndex].content[10].category}
        </button>
        <button className="cat-element" id="cat-four">
          {quizData[selectedIndex].content[15].category}
        </button>
        <button className="cat-element" id="cat-five">
          {quizData[selectedIndex].content[20].category}
        </button>
  </div>  
      <div className="question-overview">
        <ol>
          {quizData[selectedIndex].content.map((element, index) => (
            <li key={index}>
              <button>{element.points}</button>
            </li>
          ))}
        </ol>
      </div> */}
      {categories.map((category, catIndex) => (
        <div key={catIndex} className={`quiz-categories cat-${catIndex + 1}`}>
          <button className="cat-element">{category}</button>
          <ol>
            {quizData[selectedIndex].content
              .filter((q) => q.category === category)
              .map((element, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleQuestionClick(catIndex * rows + index)}
                    className={`question cat-${catIndex + 1} ${
                      element.questionFinished ? "invisible" : ""
                    }`}
                  >
                    {element.points}
                  </button>
                </li>
              ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
