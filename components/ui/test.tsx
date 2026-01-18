<div
              key={food._id}
              className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800">
                {food.images && food.images.length > 0 ? (
                  <Image
                    src={food.images[0]}
                    alt={food.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UtensilsCrossed className="h-10 w-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {food.category}
                  </span>
                </div>
                {food.images && food.images.length > 1 && (
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> +
                      {food.images.length - 1}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3
                  className="font-bold text-gray-900 dark:text-gray-100 truncate"
                  title={food.name}
                >
                  {food.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-8">
                  {food.description || "No description provided."}
                </p>
              </div>
            </div>