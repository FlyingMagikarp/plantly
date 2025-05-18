
export function StyleDisplay() {
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
            <button className="btn-delete">Cancel</button>
          </div>
        </div>
      </div>
      <div>
        <button className="btn-primary">Save</button>
        <button className="btn-secondary">Cancel</button>
        <button className="btn-delete">Delete</button>
        <a href="/plants" className="btn-primary inline-block text-center">Go to Plants</a>

        <label className="block text-sm font-medium mb-1">Plant Name</label>
        <input type="text" className="input-field w-full" placeholder="E.g., Ficus Elastica"/>
      </div>

      <div className="min-h-screen bg-theme p-6 text-theme space-y-12">
        <h1 className="text-3xl font-bold">UI Style Guide</h1>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-delete">Delete Button</button>
            <button className="btn-link">Link Styled Button</button>
          </div>
        </section>

        {/* Input Fields */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Input Fields</h2>
          <div className="space-y-4 max-w-md">
            <input
              className="input-field"
              placeholder="Text input"
              type="text"
            />
            <input
              className="input-field"
              placeholder="Email address"
              type="email"
            />
            <textarea
              className="input-field"
              placeholder="Textarea"
              rows={3}
            ></textarea>
          </div>
        </section>

        {/* Card */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Card</h2>
          <div className="card max-w-md">
            <h3 className="text-lg font-medium mb-2">Example Card</h3>
            <p className="text-muted mb-4">
              This is a card component. It uses a soft background, border, and spacing for clarity.
            </p>
            <button className="btn-primary">Card Action</button>
          </div>
        </section>

        {/* Navbar Items */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Navbar Items</h2>
          <nav className="flex gap-4 bg-[var(--color-secondary-bg)] p-4 rounded-md">
            <span className="nav-item">Dashboard</span>
            <span className="nav-item">Plants</span>
            <span className="nav-item">Care Log</span>
            <span className="nav-item">Settings</span>
          </nav>
        </section>
      </div>
    </main>
  );
}

