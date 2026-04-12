"use client";


import React, { useState } from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { useRouter } from 'next/navigation';
import { User, Lock, LogOut, Camera, Save } from 'lucide-react';


export default function ProfilePage() {
 const router = useRouter();
 const [name, setName] = useState('Werdani Sulistya');
 const [password, setPassword] = useState('password123');
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   alert('Profile updated successfully! (Dummy)');
 };


 const handleLogout = () => {
   // Clear any local storage/session logic here
   router.push('/login');
 };


 return (
   <MainStudentLayout>
     {/* Header */}
     <div className="mb-8">
       <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
       <p className="text-gray-500">Manage your account settings and personal information.</p>
     </div>


     <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
       {/* Profile Header Background */}
       <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>


       <div className="p-8 -mt-16">
         <form onSubmit={handleUpdate} className="space-y-6">
          
           {/* Profile Picture Section */}
           <div className="flex flex-col items-center mb-8">
             <div className="relative">
               <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                 <User size={64} className="text-gray-400" />
               </div>
               <button
                 type="button"
                 className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:bg-gray-50"
               >
                 <Camera size={20} />
               </button>
             </div>
             <p className="mt-2 text-sm text-gray-500 font-medium">Change Photo</p>
           </div>


           {/* Form Fields */}
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <div className="relative">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                   <User size={18} />
                 </span>
                 <input
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                 />
               </div>
             </div>


             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <div className="relative">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                   <Lock size={18} />
                 </span>
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                 />
               </div>
             </div>
           </div>


           {/* Action Buttons */}
           <div className="flex flex-col gap-3 pt-4">
             <button
               type="submit"
               className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
             >
               <Save size={18} />
               Update Profile
             </button>
            
             <button
               type="button"
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition"
             >
               <LogOut size={18} />
               Logout
             </button>
           </div>


         </form>
       </div>
     </div>
   </MainStudentLayout>
 );
}


