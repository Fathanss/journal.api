"use client";


import React from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';


interface HistoryRecord {
 id: string;
 date: string;
 time: string;
 location: string;
 status: 'Present' | 'Late' | 'Permit';
}


const DUMMY_HISTORY: HistoryRecord[] = [
 { id: '1', date: 'Oct 12, 2025', time: '08:00 AM', location: 'Main Classroom A', status: 'Present' },
 { id: '2', date: 'Oct 11, 2025', time: '08:15 AM', location: 'Digital Lab 2', status: 'Late' },
 { id: '3', date: 'Oct 10, 2025', time: '07:55 AM', location: 'Auditorium', status: 'Present' },
 { id: '4', date: 'Oct 09, 2025', time: '09:00 AM', location: 'Workshop Room', status: 'Permit' },
 { id: '5', date: 'Oct 08, 2025', time: '08:05 AM', location: 'Main Classroom B', status: 'Present' },
];


export default function HistoryPage() {
  const getStatusStyle = (status: string) => {
   switch (status) {
     case 'Present': return 'bg-green-100 text-green-700 border-green-200';
     case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
     case 'Permit': return 'bg-blue-100 text-blue-700 border-blue-200';
     default: return 'bg-gray-100 text-gray-700';
   }
 };


 return (
   <MainStudentLayout>
     {/* Header */}
     <div className="mb-8">
       <h1 className="text-2xl font-bold text-gray-800">Attendance History</h1>
       <p className="text-gray-500">View your past presence records and attendance status.</p>
     </div>


     {/* Cards List */}
     <div className="grid grid-cols-1 gap-4">
       {DUMMY_HISTORY.map((item) => (
         <div
           key={item.id}
           className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
         >
           <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
               <Calendar size={24} />
             </div>
             <div>
               <h3 className="font-bold text-gray-800">{item.date}</h3>
               <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                 <span className="flex items-center gap-1">
                   <Clock size={14} /> {item.time}
                 </span>
                 <span className="flex items-center gap-1">
                   <MapPin size={14} /> {item.location}
                 </span>
               </div>
             </div>
           </div>


           <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
             <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
               {item.status}
             </span>
             <button className="text-gray-400 hover:text-indigo-600 ml-4">
               <CheckCircle size={20} />
             </button>
           </div>
         </div>
       ))}
     </div>
   </MainStudentLayout>
 );
}


