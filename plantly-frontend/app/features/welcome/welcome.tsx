import { Link } from "react-router";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="bg-background text-foreground">
          Hello, green world! 🌿
        </div>

        <Link to="/login" className="text-xl font-bold btn-primary hidden md:block">
          Login
        </Link>

      </div>
    </main>
  );
}

