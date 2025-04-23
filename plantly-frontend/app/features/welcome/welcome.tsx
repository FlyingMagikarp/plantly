import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="bg-background text-foreground">
          Hello, green world!
        </div>
        <button className="btn-primary">
          Water Me 🌿
        </button>

        <div className="card">
          <h2 className="text-xl font-bold mb-2">Monstera Deliciosa</h2>
          <p className="mb-4 text-sm">Last watered 4 days ago.</p>

          <input
              type="text"
              placeholder="Enter note..."
              className="input-field mb-3"
          />

          <div className="flex gap-2">
            <button className="btn-primary">Mark as Watered</button>
            <button className="btn-secondary">Skip</button>
            <button className="btn-negative">Cancel</button>
          </div>
        </div>
      </div>
    </main>
  );
}

