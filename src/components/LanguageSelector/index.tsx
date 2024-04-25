import { FC } from "react";
import DropDown from "../DropDown";
import { LANGUAGES } from "@/constants";
import { Language } from "@/types";
import { useGlobalContext } from "@/contexts/useGlobalContext";

const LanguageSelector: FC = () => {
  const { language, setLanguage } = useGlobalContext();
  const languages: string[] = LANGUAGES.map(
    (language: Language) => language.name ?? ""
  );

  return (
    <DropDown
      defaultValue={language}
      onChange={(value: string) => {setLanguage?.(value);}}
      options={languages}
    />
  );
};

export default LanguageSelector;
