import { getLetterpadCategories } from "@/components/website_v2/data";
import { Topics } from "@/components/website_v2/topics";

const TopicsPage = async () => {
  const response = await getLetterpadCategories();
  const topics = response?.popularTags?.rows;
  return (
    <div className="flex flex-col py-10">
      <h1 className="text-xl py-10 text-center font-heading">
        Explore what matters to you
      </h1>
      <Topics topics={topics!} />
    </div>
  );
};

export default TopicsPage;
