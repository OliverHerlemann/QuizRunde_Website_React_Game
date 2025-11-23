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

export default function AppLayerTwo() {
  const { quizData } = useQuizData();
  const [playerCount, setPlayerCount] = useState(1);
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
  const [soundOn, setSoundOn] = useState(true);
  const [pointStealerFactor, setPointStealerFactor] = useState(33);

  const modalRef = useRef();
  const settingModalRef = useRef();
  const winnerModalRef = useRef();
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
  const showSettingsModal = () => settingModalRef.current?.showModal();
  const closeSettingsModal = () => settingModalRef.current?.close();
  const showWinnerModal = () => winnerModalRef.current?.showModal();
  const closeWinnerModal = () => winnerModalRef.current?.close();

  return (
    <div className="App">
      <Header
        quizActive={activeIs}
        playerOne={playerOne}
        playerTwo={playerTwo}
        playerCount={playerCount}
        setSoundOn={setSoundOn}
        soundOn={soundOn}
      />
      <main>
        <QuizSelectionModal ref={modalRef} />
        <SettingModal
          ref={settingModalRef}
          setPointStealerFactor={setPointStealerFactor}
          pointStealerFactor={pointStealerFactor}
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
        {!activeIs && (
          <Settings
            showModal={showModal}
            showSettingsModal={showSettingsModal}
            playerOne={playerOne}
            playerTwo={playerTwo}
            setPlayerOne={setPlayerOne}
            setPlayerTwo={setPlayerTwo}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            setPointStealerFactor={setPointStealerFactor}
            pointStealerFactor={pointStealerFactor}
          />
        )}
        {activeIs && selectedQuestion === -1 ? (
          <QuizOverview />
        ) : (
          selectedQuestion > -1 && (
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
      </main>
      <footer>
        <ImpressumAndD />
      </footer>
    </div>
  );
}
