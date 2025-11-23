import { useQuizData } from "./QuizDataProvider.jsx";
import { useState } from "react";

const correctAudio = new Audio("/sounds/Cha_Ching_Pixabay.mp3");
const falseAudio = new Audio(
  "/sounds/gameshow_buzzer_incorrect_buzz_zapsplat.mp3"
);
correctAudio.load();
falseAudio.load();

export default function QuestionWithAnswers({
  playerOne,
  setPlayerOne,
  playerTwo,
  setPlayerTwo,
  playerCount,
  soundOn,
  pointStealerFactor,
  showWinnerModal,
}) {
  const { quizData, setQuizData } = useQuizData();
  const [continueButton, setContinueButton] = useState(false);
  const selectedIndex = quizData.findIndex((data) => data.isSelected === true);

  const selectedQuestion =
    selectedIndex !== -1 && quizData[selectedIndex].content
      ? quizData[selectedIndex].content.findIndex(
          (data) => data.questionIsActive === true
        )
      : -1;
  const finishedQuestions = quizData[selectedIndex].content.filter(
    (q) => q.questionFinished === true
  );
  const finishedQuestionsLength = finishedQuestions.length;
  const oneLeft =
    finishedQuestions.length === quizData[selectedIndex].content.length - 1;
  let activeIs = selectedIndex !== -1;

  const [playerOneAnswer, setPlayerOneAnswer] = useState(null);
  const [playerTwoAnswer, setPlayerTwoAnswer] = useState(null);
  const [switchPlayer, setSwitchPlayer] = useState(true);
  const [showRightAnswer, setShowRightAnswer] = useState([
    null,
    null,
    null,
    null,
  ]);

  function handleAnswerClick(answer) {
    // Spieler, der gerade dran ist
    let currentPlayer = playerOne.isTimeToAnswer ? "playerOne" : "playerTwo";

    // Antwort setzen
    if (currentPlayer === "playerOne" && playerOneAnswer === null) {
      setPlayerOneAnswer(answer);
    } else if (
      currentPlayer === "playerTwo" &&
      playerTwoAnswer === null &&
      playerCount > 1
    ) {
      setPlayerTwoAnswer(answer);
    } else {
      // Wenn schon geantwortet, nichts tun
      return;
    }
    // Spieler wechseln
    if (switchPlayer) {
      setSwitchPlayer(false);
      setPlayerOne((prev) => ({
        ...prev,
        isTimeToAnswer: !prev.isTimeToAnswer,
      }));
      setPlayerTwo((prev) => ({
        ...prev,
        isTimeToAnswer: !prev.isTimeToAnswer,
      }));
    }
  }

  function handleSubmitAnswer() {
    if (
      (playerOneAnswer !== null &&
        playerTwoAnswer !== null &&
        playerCount >= 2) ||
      (playerCount === 1 && playerOneAnswer !== null)
    ) {
      const pointsToAdd =
        quizData[selectedIndex].content[selectedQuestion].points;
      const correctAnswer =
        quizData[selectedIndex].content[selectedQuestion].correctAnswer;

      if (soundOn) {
        if (
          playerOneAnswer === correctAnswer ||
          playerTwoAnswer === correctAnswer
        ) {
          correctAudio.currentTime = 0;
          correctAudio.play();
        } else {
          falseAudio.currentTime = 0;
          falseAudio.volume = 0.6;
          falseAudio.play();
        }
      }
      setShowRightAnswer((prev) => {
        // Mapping der Antworten auf Indizes
        const answerIndexMap = {
          answerA: 0,
          answerB: 1,
          answerC: 2,
          answerD: 3,
        };
        const idx = answerIndexMap[correctAnswer];
        return prev.map((value, index) => (index === idx ? true : false));
      });

      if (selectedIndex === -1 || selectedQuestion === -1) return;

      if (oneLeft) {
        if (playerOneAnswer === correctAnswer) {
          setPlayerOne((prev) => ({
            ...prev,
            points: prev.points + pointsToAdd,
          }));
        }
        if (playerTwoAnswer === correctAnswer) {
          setPlayerTwo((prev) => ({
            ...prev,
            points: prev.points + pointsToAdd,
          }));
        }
      } else {
        if (playerOneAnswer === correctAnswer) {
          setPlayerOne((prev) => ({
            ...prev,
            points:
              prev.points +
              (!playerOne.isTimeToAnswer
                ? pointsToAdd
                : Math.ceil(pointsToAdd * (pointStealerFactor / 100))),
          }));
        }
        if (playerTwoAnswer === correctAnswer) {
          setPlayerTwo((prev) => ({
            ...prev,
            points:
              prev.points +
              (!playerTwo.isTimeToAnswer
                ? pointsToAdd
                : Math.ceil(pointsToAdd * (pointStealerFactor / 100))),
          }));
        }
      }

      setQuizData((prevQuizData) => {
        const updatedQuizData = [...prevQuizData];
        const selectedQuiz = { ...updatedQuizData[selectedIndex] };

        // Update content
        const updatedContent = selectedQuiz.content.map((item, i) => ({
          ...item,
          questionFinished:
            i === selectedQuestion ? true : item.questionFinished,
        }));

        selectedQuiz.content = updatedContent;
        updatedQuizData[selectedIndex] = selectedQuiz;

        return updatedQuizData;
      });
      setContinueButton(true);
    }
  }

  function handleContinue() {
    if (finishedQuestionsLength === 25) {
      showWinnerModal();
    }
    if (playerCount < 2) {
      setPlayerOne((prev) => ({
        ...prev,
        isTimeToAnswer: !prev.isTimeToAnswer,
      }));
    }
    setSwitchPlayer(true);
    // 🎯 automatisch zurück zur Overview
    // -> indem du einfach ALLE Fragen deaktivierst
    setQuizData((prevQuizData) => {
      const updated = [...prevQuizData];
      const quiz = { ...updated[selectedIndex] };
      quiz.content = quiz.content.map((q) => ({
        ...q,
        questionIsActive: false,
      }));
      updated[selectedIndex] = quiz;
      return updated;
    });
    setContinueButton(false);
  }

  return (
    <>
      <h2 id="points-indicator">
        Kategorie:{" "}
        {activeIs && quizData[selectedIndex].content[selectedQuestion].category}{" "}
        | Mögliche Punkte:{" "}
        {activeIs && quizData[selectedIndex].content[selectedQuestion].points}
      </h2>
      <div
        className={
          selectedQuestion < 5
            ? "questionAndA cat-1"
            : selectedQuestion < 10
            ? "questionAndA cat-2"
            : selectedQuestion < 15
            ? "questionAndA cat-3"
            : selectedQuestion < 20
            ? "questionAndA cat-4"
            : "questionAndA cat-5"
        }
      >
        <h2>
          {activeIs &&
            quizData[selectedIndex].content[selectedQuestion].question}
        </h2>
        <div
          className={`outer-border ${
            playerTwoAnswer === "answerA" ? "active" : ""
          }`}
        >
          <div
            className={`inner-border ${
              playerOneAnswer === "answerA" ? "active" : ""
            }`}
          >
            <button
              className={`answer
              ${
                showRightAnswer[0] === true
                  ? "correctA"
                  : showRightAnswer[0] === false && "falseA"
              }`}
              onClick={() => handleAnswerClick("answerA")}
            >
              Antwort A:{" "}
              <strong>
                {quizData[selectedIndex].content[selectedQuestion].answerA}
              </strong>
            </button>
          </div>
        </div>
        <div
          className={`outer-border ${
            playerTwoAnswer === "answerB" ? "active" : ""
          }`}
        >
          <div
            className={`inner-border ${
              playerOneAnswer === "answerB" ? "active" : ""
            }`}
          >
            <button
              className={`answer
              ${
                showRightAnswer[1] === true
                  ? "correctA"
                  : showRightAnswer[1] === false && "falseA"
              }`}
              onClick={() => handleAnswerClick("answerB")}
            >
              Antwort B:{" "}
              <strong>
                {quizData[selectedIndex].content[selectedQuestion].answerB}
              </strong>
            </button>
          </div>
        </div>
        <div
          className={`outer-border ${
            playerTwoAnswer === "answerC" ? "active" : ""
          }`}
        >
          <div
            className={`inner-border ${
              playerOneAnswer === "answerC" ? "active" : ""
            }`}
          >
            <button
              className={`answer
              ${
                showRightAnswer[2] === true
                  ? "correctA"
                  : showRightAnswer[2] === false && "falseA"
              }`}
              onClick={() => handleAnswerClick("answerC")}
            >
              Antwort C:{" "}
              <strong>
                {quizData[selectedIndex].content[selectedQuestion].answerC}
              </strong>
            </button>
          </div>
        </div>
        <div
          className={`outer-border ${
            playerTwoAnswer === "answerD" ? "active" : ""
          }`}
        >
          <div
            className={`inner-border ${
              playerOneAnswer === "answerD" ? "active" : ""
            }`}
          >
            <button
              className={`answer
              ${
                showRightAnswer[3] === true
                  ? "correctA"
                  : showRightAnswer[3] === false && "falseA"
              }`}
              onClick={() => handleAnswerClick("answerD")}
            >
              Antwort D:{" "}
              <strong>
                {quizData[selectedIndex].content[selectedQuestion].answerD}
              </strong>
            </button>
          </div>
        </div>
      </div>
      {!continueButton && (
        <button className="submit-answer" onClick={handleSubmitAnswer}>
          Auflösen
        </button>
      )}
      {continueButton && (
        <button className="submit-answer" onClick={handleContinue}>
          Weiter
        </button>
      )}
    </>
  );
}
