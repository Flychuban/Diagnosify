// pages/dynamic-component.tsx
import React, { useState } from "react";

// Define the types for the component
type ComponentType = "ComponentA" | "ComponentB";

const DynamicComponent: React.FC = () => {
  // State to hold the selected type
  const [type, setType] = useState<ComponentType>("ComponentA");

  // Array of possible types
  const types: ComponentType[] = ["ComponentA", "ComponentB"];

  // Function to handle type selection
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as ComponentType);
  };

  // Components to render based on the selected type
  const ComponentA = () => <div>Component A is selected</div>;
  const ComponentB = () => <div>Component B is selected</div>;

  return (
    <div>
      <label htmlFor="type-select">Choose a component:</label>
      <select id="type-select" value={type} onChange={handleTypeChange}>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicComponent;
