'use client';

import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  item: any;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NewsCard({ item, isAdmin, onEdit, onDelete }: NewsCardProps) {
  return (
    <div className="flex flex-col overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
      <div className="relative w-full h-52 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {item.title}
        </h3>
        <p
          className="text-sm text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </div>

      <div className="px-5 pb-5 pt-0 mt-auto flex justify-between items-center text-sm">
        <span className="text-gray-400">
          {new Date(item.publishedAt).toLocaleDateString()}
        </span>
        <Link
          href={`/news/${item.id}`}
          className="font-medium text-primary hover:text-primary/80"
        >
          READ MORE →
        </Link>
      </div>

      {isAdmin && (
        <div className="flex justify-end gap-2 px-5 pb-4">
          <button onClick={onEdit} className="text-blue-600 hover:underline">
            Edit
          </button>
          <button onClick={onDelete} className="text-red-500 hover:underline">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}