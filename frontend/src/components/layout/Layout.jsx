import { Navbar } from './Navbar';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
