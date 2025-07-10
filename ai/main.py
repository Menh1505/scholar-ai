"""
Main pipeline script cho Scholar AI
Xử lý dữ liệu và thiết lập hệ thống RAG
"""
import sys
import os

from data_process.chunking import split_data_into_chunks, analyze_chunks
from data_process.qdrant_manager import QdrantManager
from utils.validation import validate_environment, print_validation_report, get_missing_requirements
from config.settings import settings


def setup_system():
    """Setup và validate toàn bộ hệ thống"""
    print("🔧 Đang setup hệ thống Scholar AI...")
    
    # Validate environment
    validation_results = validate_environment()
    print_validation_report(validation_results)
    
    if not validation_results["overall_status"]:
        missing = get_missing_requirements(validation_results)
        print("\n💡 Để khắc phục:")
        for req in missing:
            print(f"  - {req}")
        return False
    
    print("\n✅ Hệ thống đã sẵn sàng!")
    return True


def process_data(schools_directory: str = None, clear_existing: bool = True):
    """
    Xử lý dữ liệu và lưu vào Qdrant
    """
    print("\n📊 Bắt đầu xử lý dữ liệu...")
    
    if schools_directory is None:
        schools_directory = settings.SCHOOLS_DIRECTORY
    
    # Kiểm tra thư mục dữ liệu
    if not os.path.exists(schools_directory):
        print(f"❌ Thư mục dữ liệu không tồn tại: {schools_directory}")
        print("💡 Vui lòng tạo thư mục và đặt các file JSON của trường đại học vào đó")
        return False
    
    # Chia dữ liệu thành chunks
    chunks = split_data_into_chunks(schools_directory)
    
    if not chunks:
        print("❌ Không có chunks được tạo ra")
        return False
    
    # Phân tích chunks
    stats = analyze_chunks(chunks)
    print(f"\n📈 Thống kê chunks:")
    print(f"  📄 Tổng chunks: {stats['total_chunks']}")
    print(f"  🏫 Số trường: {stats['universities_count']}")
    print(f"  📑 Số section: {stats['sections_count']}")
    print(f"  📏 Độ dài trung bình: {stats['avg_content_length']} ký tự")
    
    # Lưu vào Qdrant
    print(f"\n💾 Đang lưu vào Qdrant...")
    manager = QdrantManager()
    manager.save_chunks_to_qdrant(chunks, clear_existing=clear_existing)
    
    # Verify kết quả
    info = manager.get_collection_info()
    if info["status"] == "success":
        print(f"✅ Hoàn thành! Collection có {info['vectors_count']} vectors")
    else:
        print(f"❌ Lỗi: {info['error']}")
        return False
    
    return True


def test_query(query: str = "Học phí của Harvard là bao nhiêu?"):
    """Test thử một câu hỏi"""
    print(f"\n🧪 Test câu hỏi: '{query}'")
    
    try:
        from core.rag_service import ScholarAIService
        
        service = ScholarAIService()
        result = service.process_query(query)
        
        print(f"\n💬 Câu trả lời:")
        print(result["answer"])
        
        print(f"\n📚 Nguồn ({len(result['sources'])} kết quả):")
        for i, source in enumerate(result["sources"][:3], 1):
            print(f"  {i}. {source['university']} - {source['section']} (score: {source['score']:.3f})")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test: {str(e)}")
        return False


def main():
    """Main function"""
    print("🎓 Scholar AI - Hệ thống RAG tư vấn du học")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
    else:
        command = "full"  # Default command
    
    if command == "setup":
        success = setup_system()
        if not success:
            sys.exit(1)
    
    elif command == "process":
        schools_dir = sys.argv[2] if len(sys.argv) > 2 else None
        success = setup_system() and process_data(schools_dir)
        if not success:
            sys.exit(1)
    
    elif command == "test":
        query = sys.argv[2] if len(sys.argv) > 2 else "Học phí của Harvard là bao nhiêu?"
        success = test_query(query)
        if not success:
            sys.exit(1)
    
    elif command == "full":
        # Chạy toàn bộ pipeline
        print("🔄 Chạy toàn bộ pipeline...")
        
        success = (
            setup_system() and 
            process_data() and 
            test_query()
        )
        
        if success:
            print("\n🎉 Hệ thống đã sẵn sàng!")
            print("💡 Chạy 'python app.py' để khởi động API server")
        else:
            print("\n❌ Pipeline thất bại!")
            sys.exit(1)
    
    else:
        print("📖 Cách sử dụng:")
        print("  python main.py setup          # Chỉ setup và validate")
        print("  python main.py process [dir]  # Xử lý dữ liệu")
        print("  python main.py test [query]   # Test câu hỏi")
        print("  python main.py full           # Chạy toàn bộ (mặc định)")


if __name__ == "__main__":
    main()
