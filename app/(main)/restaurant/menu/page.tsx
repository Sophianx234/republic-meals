import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFoodLibrary } from "@/app/actions/restaurant";
import { WeeklyPlanner } from "@/components/ui/weekly-planner";
import { FoodCatalog } from "@/components/ui/food-catalog";

export const metadata: Metadata = {
  title: "Menu Management | RepublicLunch",
};

export default async function MenuManagementPage() {
  // 1. Fetch the Master Food List
  const allFoods = await getFoodLibrary();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {/* Header */}

      {/* Tabs Layout */}
      <Tabs defaultValue="planner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
          <TabsTrigger value="catalog">Food Catalog</TabsTrigger>
        </TabsList>

        {/* TAB 1: The Schedule (The Grid) */}
        <TabsContent value="planner" className="space-y-4">
          <WeeklyPlanner allFoods={allFoods} />
        </TabsContent>

        {/* TAB 2: The Library (Uploads) */}
        <TabsContent value="catalog" className="space-y-4">
          <FoodCatalog initialFoods={allFoods} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
