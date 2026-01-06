import Header from "./components/Header.jsx";
import Settings from "./components/Settings.jsx";
import SettingModal from "./components/SettingModal.jsx";
import WinnerModal from "./components/WinnerModal.jsx";
import { useQuizData } from "./components/QuizDataProvider.jsx";
import QuizSelectionModal from "./components/QuizSelectionModal.jsx";
import { useRef, useState } from "react";
import QuizOverview from "./components/QuizOverview.jsx";
import QuestionWithAnswers from "./components/QuestionsWithAnswers.jsx";
import ImpressumAndD from "./components/ImpressumAndD.jsx";
import QuestionTimerModal from "./components/QuestionTimerModal.jsx";
import WannWarEsSettingsModal from "./components/WannWarEsSettingsModal.jsx";
import WannWarEsEreignis from "./components/WannWarEsEreignis.jsx";
import WannWarEsTimeline from "./components/WannWarEsTimeline.jsx";
import { WannWarEsData } from "./WannWarEsData.jsx";
import WannWarEsWinnerModal from "./components/WannWarEsWinnerModal.jsx";

export default function AppLayerTwo() {
  const { quizData } = useQuizData();
  const [playerCount, setPlayerCount] = useState(1);
  const [questionTime, setQuestionTime] = useState(null);
  const [playerOne, setPlayerOne] = useState({
    name: "Spieler 1",
    points: 0,
    selectedAnswer: null,
    isTimeToAnswer: true,
  });
  const [playerTwo, setPlayerTwo] = useState({
    name: "Spieler 2",
    points: 0,
    selectedAnswer: null,
    isTimeToAnswer: false,
    isSet: false,
  });

  const zufallsIndexPlayerOne = Math.floor(
    Math.random() * WannWarEsData.length
  );
  let zufallsIndexPlayerTwo;
  do {
    zufallsIndexPlayerTwo = Math.floor(Math.random() * WannWarEsData.length);
  } while (zufallsIndexPlayerTwo === zufallsIndexPlayerOne);

  const [activePlayer, setActivePlayer] = useState("playerOne");
  const [quizModus, setQuizModus] = useState(undefined);
  const [startQuiz, setStartQuiz] = useState(undefined);
  const [soundOn, setSoundOn] = useState(true);
  const [pointStealerFactor, setPointStealerFactor] = useState(25);
  const [ereignis, setEreignis] = useState(null);
  const [ereignisArrays, setEreignisArrays] = useState({
    playerOne: [-1, zufallsIndexPlayerOne, -1],
    playerTwo: [-1, zufallsIndexPlayerTwo, -1],
  });
  const [ereignisTrigger, setEreignisTrigger] = useState(0);

  const modalRef = useRef();
  const WannWarEsModalRef = useRef();
  const settingModalRef = useRef();
  const winnerModalRef = useRef();
  const WannWarEswinnerModalRef = useRef();
  const questionTimerModalRef = useRef();
  const activeIndex = quizData.findIndex((item) => item.quizStarted === true);
  const selectedIndex = quizData.findIndex((data) => data.isSelected === true);
  const selectedQuestion =
    selectedIndex !== -1 && quizData[selectedIndex].content
      ? quizData[selectedIndex].content.findIndex(
          (data) => data.questionIsActive === true
        )
      : -1;
  let activeIs = activeIndex !== -1;

  const showModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();
  const showWannWarEsModal = () => WannWarEsModalRef.current?.showModal();
  const closeWannWarEsModal = () => WannWarEsModalRef.current?.close();
  const showSettingsModal = () => settingModalRef.current?.showModal();
  const closeSettingsModal = () => settingModalRef.current?.close();
  const showWinnerModal = () => winnerModalRef.current?.showModal();
  const closeWinnerModal = () => winnerModalRef.current?.close();
  const showWWEWinnerModal = () => WannWarEswinnerModalRef.current?.showModal();
  const closeWWEWinnerModal = () => WannWarEswinnerModalRef.current?.close();
  const showQuestionTimerModal = () =>
    questionTimerModalRef.current?.showModal();
  const closeQuestionTimerModal = () => questionTimerModalRef.current?.close();

  return (
    <div className="App">
      <div class="bg-pattern"></div>
      <Header
        quizActive={activeIs}
        playerOne={playerOne}
        playerTwo={playerTwo}
        playerCount={playerCount}
        setSoundOn={setSoundOn}
        soundOn={soundOn}
        startQuiz={startQuiz}
      />
      <main>
        <QuizSelectionModal ref={modalRef} setQuizModus={setQuizModus} />
        <WannWarEsSettingsModal
          ref={WannWarEsModalRef}
          setQuizModus={setQuizModus}
        />
        <SettingModal
          ref={settingModalRef}
          setPointStealerFactor={setPointStealerFactor}
          pointStealerFactor={pointStealerFactor}
        />
        <QuestionTimerModal
          ref={questionTimerModalRef}
          setQuestionTime={setQuestionTime}
          questionTime={questionTime}
        />
        <WinnerModal
          ref={winnerModalRef}
          playerOne={playerOne}
          playerTwo={playerTwo}
          playerCount={playerCount}
          setPlayerOne={setPlayerOne}
          setPlayerTwo={setPlayerTwo}
          soundOn={soundOn}
        />
        <WannWarEsWinnerModal
            ref={WannWarEswinnerModalRef}
            playerCount={playerCount}
            playerOne={playerOne}
            playerTwo={playerTwo}
            setPlayerOne={setPlayerOne}
            setPlayerTwo={setPlayerTwo}
            soundOn={soundOn}
        />
        {!startQuiz && !activeIs && (
          <Settings
            showModal={showModal}
            showWannWarEsModal={showWannWarEsModal}
            showSettingsModal={showSettingsModal}
            showQuestionTimerModal={showQuestionTimerModal}
            playerOne={playerOne}
            playerTwo={playerTwo}
            setPlayerOne={setPlayerOne}
            setPlayerTwo={setPlayerTwo}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            setPointStealerFactor={setPointStealerFactor}
            pointStealerFactor={pointStealerFactor}
            questionTime={questionTime}
            quizModus={quizModus}
            setStartQuiz={setStartQuiz}
          />
        )}
        {activeIs && quizModus === null && selectedQuestion === -1 ? (
          <QuizOverview />
        ) : (
          selectedQuestion > -1 &&
          quizModus === null && (
            <QuestionWithAnswers
              playerOne={playerOne}
              setPlayerOne={setPlayerOne}
              playerTwo={playerTwo}
              setPlayerTwo={setPlayerTwo}
              playerCount={playerCount}
              soundOn={soundOn}
              pointStealerFactor={pointStealerFactor}
              showWinnerModal={showWinnerModal}
            />
          )
        )}
        {quizModus === "WannWarEs" && startQuiz && (
          <>
            <WannWarEsTimeline
              playerCount={playerCount}
              ereignis={ereignis}
              setEreignis={setEreignis}
              setEreignisArrays={setEreignisArrays}
              ereignisArrays={ereignisArrays}
              setPlayerOne={setPlayerOne}
              setPlayerTwo={setPlayerTwo}
              playerOne={playerOne}
              playerTwo={playerTwo}
              setActivePlayer={setActivePlayer}
              setEreignisTrigger={setEreignisTrigger}
              showWWEWinnerModal={showWWEWinnerModal}
            />
            <WannWarEsEreignis
              ereignis={ereignis}
              setEreignis={setEreignis}
              activePlayer={activePlayer}
              ereignisArrays={ereignisArrays}
              ereignisTrigger={ereignisTrigger}
            />
          </>
        )}
      </main>
      <footer>
        <ImpressumAndD />
      </footer>
    </div>
  );
}
