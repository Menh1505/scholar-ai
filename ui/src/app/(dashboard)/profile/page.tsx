"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import ScholarPointsCard from "@/components/profile/ScholarPointsCard";
import InfoCards from "@/components/profile/InfoCards";
import StudyRoadmap from "@/components/profile/StudyRoadmap";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import ErrorMessage from "@/components/profile/ErrorMessage";
import FloatButton from "@/components/profile/FloatButton";

function ProfilePage() {
  const { user, loading, fetchUser, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(user);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Update temp profile when user data changes
  useEffect(() => {
    if (user) {
      setTempProfile(user);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setTempProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!tempProfile || !user) return;

    setIsUpdating(true);
    try {
      await updateUser(tempProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally show error message to user
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(user);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin người dùng..." />;
  }

  if (!user) {
    return <ErrorMessage />;
  }

  const currentProfile = isEditing ? tempProfile : user;

  if (!currentProfile) {
    return <ErrorMessage />;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-3">
          <BasicInfoSection user={currentProfile} isEditing={isEditing} onInputChange={handleInputChange} onEditToggle={handleEdit} />
        </div>

        {/* Right Column - Scholar Point */}
        <div>
          <ScholarPointsCard points={currentProfile.scholarPoints} />
        </div>
      </div>

      {/* Information Cards */}
      <InfoCards user={currentProfile} />

      {/* Study Roadmap */}
      <StudyRoadmap user={currentProfile} />

      {/* Float Button - chỉ hiện khi đang editing */}
      {isEditing && <FloatButton onSave={handleSave} onCancel={handleCancel} isLoading={isUpdating} />}
    </div>
  );
}

export default ProfilePage;
