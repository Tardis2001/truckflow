import React, { useEffect, useState } from "react";
import { MorphingText } from "./MorphingText";

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(); // Notifica quando a splash termina
    }, 4000); // Splash screen visível por 3 segundos

    return () => clearTimeout(timer); // Cleanup do timer
  }, [onComplete]);

  if (!isVisible) {
    return null; // Remove a splash screen após o tempo
  }
  const texts = ["Seja bem vindo", "Carregando...", "Gerenciando Caminhões..."];
  return (
    <>
      <div className="bg-zinc-950 h-screen w-screen flex items-center justify-center">
        <MorphingText className="text-white" texts={texts} />;
      </div>
    </>
  );
};

export default SplashScreen;
