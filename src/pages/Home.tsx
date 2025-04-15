import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/loaders";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["homeData"],
    queryFn: () => getJSON("http://localhost:3000"),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>
      <p className="mb-4">Welcome to our app built with React Router</p>

      {isLoading && <p className="mb-4">Loading data...</p>}
      {error && (
        <p className="mb-4 text-red-500">Error loading data: {error.message}</p>
      )}
      {data && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Data from API:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-4">
        <Button asChild>
          <Link to="/about">Go to About</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
