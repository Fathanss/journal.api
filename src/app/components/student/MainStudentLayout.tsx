// components/MainStudentLayout.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, History, User } from 'lucide-react';


const MENU_ITEMS = [
 { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
 { name: 'Presence', href: '/student/presence', icon: CalendarCheck },
 { name: 'History', href: '/student/history', icon: History },
 { name: 'Profile', href: '/student/profile', icon: User },
];


export default function MainStudentLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();


 return (
   <div className="flex flex-col md:flex-row min-h-screen" style={{backgroundColor: 'var(--background)'}}>
     {/* Desktop Sidebar (Hidden on Mobile) */}
     <aside className="hidden md:flex flex-col w-64 bg-blue-300 border-r h-screen sticky top-0" style={{borderColor: 'var(--primary-white)'}}>
       <div className="p-6 font-bold text-xl border-bottom" style={{color: 'var(--primary-gray-600)', borderBottomColor: 'var(--secondary-white)'}}>My App</div>
       <nav className="flex-1 p-4 space-y-2">
         {MENU_ITEMS.map((item) => (
           <Link
             key={item.href}
             href={item.href}
             className={`flex items-center gap-3 p-3 rounded-lg transition ${
               pathname === item.href ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
             }`}
             style={pathname === item.href ? {backgroundColor: 'var(--accent-light-blue)', color: 'white'} : {}}
           >
             <item.icon size={20} />
             <span>{item.name}</span>
           </Link>
         ))}
       </nav>
     </aside>


     {/* Main Content Area */}
     <main className="flex-1 p-6 pb-24 md:pb-6">
       {children}
     </main>


     {/* Mobile Bottom Navigation (Hidden on Desktop) */}
     <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2" style={{backgroundColor: 'white', borderTopColor: 'var(--primary-light-blue)'}}>
       {MENU_ITEMS.map((item) => (
         <Link
           key={item.href}
           href={item.href}
           className={`flex flex-col items-center justify-center w-full h-full transition ${
             pathname === item.href ? 'text-white' : 'text-gray-400'
           }`}
           style={pathname === item.href ? {color: 'white', backgroundColor: 'var(--accent-light-blue)', borderRadius: '8px', margin: '4px'} : {}}
         >
           <item.icon size={24} />
           <span className="text-[10px] mt-1">{item.name}</span>
         </Link>
       ))}
     </nav>
   </div>
 );
}


