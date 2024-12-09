import React, { ReactNode } from "react"

const Filter: React.FC<{ options: ReactNode[], indexOfSelectedOption: number, setSelectedOption: (idx: number) => void }> = ({ options,setSelectedOption, indexOfSelectedOption }) => {
    return (
        <div>
            {options.map((option,idx) => {
                return (
                    <button
                        key={idx}
                        className={`filter-option ${indexOfSelectedOption === options.indexOf(option)? 'selected' : ''}`}
                        onClick={() => {
                           setSelectedOption(idx) 
                        }}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    )
}


const FilterOption: React.FC<{ name: string }> = ({name }) => {
    return (
        <div>
            {name}
        </div>
    )
}


export const FeedFilter: React.FC<{ options: string[] ,indexOfSelectedElement: number, setIndexOfSelectedElements: (idx: number) => void}> = ({indexOfSelectedElement, setIndexOfSelectedElements, options}) => {
    return <div>
        <Filter
            options={options.map((option) => {
                return <FilterOption key={option} name={option} />
            })}
            indexOfSelectedOption={indexOfSelectedElement}
            setSelectedOption={setIndexOfSelectedElements}
        />
    </div>
}