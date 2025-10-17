import Link from 'next/link';

const adminPages = [
  { name: 'Home', path: '/admin/home' },
  { name: 'About', path: '/admin/about' },
  { name: 'Research', path: '/admin/research' },
  { name: 'News', path: '/admin/news' },
  { name: 'People', path: '/admin/people' },
  { name: 'Contact', path: '/admin/contact' },


  {name : 'Publication', path: '/admin/publications'},
  {name : 'Tab Management', path: '/admin/board/tabs'},
  {name : 'Post Management', path: '/admin/board/posts'},

];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white  flex flex-col justify-between">
        <div>
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
        </div>

        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="block w-full text-center bg-gray-700 hover:bg-gray-600 rounded-md py-2">
            main page
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto text-black [color-scheme:light]">
        {children}
      </main>
    </div>
  );
}
