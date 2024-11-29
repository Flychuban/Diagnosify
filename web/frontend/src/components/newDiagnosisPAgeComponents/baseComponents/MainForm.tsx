export interface MainFormProps<T> {
  title: string;
  onSubmit: (formData: any) => Promise<void>;
  children: React.ReactNode;
  isLoading: boolean;
  responseMessage: T | null;
  componentToDisplayPrediction: (data: T) => React.ReactNode;
}

export const MainForm = <T,>({
  title,
  onSubmit,
  children,
  isLoading,
  responseMessage,
  componentToDisplayPrediction,
}: MainFormProps<T>) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <div className="rounded-lg bg-secondary p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-md px-4 py-2 text-lg text-white transition duration-300 ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
