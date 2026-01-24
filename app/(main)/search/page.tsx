import { searchGlobal } from "@/app/actions/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, Receipt, Search as SearchIcon, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | Republic Lunch",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const query = (await searchParams).q;

  if (!query) {
    redirect("/dashboard");
  }

  const { foods, orders } = await searchGlobal(query);
  const hasResults = foods.length > 0 || orders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 pt-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-gray-400" />
            Search Results
          </h1>
          <p className="text-gray-500 mt-1">
            Showing results for <span className="font-semibold text-black">"{query}"</span>
          </p>
        </div>

        {!hasResults && (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="text-gray-500">We couldn't find any meals or orders matching your search.</p>
            <Button asChild className="mt-4" variant="outline">
                <Link href="/order">Go to Menu</Link>
            </Button>
          </div>
        )}

        {/* --- SECTION 1: MENU ITEMS --- */}
        {foods.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              Menu Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foods.map((food: any) => (
                <Card key={food._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-4">
                    {/* Image Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        {food.image ? (
                           <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                        ) : (
                           <Utensils className="w-8 h-8 text-gray-300 m-auto mt-4" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 hover:bg-orange-100">
                           {food.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{food.description}</p>
                      
                      {/* Action Link (Order Now) */}
                      <div className="mt-3">
                         <Link href={`/order`} className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                            Available on Menu <ArrowRight className="w-3 h-3" />
                         </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* --- SECTION 2: PAST ORDERS --- */}
        {orders.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" />
              Past Orders
            </h2>
            <div className="space-y-3">
              {orders.map((order: any) => (
                <Card key={order._id} className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(new Date(order.date), "PPP p")}</span>
                        </div>
                        <p className="font-medium text-gray-900">
                            {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                        </p>
                        {order.pickupCode && (
                            <p className="text-xs font-mono text-gray-400">Ref: {order.pickupCode}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                         <Badge className={
                            order.status === 'picked_up' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : 
                            order.status === 'confirmed' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                            "bg-gray-100 text-gray-700 hover:bg-gray-100"
                         }>
                            {order.status.replace("_", " ")}
                         </Badge>
                         <Button asChild size="sm" variant="ghost">
                            <Link href={`/history?highlight=${order._id}`}>View Details</Link>
                         </Button>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}