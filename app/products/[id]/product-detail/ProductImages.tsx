"use client";

export default function ProductImages({ images, name }: any) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
        <svg className="w-24 h-24 text-gray-400" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 16l4.586-4.586a2 2..." />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square rounded-lg overflow-hidden mb-4">
        <img src={images[0]} alt={name} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1).map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt={`${name} ${i + 2}`}
              className="aspect-square object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
