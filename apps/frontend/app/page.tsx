import { VotingInterface } from "@/components/voting-interface";

export default function HomePage() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-zinc-900 focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        role="main"
        aria-label="Character voting interface"
        className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-[#0a0a0a] dark:to-[#0f0f0f]"
      >
        <div className="container mx-auto px-4 py-8 md:py-16">
          <VotingInterface />
        </div>
      </main>
    </>
  );
}
