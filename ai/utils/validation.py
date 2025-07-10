"""
Validation utilities cho Scholar AI
"""
import requests
from typing import Dict, Any, List
from qdrant_client import QdrantClient

from config.settings import settings


def check_dependencies() -> Dict[str, bool]:
    """Kiểm tra các dependencies cần thiết"""
    results = {}
    
    try:
        import sentence_transformers
        results['sentence_transformers'] = True
    except ImportError:
        results['sentence_transformers'] = False
    
    try:
        import qdrant_client
        results['qdrant_client'] = True
    except ImportError:
        results['qdrant_client'] = False
    
    try:
        import openai
        results['openai'] = True
    except ImportError:
        results['openai'] = False
    
    try:
        import flask
        results['flask'] = True
    except ImportError:
        results['flask'] = False
    
    return results


def check_qdrant_connection() -> bool:
    """Kiểm tra kết nối tới Qdrant"""
    try:
        response = requests.get(f"http://{settings.QDRANT_HOST}:{settings.QDRANT_PORT}/health")
        return response.status_code == 200
    except Exception:
        return False


def check_qdrant_collection() -> bool:
    """Kiểm tra collection đã tồn tại trong Qdrant"""
    try:
        client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        collections = client.get_collections()
        return any(c.name == settings.COLLECTION_NAME for c in collections.collections)
    except Exception:
        return False


def validate_environment() -> Dict[str, Any]:
    """Validate toàn bộ environment"""
    validation_results = {
        "dependencies": check_dependencies(),
        "qdrant_connection": check_qdrant_connection(),
        "qdrant_collection": check_qdrant_collection(),
        "config_valid": settings.validate()
    }
    
    # Tính tổng kết
    all_deps_ok = all(validation_results["dependencies"].values())
    validation_results["overall_status"] = (
        all_deps_ok and 
        validation_results["qdrant_connection"] and
        validation_results["config_valid"]
    )
    
    return validation_results


def print_validation_report(results: Dict[str, Any]) -> None:
    """In báo cáo validation"""
    print("🔍 Báo cáo kiểm tra hệ thống Scholar AI")
    print("=" * 50)
    
    # Dependencies
    print("\n📦 Dependencies:")
    for dep, status in results["dependencies"].items():
        status_icon = "✅" if status else "❌"
        print(f"  {status_icon} {dep}")
    
    # Qdrant
    print(f"\n🗄️  Qdrant:")
    print(f"  {'✅' if results['qdrant_connection'] else '❌'} Kết nối Qdrant")
    print(f"  {'✅' if results['qdrant_collection'] else '❌'} Collection '{settings.COLLECTION_NAME}'")
    
    # Config
    print(f"\n⚙️  Configuration:")
    print(f"  {'✅' if results['config_valid'] else '❌'} Config hợp lệ")
    
    # Overall
    print(f"\n🎯 Trạng thái tổng thể:")
    if results["overall_status"]:
        print("  ✅ Hệ thống sẵn sàng hoạt động!")
    else:
        print("  ❌ Hệ thống chưa sẵn sàng. Vui lòng khắc phục các lỗi trên.")


def get_missing_requirements(results: Dict[str, Any]) -> List[str]:
    """Lấy danh sách requirements còn thiếu"""
    missing = []
    
    # Check dependencies
    for dep, status in results["dependencies"].items():
        if not status:
            missing.append(f"pip install {dep}")
    
    # Check Qdrant
    if not results["qdrant_connection"]:
        missing.append("Khởi động Qdrant server")
    
    # Check config
    if not results["config_valid"]:
        missing.append("Cấu hình OPENAI_API_KEY")
    
    return missing
