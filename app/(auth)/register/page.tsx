// src/app/register/page.tsx

import UserRegistrationForm from "@/components/UserRegistrationForm";
import { getAllUsers } from "@/db/(queries)/user";

export default async function RegisterPage() {
  const listofuser = await getAllUsers()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Register User</h1>
        <UserRegistrationForm />
      </div>

    </div>
  );
}
