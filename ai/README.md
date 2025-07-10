# Scholar AI - Hệ thống RAG tư vấn du học

Hệ thống RAG (Retrieval-Augmented Generation) thông minh giúp học sinh tìm hiểu thông tin về các trường đại học quốc tế một cách chính xác và hiệu quả.

## 🎯 Tính năng

- **Hỏi đáp thông minh**: Trả lời câu hỏi về học phí, yêu cầu đầu vào, học bổng, v.v.
- **Tìm kiếm có lọc**: Lọc thông tin theo trường đại học, loại thông tin cụ thể
- **Phân tích ngữ nghĩa**: Sử dụng embedding để tìm kiếm chính xác
- **API RESTful**: Dễ dàng tích hợp với frontend hoặc ứng dụng khác

## 🏗️ Kiến trúc hệ thống

```
📁 ai/
├── 📁 config/
│   └── 📄 settings.py           # Cấu hình trung tâm
├── 📁 core/
│   └── 📄 rag_service.py        # Logic RAG chính
├── 📁 data_process/
│   ├── 📄 chunking.py           # Xử lý và chia dữ liệu
│   └── 📄 qdrant_manager.py     # Quản lý Qdrant vector DB
├── 📁 utils/
│   ├── 📄 data_utils.py         # Utilities xử lý dữ liệu
│   └── 📄 validation.py         # Validation và health check
├── 📁 data/
│   └── 📁 schools/              # Dữ liệu JSON về các trường
├── 📄 app.py                    # Flask API server
├── 📄 main.py                   # Script chính
├── 📄 requirements.txt          # Dependencies
└── 📄 .env.example              # Template cấu hình
```

## 🚀 Cài đặt và chạy

### 1. Clone và cài đặt dependencies

```bash
git clone <repository>
cd scholar-ai/ai
pip install -r requirements.txt
```

### 2. Cấu hình môi trường

```bash
# Copy và chỉnh sửa file cấu hình
cp .env.example .env

# Cập nhật OPENAI_API_KEY trong file .env
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Khởi động Qdrant vector database

```bash
# Sử dụng Docker (khuyến nghị)
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Hoặc cài đặt local theo hướng dẫn tại: https://qdrant.tech/documentation/quickstart/
```

### 4. Chuẩn bị dữ liệu

```bash
# Tạo thư mục data và copy file JSON của các trường vào
mkdir -p data/schools
# Copy các file *.json vào data/schools/
```

### 5. Chạy hệ thống

```bash
# Kiểm tra dependencies
python main.py check-deps

# Chạy toàn bộ pipeline (setup + xử lý dữ liệu)
python main.py setup

# Hoặc chạy từng bước:
python main.py process        # Xử lý và upload dữ liệu
python main.py test          # Test với câu hỏi mẫu

# Khởi động API server
python app.py
```

## 🔧 Troubleshooting

### Lỗi dependencies với Python 3.13

Nếu gặp lỗi về torch hoặc các package khác không tương thích với Python 3.13:

```bash
# Kiểm tra Python version
python --version

# Cài đặt dependencies
pip install -r requirements.txt

# Nếu vẫn lỗi, thử cài từng package riêng lẻ:
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install sentence-transformers
pip install qdrant-client
```

### Lỗi kết nối Qdrant

```bash
# Đảm bảo Qdrant đang chạy
docker ps | grep qdrant

# Nếu chưa chạy, khởi động lại:
docker run -d -p 6333:6333 -p 6334:6334 --name qdrant qdrant/qdrant

# Kiểm tra kết nối:
curl http://localhost:6333/health
```

### Lỗi môi trường

```bash
# Tạo file .env từ template
cp .env.example .env

# Thêm OpenAI API key vào .env:
echo "OPENAI_API_KEY=your_key_here" >> .env
```