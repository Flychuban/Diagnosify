import React, { ReactNode, useState } from 'react';
import {
  Heart,
  Activity,
  Droplets,
  Ghost,
  Scale,
  FileHeart,
} from 'lucide-react';
import { Kidneys, Liver, Lungs, Malaria } from './icons/icons';
import { Disease } from '~/utils/types';

type SidebarProps = {
  onSelectDisease: (index: number) => void;
  selected_option_index: number;
  options: Disease[];
};

const diseaseIcons: Record<Disease, () => ReactNode> = {
  "cancer Segmentation": () => <FileHeart className="h-4 w-4" />,
  "diabetes": () => <Droplets className="h-4 w-4" />,
  "heart Disease": () => <Heart className="h-4 w-4" />,
  "parkinson": () => <Activity className="h-4 w-4" />,
  "kidney Disease": () => <Kidneys/>,
  "breast Cancer": () => <Ghost className="h-4 w-4" />,
  "pneumonia": () => <Lungs/>,
  "malaria": () => <Malaria/>,
  "liver disease": () =><Liver/> ,
  "bodyfat": () => <Scale className="h-4 w-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectDisease,
  options,
  selected_option_index,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg hover:bg-blue-600"
      >
        Open Menu
      </button>
    );
  }

  return (
    <div className="w-64 bg-secondary p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold">Disease Prediction</span>
        <button
          className="rounded-full p-2 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="mb-6 text-sm text-gray-300">
        Select the disease you want to predict
      </div>

      <div className="flex flex-col space-y-2">
        {options.map((disease, index) => {
          const Icon = diseaseIcons[disease];

          return (
            <button
              key={disease}
              onClick={() => onSelectDisease(index)}
              aria-pressed={selected_option_index === index}
              className={`flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm transition-colors ${
                selected_option_index === index
                  ? "bg-red-500 font-bold text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              <span>{Icon ? Icon() : <Scale className="h-4 w-4" />}</span>
              <span>{selected_option_index === index ? <b>{disease}</b> : disease}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
;