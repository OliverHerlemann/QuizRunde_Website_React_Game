import { useEffect, useState } from "react";

export default function TheTimer({ questionTime, handleTimeout }) {
  const [remainingTime, setRemainingTime] = useState(questionTime);

  useEffect(() => {
    setRemainingTime(questionTime);

    const timer = setTimeout(handleTimeout, questionTime * 1000);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [questionTime, handleTimeout]);

  return (
    <>
      {questionTime !== null && (
        <p id="timer-time">Verbleibende Zeit: {remainingTime} Sekunden</p>
      )}
    </>
  );
}
