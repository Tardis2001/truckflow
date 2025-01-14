import React, { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete(); // Notifica quando a splash termina
        }, 3000); // Splash screen visível por 3 segundos

        return () => clearTimeout(timer); // Cleanup do timer
    }, [onComplete]);

    if (!isVisible) {
        return null; // Remove a splash screen após o tempo
    }
    const texts = [
        "Hello",
        "Morphing",
        "Text",
        "Animation",
        "React",
        "Component",
        "Smooth",
        "Transition",
        "Engaging",
    ];
    return (
        <>
            <MorphingText texts={texts} />;
        </>
    );
};

export default SplashScreen;
