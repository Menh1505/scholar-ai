"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    const checkLogin = async () => {
      await fetchUser();
    };

    checkLogin();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/agent");
      } else {
        router.push("/signin");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
      </div>
    </div>
  );
}
