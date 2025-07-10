# Google OAuth Setup Guide

## Cách setup Google Authentication cho Scholar AI

### Bước 1: Tạo Google OAuth App

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API trong Library
4. Đi đến "Credentials" và tạo "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### Bước 2: Cập nhật Environment Variables

Cập nhật file `.env.local` với thông tin từ Google:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-secure-random-string-here
```

### Bước 3: Generate NEXTAUTH_SECRET

Chạy lệnh sau để tạo secret key:

```bash
openssl rand -base64 32
```

Hoặc sử dụng online tool: https://generate-secret.vercel.app/32

### Bước 4: Test Authentication

1. Chạy `npm run dev`
2. Truy cập http://localhost:3000
3. Sẽ redirect đến `/auth/signin`
4. Click "Đăng nhập với Google"
5. Hoàn thành OAuth flow
6. Điền thông tin onboarding
7. Vào dashboard với thông tin đã lưu trong MongoDB

### Các tính năng đã implement:

✅ **Google OAuth Login**

- NextAuth.js với Google Provider
- Session management
- MongoDB adapter để lưu user sessions

✅ **Database Integration**

- User profiles lưu trong MongoDB
- API endpoints: GET/POST/PUT `/api/profile`
- Auto-sync email từ Google account

✅ **Protected Routes**

- Middleware bảo vệ dashboard routes
- Auto redirect to signin nếu chưa auth
- Loading states và error handling

✅ **Onboarding Flow**

- Kiểm tra authentication trước
- Form nhập thông tin bổ sung
- Lưu xuống MongoDB
- Welcome bonus Scholar Points

✅ **Context Integration**

- AuthOnboardingContext quản lý state
- Sync với NextAuth session
- API calls cho CRUD profile

### Flow hoạt động:

1. **Chưa đăng nhập**: Redirect `/auth/signin`
2. **Google OAuth**: Login, lưu session vào MongoDB
3. **Onboarding Check**: Có profile chưa?
4. **Onboarding Form**: Nhập thông tin bổ sung
5. **Dashboard**: Access với profile đầy đủ
6. **AI Chat**: Sử dụng profile context

### Database Schema:

```javascript
// Collection: users (NextAuth)
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  emailVerified: Date
}

// Collection: userProfiles (Custom)
{
  _id: ObjectId,
  userId: String, // Link to users._id
  email: String,
  fullname: String,
  phone: String,
  dateOfBirth: String,
  nationality: String,
  passportCode: String,
  passportExpiryDate: String,
  scholarPoints: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Notes:

- MongoDB sẽ tự tạo các collections cần thiết
- NextAuth sử dụng database session strategy
- User profile riêng biệt với NextAuth user
- Reset demo chỉ reset local state, không xóa DB
