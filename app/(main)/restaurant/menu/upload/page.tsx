import { getFoodLibrary } from "@/app/actions/restaurant";
import { FoodCatalog } from "@/components/ui/food-catalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Menu | RepublicLunch",
};
async function page() {
  const allFoods = await getFoodLibrary();
  return (
    <div>
      <FoodCatalog initialFoods={allFoods} />
    </div>
  );
}

export default page;
