import { FC } from "react";
import DropDown from "../DropDown";
import { useGlobalContext } from "@/contexts/useGlobalContext";
import { monacoThemes } from "@/constants";

const ThemeSelector: FC = () => {
  const { theme, setTheme } = useGlobalContext();

  const themes: string[] = Object.keys(monacoThemes);

  console.log("theme: ", theme);

  return (
    <DropDown
      defaultValue={theme}
      onChange={(value: string) => setTheme?.(value)}
      options={themes}
    />
  );
};

export default ThemeSelector;
