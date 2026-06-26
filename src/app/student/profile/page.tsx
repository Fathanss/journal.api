"use client";


import React, { useEffect, useState, useRef } from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { useRouter } from 'next/navigation';
import { User, Lock, LogOut, Camera, Save, X } from 'lucide-react';
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
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [switchUsername, setSwitchUsername] = useState('');
 const [switchPassword, setSwitchPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [uploadingPhoto, setUploadingPhoto] = useState(false);
 const [photoPreview, setPhotoPreview] = useState<string | null>(null);
 const [photoUrl, setPhotoUrl] = useState<string | null>(null);
 const [studentData, setStudentData] = useState<StudentData>(mStudentData);
 
 const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

   // Validate file type
   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
   if (!allowedTypes.includes(file.type)) {
     Swal.fire('Oops', 'Format file harus JPEG, PNG, GIF, atau WebP.', 'warning');
     return;
   }

   // Validate file size (max 5MB)
   if (file.size > 5 * 1024 * 1024) {
     Swal.fire('Oops', 'Ukuran file maksimal 5MB.', 'warning');
     return;
   }

   // Create preview
   const reader = new FileReader();
   reader.onloadend = () => {
     setPhotoPreview(reader.result as string);
   };
   reader.readAsDataURL(file);

   // Upload photo
   setUploadingPhoto(true);
   try {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('studentId', String(studentData.id));

     const response = await fetch('/api/students/photo', {
       method: 'POST',
       body: formData,
     });

     const result = await response.json();

     if (response.ok && result.status) {
       setPhotoUrl(result.photoUrl);
       Swal.fire('Berhasil', 'Foto profil berhasil diperbarui.', 'success');
     } else {
       Swal.fire('Gagal', result.message || 'Tidak dapat mengunggah foto.', 'error');
       setPhotoPreview(null);
     }
   } catch (err) {
     console.error('Photo upload error:', err);
     Swal.fire('Error', 'Terjadi kesalahan saat mengunggah foto.', 'error');
     setPhotoPreview(null);
   } finally {
     setUploadingPhoto(false);
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   }
 };

 const handlePhotoButtonClick = () => {
   fileInputRef.current?.click();
 };

 
 const handleSwitchAccount = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();

   if (!switchUsername.trim() || !switchPassword.trim()) {
     Swal.fire('Oops', 'Username dan password akun tujuan wajib diisi.', 'warning');
     return;
   }

   setLoading(true);

   try {
     const response = await fetch('/api/auth/student-login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         username: switchUsername.trim(),
         password: switchPassword,
       }),
     });

     const result = await response.json();

     if (response.ok && result.status) {
       localStorage.setItem('student_session_token', result.token);
       localStorage.setItem('student_data', JSON.stringify(result.data));
       localStorage.setItem('usersRole', JSON.stringify(result.role));
       Cookies.set('userRole', 'student');

       setStudentData(result.data);
       setSwitchUsername('');
       setSwitchPassword('');

       Swal.fire({
         title: 'Berhasil',
         text: 'Akun berhasil diganti.',
         icon: 'success',
         timer: 1200,
         showConfirmButton: false,
       }).then(() => {
         router.push('/student/dashboard');
       });
     } else {
       Swal.fire('Gagal', result.message || 'Tidak dapat mengubah akun.', 'error');
     }
   } catch (err) {
     console.error('Switch account error:', err);
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

    // Load existing photo
    const photoPath = `/uploads/student_${studentSessionJson.id}.jpg`;
    const photoPathPng = `/uploads/student_${studentSessionJson.id}.png`;
    const photoPathGif = `/uploads/student_${studentSessionJson.id}.gif`;
    const photoPathWebp = `/uploads/student_${studentSessionJson.id}.webp`;

    // Try to load the photo by checking if it exists
    fetch(photoPath, { method: 'HEAD' })
      .then(() => setPhotoUrl(photoPath))
      .catch(() => {
        fetch(photoPathPng, { method: 'HEAD' })
          .then(() => setPhotoUrl(photoPathPng))
          .catch(() => {
            fetch(photoPathGif, { method: 'HEAD' })
              .then(() => setPhotoUrl(photoPathGif))
              .catch(() => {
                fetch(photoPathWebp, { method: 'HEAD' })
                  .then(() => setPhotoUrl(photoPathWebp))
                  .catch(() => setPhotoUrl(null));
              });
          });
      });
  }, [router]);


 return (
   <MainStudentLayout>
     <div className="mb-8">
       <h1 className="text-2xl font-bold text-gray-800">Switch Account</h1>
       <p className="text-gray-500">Pindah ke akun pelajar lain dengan aman dan cepat.</p>
     </div>

     <div className="max-w-2xl rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
       <div className="h-28 bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500"></div>

       <div className="px-6 py-7 -mt-12 sm:px-8">
        

         <form onSubmit={handleSwitchAccount} className="mt-6 space-y-5">
           <div className="space-y-4">
             <div>
               <label className="mb-1.5 block text-sm font-medium text-gray-700">Username akun tujuan</label>
               <div className="relative">
                 <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                   <User size={18} />
                 </span>
                 <input
                   type="text"
                   value={switchUsername}
                   onChange={(e) => setSwitchUsername(e.target.value)}
                   className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                   placeholder="Masukkan username akun lain"
                 />
               </div>
             </div>

             <div>
               <label className="mb-1.5 block text-sm font-medium text-gray-700">Password akun tujuan</label>
               <div className="relative">
                 <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                   <Lock size={18} />
                 </span>
                 <input
                   type="password"
                   value={switchPassword}
                   onChange={(e) => setSwitchPassword(e.target.value)}
                   className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                   placeholder="Masukkan password akun lain"
                 />
               </div>
             </div>
           </div>

           <div className="flex flex-col gap-3 pt-2">
             <button
               type="submit"
               disabled={loading}
               className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
             >
               <Save size={18} />
               {loading ? 'Menyambungkan...' : 'Ganti Akun'}
             </button>

             <button
               type="button"
               onClick={handleLogout}
               className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
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


