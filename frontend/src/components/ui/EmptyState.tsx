interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-20">
      <div className="mb-4 rounded-full bg-gray-100 p-4">📭</div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}