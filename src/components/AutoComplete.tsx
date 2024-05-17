// Autocomplete.tsx
import { Input } from "@nextui-org/react";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { RefObject, useEffect, useState } from "react";

export interface Option {
  name: string;
  value: string;
  // Add other details here...
}

interface AutocompleteProps {
  options: Option[];
  loadOptions?: () => Promise<Option[]>;
  showClearButton?: boolean;
  label?: string;
  placeholder?: string;
  selectedOption: Option | null | undefined;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option | null>>;
  onSelectionChange?: (option: Option | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  loadOptions,
  showClearButton = false,
  label,
  placeholder,
  setSelectedOption,
  onSelectionChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const ref = useClickAway(() => {
    setIsFocused(false);
  });

  useEffect(() => {
    if (loadOptions) {
      setLoading(true);
      loadOptions()
        .then((options) => {
          setFilteredOptions(options);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setFilteredOptions(options);
    }
  }, [options, loadOptions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredOptions(filteredOptions);
  };
  const handleOptionClick = (option: Option) => {
    setInputValue(option.name);
    setFilteredOptions([option]);
    setIsFocused(false);
    setSelectedOption(option);
    if (typeof onSelectionChange === "function") {
      onSelectionChange(option);
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setFilteredOptions(options);
    setIsFocused(false);
    setSelectedOption(null);
    if (typeof onSelectionChange === "function") {
      onSelectionChange(null);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        label={label}
        labelPlacement="outside"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          setIsFocused(true);
        }}
        // onBlur={() => setIsFocused(false)}
        // className="w-full rounded-xl border bg-zinc-100 p-2"
      />
      {showClearButton && inputValue && (
        <button
          onClick={handleClearInput}
          className="absolute right-2 top-8 rounded-2xl bg-zinc-900 px-2 py-1 text-xs font-semibold text-white"
        >
          Clear
        </button>
      )}
      <AnimatePresence>
        {loading ? (
          <div>Loading...</div>
        ) : (
          isFocused && (
            <motion.ul
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.4,
              }}
              initial={{ scale: 0.75, opacity: 0.75 }}
              animate={{
                opacity: 1,
                scale: 1,
                // transition: {
                //   duration: 0.2,
                // },
              }}
              exit={{
                scale: 0.65,
                opacity: 0,
                // transition: {
                //   duration: 0.15,
                // },
              }}
              layout="position"
              ref={ref as RefObject<HTMLUListElement> | undefined}
              className="absolute z-[999] mt-2.5 max-h-[300px] w-full origin-top overflow-hidden overflow-y-auto rounded-2xl border bg-white p-2 shadow-xl scrollbar-hide"
            >
              {filteredOptions.map((option) => (
                <motion.li
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className="cursor-pointer rounded-xl p-2 text-sm font-medium hover:bg-gray-200"
                >
                  {option.name}
                </motion.li>
              ))}
              {filteredOptions.length === 0 && (
                <motion.li className="cursor-pointer rounded-xl p-2 text-sm font-medium hover:bg-gray-200">
                  Not found
                </motion.li>
              )}
            </motion.ul>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Autocomplete;
