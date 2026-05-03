import IdeaCard from "@/components/shared/IdeaCard";

export default function Home() {
  const ideaData = {
    id: "1",
    title: "Implement Dark Mode",
    description: "Add a dark mode toggle to the application lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/dark-mode.jpg",
    isPaid: true,
    price: 9.99,
    category: { name: "UI/UX" },
    member: { name: "John Doe" },
    voteSummary: {
      upvotes: 15,
      downvotes: 2,
    },
    _count: {
      comments: 5
    }
  };
  return (
    <div className="container mx-auto p-4 space-y-4 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">


        <IdeaCard idea={ideaData} />

    </div>
  );
}
