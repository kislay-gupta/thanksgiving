import FeedPosts from "@/components/feed/FeedPage";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <main className="w-full mx-auto px-4 py-4  lg:max-w-4xl">
        <div className="flex gap-y-4  flex-col sm:flex-row ">
          <FeedPosts />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
