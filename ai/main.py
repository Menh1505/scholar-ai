"""
Main pipeline script cho Scholar AI - Version with dependency checking
"""
import sys
import os
import argparse

def check_dependencies():
    """Kiểm tra dependencies trước khi import"""
    missing_deps = []
    
    try:
        import flask
        print("✅ Flask OK")
    except ImportError:
        missing_deps.append("flask")
    
    try:
        import flask_cors
        print("✅ Flask-CORS OK")
    except ImportError:
        missing_deps.append("flask-cors")
    
    try:
        import sentence_transformers
        print("✅ Sentence-transformers OK")
    except ImportError:
        missing_deps.append("sentence-transformers")
    
    try:
        import qdrant_client
        print("✅ Qdrant-client OK")
    except ImportError:
        missing_deps.append("qdrant-client")
    
    try:
        import openai
        print("✅ OpenAI OK")
    except ImportError:
        missing_deps.append("openai")
    
    try:
        import dotenv
        print("✅ Python-dotenv OK")
    except ImportError:
        missing_deps.append("python-dotenv")
    
    if missing_deps:
        print(f"\n❌ Missing dependencies: {', '.join(missing_deps)}")
        print("\n💡 To fix this, run:")
        print("pip install -r requirements.txt")
        return False
    
    print("\n✅ All dependencies are installed!")
    return True

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Scholar AI - Process and serve university data')
    parser.add_argument('command', choices=['check-deps', 'setup', 'process', 'test'], 
                       help='Command to run')
    parser.add_argument('--clear', action='store_true', 
                       help='Clear existing data when processing')
    
    args = parser.parse_args()
    
    if args.command == 'check-deps':
        success = check_dependencies()
        sys.exit(0 if success else 1)
    
    # For other commands, check dependencies first
    if not check_dependencies():
        sys.exit(1)
    
    # Import after dependency check
    from config.settings import settings
    from data_process.chunking import split_data_into_chunks
    from data_process.qdrant_manager import QdrantManager
    from utils.validation import validate_environment
    from utils.data_utils import analyze_chunks
    
    if args.command == 'setup':
        setup_complete_pipeline()
    elif args.command == 'process':
        process_data(clear_existing=args.clear)
    elif args.command == 'test':
        test_system()

def setup_complete_pipeline():
    """Setup complete pipeline từ đầu đến cuối"""
    print("🚀 Bắt đầu setup Scholar AI...")
    
    try:
        # Import sau khi check dependencies
        from config.settings import settings
        from data_process.chunking import split_data_into_chunks
        from data_process.qdrant_manager import QdrantManager
        
        print("\n📂 Processing university data...")
        chunks = split_data_into_chunks(settings.SCHOOLS_DIRECTORY)
        
        if not chunks:
            print("❌ No data found to process")
            return False
        
        print(f"\n📝 Created {len(chunks)} chunks")
        
        print("\n💾 Uploading to Qdrant...")
        manager = QdrantManager()
        manager.save_chunks_to_qdrant(chunks, clear_existing=True)
        
        print("\n🎉 Setup complete! Run 'python app.py' to start the API server.")
        
    except Exception as e:
        print(f"\n❌ Error during setup: {e}")
        print("\n💡 Make sure you have:")
        print("1. Installed all dependencies: pip install -r requirements.txt")
        print("2. Set up .env file with OPENAI_API_KEY")
        print("3. Started Qdrant server: docker run -p 6333:6333 qdrant/qdrant")
        sys.exit(1)

def process_data(clear_existing: bool = True):
    """Xử lý dữ liệu và lưu vào Qdrant"""
    print("\n📊 Bắt đầu xử lý dữ liệu...")
    
    try:
        from config.settings import settings
        from data_process.chunking import split_data_into_chunks
        from data_process.qdrant_manager import QdrantManager
        from utils.data_utils import analyze_chunks
        
        # Kiểm tra thư mục dữ liệu
        if not os.path.exists(settings.SCHOOLS_DIRECTORY):
            print(f"❌ Thư mục dữ liệu không tồn tại: {settings.SCHOOLS_DIRECTORY}")
            print("💡 Vui lòng tạo thư mục và đặt các file JSON của trường đại học vào đó")
            return False
        
        # Chia dữ liệu thành chunks
        chunks = split_data_into_chunks(settings.SCHOOLS_DIRECTORY)
        
        if not chunks:
            print("❌ Không có chunks được tạo ra")
            return False
        
        # Phân tích chunks
        print(f"\n📈 Phân tích {len(chunks)} chunks...")
        stats = analyze_chunks(chunks)
        print(f"📊 Thống kê:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
        
        # Lưu vào Qdrant
        print("\n💾 Đang lưu vào Qdrant...")
        manager = QdrantManager()
        success = manager.save_chunks_to_qdrant(chunks, clear_existing=clear_existing)
        
        if success:
            print("✅ Xử lý dữ liệu thành công!")
            return True
        else:
            print("❌ Có lỗi khi lưu vào Qdrant")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def test_system():
    """Test hệ thống"""
    print("\n🧪 Kiểm tra hệ thống...")
    
    try:
        from config.settings import settings
        from core.rag_service import RAGService
        from utils.validation import validate_environment
        
        # Kiểm tra môi trường
        validation_results = validate_environment()
        
        if not validation_results["overall_status"]:
            print("❌ Môi trường chưa được cấu hình đúng")
            return False
        
        # Test RAG service
        rag = RAGService()
        
        # Test query
        test_query = "What programs does MIT offer in computer science?"
        print(f"\n🔍 Test query: {test_query}")
        
        result = rag.search_and_generate(test_query)
        
        print(f"\n📝 Kết quả:")
        print(f"Answer: {result.get('answer', 'No answer')}")
        print(f"Sources: {len(result.get('sources', []))} documents")
        
        print("\n✅ Hệ thống hoạt động bình thường!")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

if __name__ == "__main__":
    main()
