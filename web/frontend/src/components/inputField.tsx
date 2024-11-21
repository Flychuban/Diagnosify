import FileInput from "./FileInput";

export const InputField: React.FC<{
  label: string;
  value: number | File | null;
  onChange: (value: number | File | null) => void;
}> = ({ label, value, onChange }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(+e.target.value);
  };

  return (
    <div className="my-4">
      <div>
        <label className="mb-2 block">{label}:</label>
      </div>
      <div>
        {!(typeof value === "number") ? (
          <FileInput value={value} onChange={onChange} callback={() => {}}/>
        ) : (
          <input
            className="w-32 rounded border border-secondary bg-secondary p-2"
            type="number"
            value={value}
            onChange={handleNumberChange}
          />
        )}
      </div>
    </div>
  );
};
