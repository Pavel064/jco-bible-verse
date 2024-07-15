import { NextUIProvider } from "@nextui-org/react";

import VerseDisplay from "./components/VerseDisplay";
import AuthButton from "./components/AuthButton";

const App = () => {
  return (
    <NextUIProvider>
      <div className="flex flex-col justify-center items-center min-h-screen max-w-7xl mx-auto px-10 gap-10 font-sans text-indigo-50">
        <p className="text-4xl opacity-40">Verse of Today</p>
        <VerseDisplay />
        <AuthButton />
      </div>
    </NextUIProvider>
  );
};

export default App;
