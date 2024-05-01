import { getLetterpadCategories } from "@/components/website_v2/data";
import { Topics } from "@/components/website_v2/topics";

const TopicsPage = async () => {
  const response = await getLetterpadCategories();
  const topics = response?.popularTags?.rows;
  return (
    <div>
      <Topics topics={topics!} />
    </div>
  );
};

export default TopicsPage;
