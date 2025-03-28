import Test from "@/components/Test";

export default function Home() {
  return (
    <div className="min-h-screen bg-thanksgiving-light">
      <main className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <h1>Coming Soon</h1>
        </div>
        <Test />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
