import { FC } from "react";
import DropDown from "../DropDown";
import { LANGUAGES } from "@/constants";
import { Language } from "@/types";

const LanguageSelector: FC = () => {
  const languages: string[] = LANGUAGES.map(
    (language: Language) => language.name ?? ""
  );

  return <DropDown options={languages}  />;
};

export default LanguageSelector;
