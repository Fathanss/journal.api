"use client";


import React, { useEffect, useState } from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { useRouter } from 'next/navigation';
import { User, Lock, LogOut, Camera, Save } from 'lucide-react';
import Swal from "sweetalert2";
import Cookies from "js-cookie";

interface StudentData {
  name: string;
  username: string;
  class_id: number | string | null;
  id: number | string | null;
}

export default function ProfilePage() {
    let mStudentData = { name: "Guest", username: "unknown", id: null, class_id: null };

 const router = useRouter();
 const [name, setName] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [studentData, setStudentData] = useState<StudentData>(mStudentData);
 
 const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();

   if (!name.trim()) {
     Swal.fire('Oops', 'Nama tidak boleh kosong.', 'warning');
     return;
   }

   if (!studentData.id) {
     Swal.fire('Error', 'Data siswa tidak ditemukan. Silakan login ulang.', 'error');
     return;
   }

   setLoading(true);

   try {
     const response = await fetch('/api/students', {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         id: studentData.id,
         name: name.trim(),
         username: studentData.username,
         password: password.trim(),
         class_id: studentData.class_id,
       }),
     });

     const result = await response.json();

     if (response.ok && result.status) {
       const updatedStudent = {
         ...studentData,
         name: name.trim(),
       };

       localStorage.setItem('student_data', JSON.stringify(updatedStudent));
       setStudentData(updatedStudent);
       setPassword('');

       Swal.fire('Berhasil', 'Profil berhasil diperbarui.', 'success');
     } else {
       Swal.fire('Gagal', result.message || 'Tidak dapat memperbarui profil.', 'error');
     }
   } catch (err) {
     console.error('Update profile error:', err);
     Swal.fire('Error', 'Terjadi kesalahan server.', 'error');
   } finally {
     setLoading(false);
   }
 };


 const handleLogout = async () => {
   
           const result = await Swal.fire({
               title: "Apakah kamu yakin?",
               text: "Kamu akan keluar dari akun ini.",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#d33",
               cancelButtonColor: "#3085d6",
               confirmButtonText: "ya, keluar!",
           });
      
            if (result.isConfirmed) {
                try {
                    // Clear student session from localStorage
                    localStorage.removeItem("student_session_token");
                    localStorage.removeItem("student_data");
                    localStorage.removeItem("usersRole");
                    Cookies.remove("userRole");
                    router.push("/student-login");
                }
                catch (err) {
                    Swal.fire("Error!", "Failed to logout.", "error");
                }
            }
          }

useEffect(() => {
    const studentSession = localStorage.getItem("student_data");
    const studentSessionJson = JSON.parse(studentSession || "{}");

    if (!studentSessionJson || !studentSessionJson.id) {
      router.push("/student-login");
      return;
    }

    setStudentData(studentSessionJson);
    setName(studentSessionJson.name || "");
  }, [router]);


 return (
   <MainStudentLayout>
     {/* Header */}
     <div className="mb-8">
       <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
       <p className="text-gray-500">Manage your account settings and personal information.</p>
     </div>


     <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
       {/* Profile Header Background */}
       <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600"></div>


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


