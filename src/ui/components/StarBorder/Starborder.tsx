import { useEffect, useRef, useState } from "react";
import "./StarBorder.css";
import { motion, useMotionValue, useSpring } from "motion/react";
const SPRING_CONFIG = { damping: 100, stiffness: 400 };

type MagneticButtonType = {
    children: React.ReactNode;
    distance?: number;
};

const StarBorder = (
    { className = "", color = "white", speed = "6s", children, ...rest },
    { distance = 0.6 }: MagneticButtonType
) => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, SPRING_CONFIG);
    const springY = useSpring(y, SPRING_CONFIG);

    useEffect(() => {
        const calculateDistance = (e: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;

                if (isHovered) {
                    x.set(distanceX * distance);
                    y.set(distanceY * distance);
                } else {
                    x.set(0);
                    y.set(0);
                }
            }
        };

        document.addEventListener("mousemove", calculateDistance);

        return () => {
            document.removeEventListener("mousemove", calculateDistance);
        };
    }, [ref, isHovered]);

    return (
        <motion.div
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                x: springX,
                y: springY,
            }}
        >
            <button className={`star-border-container ${className}`} {...rest}>
                <div
                    className="border-gradient-bottom"
                    style={{
                        background: `radial-gradient(circle, ${color}, transparent 10%)`,
                        animationDuration: speed,
                    }}
                ></div>
                <div
                    className="border-gradient-top"
                    style={{
                        background: `radial-gradient(circle, ${color}, transparent 10%)`,
                        animationDuration: speed,
                    }}
                ></div>
                <div className="inner-content">{children}</div>
            </button>
        </motion.div>
    );
};

export default StarBorder;
