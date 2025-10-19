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
    <div className="flex flex-col overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
      {/* 이미지 영역 */}
      <div className="relative w-full h-52 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {item.title}
        </h3>
        <p
          className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </div>

      {/* 하단 날짜 & 링크 */}
      <div className="px-5 pb-5 pt-0 mt-auto flex justify-between items-center text-sm">
        <span className="text-gray-400 dark:text-gray-500">
          {new Date(item.publishedAt).toLocaleDateString()}
        </span>
        <Link
          href={`/news/${item.id}`}
          className="font-medium text-primary hover:text-primary/80"
        >
          READ MORE →
        </Link>
      </div>

      {/* 관리자 버튼 */}
      {isAdmin && (
        <div className="flex justify-end gap-2 px-5 pb-4">
          <button
            onClick={onEdit}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}