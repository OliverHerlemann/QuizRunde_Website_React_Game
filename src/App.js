import "./styles.css";
import QuizDataProvider from "./components/QuizDataProvider.jsx";
import AppLayerTwo from "./AppLayerTwo.jsx";

export default function App() {
  return (
    <QuizDataProvider>
      <AppLayerTwo />
    </QuizDataProvider>
  );
}
