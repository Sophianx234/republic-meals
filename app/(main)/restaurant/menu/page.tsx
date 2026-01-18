import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFoodLibrary, getMenuHistory } from "@/app/actions/restaurant";
import { WeeklyPlanner } from "@/components/ui/weekly-planner";
import { FoodCatalog } from "@/components/ui/food-catalog";
import { MenuHistory } from "@/components/ui/menu-history";
import { startOfMonth, endOfMonth } from "date-fns";

export const metadata: Metadata = {
  title: "Menu Management | RepublicLunch",
};

// 1. Update the type definition to be a Promise
export default async function MenuManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Await the params before using them
  const params = await searchParams;

  // 3. Fetch Food Library
  const allFoods = await getFoodLibrary();

  // 4. Resolve Filter Params (using 'params' now, not 'searchParams')
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Safe check: handle "0" index for January correctly
  const year = params.year ? Number(params.year) : currentYear;
  const month = params.month ? Number(params.month) : currentMonth;

  // 5. Calculate Date Range
  const date = new Date(year, month);
  const from = startOfMonth(date).toISOString();
  const to = endOfMonth(date).toISOString();

  // 6. Fetch History Data
  const historyData = await getMenuHistory(from, to);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      

      <Tabs defaultValue="planner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
          <TabsTrigger value="catalog">Food Catalog</TabsTrigger>
          <TabsTrigger value="menu-history">Menu History</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-4">
          <WeeklyPlanner allFoods={allFoods} />
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <FoodCatalog initialFoods={allFoods} />
        </TabsContent>

        <TabsContent value="menu-history" className="space-y-4">
          <MenuHistory 
            initialData={historyData} 
            selectedYear={year.toString()} 
            selectedMonth={month.toString()} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}