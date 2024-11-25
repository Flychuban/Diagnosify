import React, { ReactNode, useState } from 'react';
import {
  Heart,
  Activity,
  Droplets,
  Ghost,
  Scale,
  FileHeart,
} from 'lucide-react';

type SidebarProps = {
  onSelectDisease: (index: number) => void;
  selected_option_index: number;
  options: string[];
};

const diseaseIcons: Record<string, () => ReactNode> = {
  "Cancer Segmentation": () => <FileHeart className="h-4 w-4" />,
  Diabetes: () => <Droplets className="h-4 w-4" />,
  "Heart Disease": () => <Heart className="h-4 w-4" />,
  Parkinson: () => <Activity className="h-4 w-4" />,
  "Kidney Disease": () => <Droplets className="h-4 w-4" />,
  "Breast Cancer": () => <Ghost className="h-4 w-4" />,
  Pneumonia: () => <div className="h-4 w-4" >hii</div>,
  Malaria: () => <div className="h-4 w-4" >jooo</div>,
  "Liver Disease": () => <div className="h-4 w-4">kook</div>,
  "Body Fat Percentage": () => <Scale className="h-4 w-4" />,
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