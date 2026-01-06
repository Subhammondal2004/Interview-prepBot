import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <main className="pt-16">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
