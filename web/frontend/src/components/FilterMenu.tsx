import React, { ReactNode } from "react";

const Filter: React.FC<{
  options: ReactNode[];
  indexOfSelectedOption: number;
  setSelectedOption: (idx: number) => void;
}> = ({ options, setSelectedOption, indexOfSelectedOption }) => {
  return (
    <div className="filter-container bg-secondary p-4 rounded-md">
      {options.map((option, idx) => (
        <button
          key={idx}
          className={`filter-option px-4 py-2 m-2 rounded-md 
          ${
            indexOfSelectedOption === idx
              ? "text-primarytext bg-primary"
              : "text-primarytext bg-secondary"
          } 
          hover:bg-primary transition-colors`}
          onClick={() => setSelectedOption(idx)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const FilterOption: React.FC<{ name: string }> = ({ name }) => {
  return <span>{name}</span>;
};

export const FeedFilter: React.FC<{
  options: string[];
  indexOfSelectedElement: number;
  setIndexOfSelectedElements: (idx: number) => void;
}> = ({ indexOfSelectedElement, setIndexOfSelectedElements, options }) => {
  return (
    <div className="feed-filter">
      <Filter
        options={options.map((option) => (
          <FilterOption key={option} name={option} />
        ))}
        indexOfSelectedOption={indexOfSelectedElement}
        setSelectedOption={setIndexOfSelectedElements}
      />
    </div>
  );
};
