import React from 'react';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Lungs, 
  Ghost, 
  Virus, 
  Bacteria, 
  Skull,
  Scale,
  FileHeart
} from 'lucide-react';

type SidebarProps = {
  onSelectDisease: (index: number) => void;
  selected_option_index: number;
  options: string[];
};

const diseaseIcons = {
  'Cancer Segmentation': <FileHeart className="h-4 w-4" />,
  'Diabetes': <Droplets className="h-4 w-4" />,
  'Heart Disease': <Heart className="h-4 w-4" />,
  'Parkinson': <Activity className="h-4 w-4" />,
  'Kidney Disease': <Droplets className="h-4 w-4" />,
  'Breast Cancer': <Ghost className="h-4 w-4" />,
  'Pneumonia': <Lungs className="h-4 w-4" />,
  'Malaria': <Virus className="h-4 w-4" />,
  'Liver Disease': <Bacteria className="h-4 w-4" />,
  'Body Fat Percentage': <Scale className="h-4 w-4" />
};
// ```
// <div className="w-64 bg-[#12141c] p-4">
        
//         <div className="space-y-1">
//           {allPredictions.map((prediction, index) => (
//             <button
//               key={prediction.type}
//               onClick={() => handleSelectDisease(index)}
//               className={`w-full rounded-lg px-4 py-2 text-left text-sm ${
//                 current === index
//                   ? "bg-red-500 text-white"
//                   : "text-gray-300 hover:bg-[#1a1b1e]"
//               }`}
//             >
//               {prediction.type}
//             </button>
//           ))}
//         </div>
//       </div>
// ```
export const Sidebar: React.FC<SidebarProps> = ({
  onSelectDisease,
  options,
  selected_option_index
}) => {
  return (
    <div className="w-64 bg-[#262730] p-4 test-white">
      <div className="mb-6">
        <h3 className="mb-2 px-4 text-sm font-medium text-gray-400">Disease Prediction</h3>
        <p className="mb-4 px-4 text-xs text-gray-500">Select the disease you want to predict</p>
      </div>

      <div className="space-y-1 bg-[#12141c] p-2 rounded-2xl">
        <h1>Select Disease</h1>
        <hr/>
        {options.map((disease, index) => (
          <button
            key={disease}
            onClick={() => onSelectDisease(index)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm transition-colors ${
              selected_option_index === index
                ? "bg-red-500 text-white"
                : "text-gray-300 hover:bg-[#1a1b1e]"
            }`}
          >
            <span className="flex items-center justify-center">
              {diseaseIcons[disease]}
            </span>
            {disease}
          </button>
        ))}
      </div>
    </div>
  );
};