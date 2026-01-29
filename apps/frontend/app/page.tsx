import { VotingInterface } from "@/components";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <VotingInterface />
      </div>
    </main>
  );
}
