import { useNotes } from "@/app/hooks/useNotes";

export default function NotePlaceholder() {
  const { isLoading } = useNotes();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-64 flex items-center justify-center">
      <p className="text-gray-500">
        {isLoading ? "Loading..." : "Select a note or generate a new one"}
      </p>
    </div>
  );
}
