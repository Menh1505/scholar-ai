"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import ScholarPointsCard from "@/components/profile/ScholarPointsCard";
import InfoCards from "@/components/profile/InfoCards";
import StudyRoadmap from "@/components/profile/StudyRoadmap";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import ErrorMessage from "@/components/profile/ErrorMessage";

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
      // Extract only the fields that can be updated (exclude _id)
      const { _id, ...updateData } = tempProfile;
      await updateUser(updateData);
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

  const resetOnboarding = () => {
    // This could be implemented to reset user data if needed
    console.log("Reset functionality can be implemented here");
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
    <div className="bg-[#DBD9FB] p-4 max-w-6xl mx-auto">
      <ProfileHeader isEditing={isEditing} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} onReset={resetOnboarding} loading={isUpdating} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-3">
          <BasicInfoSection user={currentProfile} isEditing={isEditing} onInputChange={handleInputChange} />
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
    </div>
  );
}

export default ProfilePage;
