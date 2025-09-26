import Link from 'next/link';

const adminPages = [
  { name: 'Home', path: '/admin/home' },
  { name: 'About', path: '/admin/about' },
  { name: 'Research', path: '/admin/research' },
  { name: 'News', path: '/admin/news' },
  { name: 'People', path: '/admin/people' },
  { name: 'Contact', path: '/admin/contact' },
  {name : 'Publication', path: '/admin/publications'}
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 - 흰색 텍스트 유지 */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 text-2xl font-bold">Admin Panel</div>
        <nav>
          <ul>
            {adminPages.map((page) => (
              <li key={page.name}>
                <Link href={page.path} className="block p-4 hover:bg-gray-700">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 본문 - 기본 글자색 검정으로 강제 */}
     <main className="flex-1 p-8 overflow-y-auto text-black [color-scheme:light]">
        {children}
      </main>
    </div>
  );
}
