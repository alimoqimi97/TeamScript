import { FC, useEffect, useState } from "react";
import styles from "./styles.module.scss";

export interface IDropDown {
  title?: string;
  options?: string[];
  onChange?: (value: string) => void;
  defaultValue?: string;
}

const DropDown: FC<IDropDown> = ({
  title,
  options,
  onChange,
  defaultValue = "",
}) => {
  const [value, setValue] = useState<string>("python");
  const [isShown, setIsShown] = useState<boolean>(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => setValue("python"), []);

  const handleItemSelect = (option: string) => {
    onChange?.(option);
    setValue(option);
    setIsShown(false);
  };

  const items = options?.map((option: string, index: number) => (
    <a
      href="#"
      className="text-gray-700 block px-4 py-2 text-sm"
      role="menuitem"
      tabIndex={-1}
      id="menu-item-0"
      key={index?.toString()}
      onClick={() => handleItemSelect(option)}
    >
      {option}
    </a>
  ));

  return (
    <div className={styles['drop-down']}>
      <div>
        <button
          type="button"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsShown(!isShown)}
        >
          {title ?? value}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isShown ? (
        <div
          className={styles["menu"]}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {items}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DropDown;
