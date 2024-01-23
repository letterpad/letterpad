'use client'; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mt-36 flex flex-col items-center justify-center font-mono">
      <h2>Sorry, we could not load this post.</h2>
      <pre>Something went wrong!</pre>
    </div>
  );
}
