import Image from "next/image";

export default function CollectionsTab() {
  return (
    <div className="flex flex-row">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-md shadow-md">
          <div className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="relative aspect-square">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=Item+${j + 1}`}
                  alt={`Collection item ${j + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="p-4">
            <h3 className="font-medium">Collection {i + 1}</h3>
            <p className="text-sm text-muted-foreground">{4} items</p>
          </div>
        </div>
      ))}
    </div>
  );
}
