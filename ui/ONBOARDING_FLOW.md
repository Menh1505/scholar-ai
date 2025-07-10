# 🚀 Onboarding Flow Documentation

## Overview

Scholar AI hiện đã có **User Onboarding Flow** hoàn chỉnh - yêu cầu user nhập thông tin cá nhân khi lần đầu truy cập.

## 🎯 User Journey

### 1. **First Visit (Chưa có thông tin)**

User truy cập → Hiển thị **OnboardingForm** 3 bước:

#### **Bước 1: Thông tin cơ bản** ⭐ (Required)

- Họ và tên \*
- Email \*
- Số điện thoại \*
- Validation: Email format, required fields

#### **Bước 2: Thông tin cá nhân** ⭐ (Required)

- Ngày sinh \*
- Quốc tịch \* (default: Vietnam)
- Validation: Date selection required

#### **Bước 3: Thông tin hộ chiếu** 🔹 (Optional)

- Số hộ chiếu (optional)
- Ngày hết hạn hộ chiếu (optional)
- **Skip option**: "Bỏ qua và hoàn thành sau"

### 2. **After Completion**

- Welcome bonus: **100 Scholar Points**
- Lưu vào **localStorage**
- Redirect vào dashboard với đầy đủ thông tin

### 3. **Subsequent Visits**

- Load từ localStorage
- Bypass onboarding → Vào dashboard trực tiếp

## 🔧 Technical Implementation

### **Context Management**

```typescript
// OnboardingContext.tsx
interface UserProfile {
  fullname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportCode: string;
  passportExpiryDate: string;
  scholarPoints: number;
}
```

### **Flow Control**

```typescript
// layout.tsx
function DashboardContent({ children }) {
  const { isOnboardingComplete } = useOnboarding();

  if (!isOnboardingComplete) {
    return <OnboardingForm />;
  }

  return <Dashboard>{children}</Dashboard>;
}
```

### **Data Persistence**

- **Storage**: localStorage (`scholar_ai_user_profile`)
- **State**: OnboardingContext (React Context)
- **Reset**: Reset button trong Profile page và Sidebar

## 🎨 UI/UX Features

### **OnboardingForm**

- **Progressive Bar**: 33% → 66% → 100%
- **Step Navigation**: Previous/Next buttons
- **Validation**: Real-time error messages
- **Responsive**: Mobile-friendly design
- **Visual Appeal**: Gradient background, animations

### **Integration với AI**

- **Personalized Greeting**: "Xin chào [Tên User]!"
- **Context Awareness**: AI biết thông tin đã nhập
- **Dynamic Suggestions**: Thay đổi theo profile completeness

### **Profile Page Updates**

- **Real-time Data**: Hiển thị thông tin từ onboarding
- **Edit Mode**: Có thể chỉnh sửa thông tin đã nhập
- **Dynamic Roadmap**: Progress thay đổi theo hộ chiếu completion
- **Reset Demo**: Button để test lại onboarding

### **Sidebar Updates**

- **User Name**: Hiển thị tên thật từ profile
- **Scholar Points**: Real-time points display
- **Reset Demo**: Quick reset button

## 🧪 Testing Flow

### **Test Case 1: New User**

1. Clear localStorage hoặc click "Reset Demo"
2. Refresh page → Thấy OnboardingForm
3. Fill thông tin → Complete onboarding
4. Verify: Dashboard loads với tên user

### **Test Case 2: Returning User**

1. Complete onboarding ít nhất 1 lần
2. Refresh page → Bypass onboarding
3. Verify: Dashboard loads ngay lập tức

### **Test Case 3: Partial Data**

1. Fill only required fields (skip passport)
2. Complete onboarding
3. Verify: Profile shows "Chưa cập nhật" cho passport
4. Verify: AI context includes passport = incomplete

### **Test Case 4: Profile Edit**

1. Complete onboarding
2. Go to Profile → Edit
3. Update passport info → Save
4. Verify: AI chat receives updated passport status

## 🔄 Reset & Demo

### **Reset Methods:**

1. **Profile Page**: "Reset Demo" button (header)
2. **Sidebar**: "🔄 Reset Demo" link
3. **Browser**: Clear localStorage manually

### **Demo Scenarios:**

```bash
# Scenario A: Complete User
- Có đầy đủ thông tin + passport
- AI: "Tôi thấy bạn đã sẵn sàng nộp hồ sơ..."

# Scenario B: Incomplete User
- Chỉ có thông tin cơ bản, chưa có passport
- AI: "Bạn cần cập nhật thông tin hộ chiếu..."

# Scenario C: Fresh User
- Reset → Onboarding flow
- AI: "Chào mừng! Hãy bắt đầu với thông tin cơ bản..."
```

## 📊 Data Flow

```
User Input → OnboardingForm → OnboardingContext → localStorage
                                     ↓
Profile Page ← useOnboarding() ← Context State
     ↓
AI Chat ← useUserData() ← Profile Data ← Context
```

## 🎯 Benefits

1. **Better UX**: No more pre-filled mock data
2. **Personalization**: AI responses based on actual user info
3. **Progressive Disclosure**: 3-step flow không overwhelming
4. **Flexibility**: Optional fields, skip options
5. **Demo-friendly**: Easy reset for testing
6. **Context Continuity**: Consistent data across all pages

---

**🚀 Result**: User experience giờ đây tự nhiên và cá nhân hóa từ bước đầu tiên!
