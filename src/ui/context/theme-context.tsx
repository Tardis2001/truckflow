import { ThemeProvider } from "../components/theme-provider";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

export default function ThemeContextProvider(
  { ...props },
  { children }: ThemeContextProviderProps
) {
  return (
    <ThemeProvider defaultTheme={props.defaultTheme} storageKey="vite-ui-theme">{children}</ThemeProvider>
  );
}
