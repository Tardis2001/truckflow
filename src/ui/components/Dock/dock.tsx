import {
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
    type SpringOptions,
    AnimatePresence,
} from "motion/react";
import {
    Children,
    cloneElement,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { cn } from "../../util/motion";
const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

export type DockProps = {
    children: React.ReactNode;
    className?: string;
    distance?: number;
    panelHeight?: number;
    magnification?: number;
    spring?: SpringOptions;
};

export type DockItemProps = {
    className?: string;
    children: React.ReactNode;
};

export type DockLabelProps = {
    className?: string;
    children: React.ReactNode;
};

export type DockIconProps = {
    className?: string;
    children: React.ReactNode;
};

export type DocContextType = {
    mouseX: MotionValue;
    spring: SpringOptions;
    magnification: number;
    distance: number;
};

export type DockProviderProps = {
    children: React.ReactNode;
    value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
    return (
        <DockContext.Provider value={value}>{children}</DockContext.Provider>
    );
}

function useDock() {
    const context = useContext(DockContext);
    if (!context) {
        throw new Error("useDock must be used within an DockProvider");
    }
    return context;
}

function Dock({
    children,
    className,
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
    const mouseY = useMotionValue(Infinity);
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const maxHeight = useMemo(() => {
        return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
    }, [magnification]);

    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);
    const distanceThreshold = distance + 50;

    const opacity = useTransform(isHovered, [0, 1], [0, 1]);

    useEffect(() => {
        const handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
            mouseX.set(pageX);
            mouseY.set(pageY);

            const dockRect = document
                .getElementById("dock")
                ?.getBoundingClientRect();
            if (dockRect) {
                const distX = Math.abs(
                    pageX - dockRect.left - dockRect.width / 2
                );
                const distY = Math.abs(
                    pageY - dockRect.top - dockRect.height / 2
                );
                const distanceToDock = Math.sqrt(distX ** 2 + distY ** 2) - 100;

                if (distanceToDock < distanceThreshold) {
                    setIsVisible(true);
                    isHovered.set(1);
                } else {
                    setIsVisible(false);
                    isHovered.set(0);
                }
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [distanceThreshold, mouseX, mouseY, isHovered]);
    const handleMouseEnter = () => {
        setIsHovering(true);
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    return (
        <AnimatePresence>
            <motion.div
                id="dock"
                style={{
                    height: "100px",
                }}
                className="mx-2 flex max-w-full items-end"
                initial={{ opacity: 0, y: -30 }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                    y: isHovering ? -30 : 30,
                }}
                exit={{
                    opacity: 0,
                    y: 30,
                    transition: { duration: 0.8 },
                }}
                transition={{
                    opacity: { duration: 0.3 },
                    y: { duration: 0.4 },
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    onMouseMove={({ pageX }) => {
                        isHovered.set(1);
                        mouseX.set(pageX);
                    }}
                    onMouseLeave={() => {
                        isHovered.set(0);
                        mouseX.set(Infinity);
                    }}
                    className={cn(
                        "mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900",
                        className
                    )}
                    style={{ height: panelHeight }}
                    role="toolbar"
                    aria-label="Application dock"
                >
                    <DockProvider
                        value={{ mouseX, spring, distance, magnification }}
                    >
                        <motion.div
                            onMouseMove={({ pageX }) => {
                                isHovered.set(1);
                                mouseX.set(pageX);
                            }}
                            onMouseLeave={() => {
                                isHovered.set(0);
                                mouseX.set(Infinity);
                            }}
                            className={cn(
                                "mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900",
                                className
                            )}
                            style={{ height: panelHeight }}
                            role="toolbar"
                            aria-label="Application dock"
                        >
                            {children}
                        </motion.div>
                    </DockProvider>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function DockItem({ children, className }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { distance, magnification, mouseX, spring } = useDock();

    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, (val) => {
        const domRect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: 0,
        };
        return val - domRect.x - domRect.width / 2;
    });

    const widthTransform = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [40, magnification, 40]
    );

    const width = useSpring(widthTransform, spring);

    return (
        <motion.div
            ref={ref}
            style={{ width, zIndex: 1 }}
            onMouseEnter={() => isHovered.set(1)} // Altere para onMouseEnter para ativar quando realmente estiver sobre o item
            onMouseLeave={() => isHovered.set(0)} // Remove o hover quando o mouse sair do item
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            className={cn(
                "relative inline-flex items-center justify-center",
                className
            )}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, (child) =>
                cloneElement(child as React.ReactElement, { width, isHovered })
            )}
        </motion.div>
    );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
    const restProps = rest as Record<string, unknown>;
    const isHovered = restProps["isHovered"] as MotionValue<number>;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = isHovered.on("change", (latest) => {
            setIsVisible(latest === 1);
        });

        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white",
                        className
                    )}
                    role="tooltip"
                    style={{ x: "-50%" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
    const restProps = rest as Record<string, unknown>;
    const width = restProps["width"] as MotionValue<number>;

    const widthTransform = useTransform(width, (val) => val / 2);

    return (
        <motion.div
            style={{ width: widthTransform }}
            className={cn("flex items-center justify-center", className)}
        >
            {children}
        </motion.div>
    );
}

export { Dock, DockIcon, DockItem, DockLabel };
function setIsHovering(arg0: boolean) {
    throw new Error("Function not implemented.");
}
