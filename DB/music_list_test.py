import os
import uuid
from dotenv import load_dotenv

# Load .env if present (so MONGO_URI and other vars can be loaded automatically)
load_dotenv()

from music_list_manager import MusicListManager


def music_list_test():
    # Generate a unique email to avoid interfering with existing data
    unique_email = f"test_user_{uuid.uuid4().hex[:8]}@example.com"

    # Instantiate manager and handle potential connection errors gracefully
    try:
        manager = MusicListManager()
    except Exception as e:
        print("MongoDB 연결에 실패했습니다:", e)
        print("테스트를 건너뜁니다. 로컬 또는 테스트 MongoDB 설정을 확인해주세요.")
        return

    print("=== 1. 음악 리스트 생성 테스트 ===")
    audio_url = "https://example.com/audio.mp3"
    image_url = "https://example.com/image.jpg"
    title = "Test Song"

    success, message = manager.create_user(unique_email, audio_url, image_url, title=title)
    if success:
        print(f"리스트 생성 성공! ID: {message}")
    else:
        print(f"리스트 생성 실패: {message}")

    # Duplicate creation test — the same email should not create a new document
    success, message = manager.create_user(unique_email, audio_url, image_url, title=title)
    print(f"중복 생성 시도 결과: {message}")

    print("\n=== 2. 생성된 음악 리스트 조회 테스트 ===")
    music_list = manager.get_user_made_music_list()
    print(f"조회된 전체 리스트 수: {len(music_list)}")

    # Find our created document in the list
    found = None
    for item in music_list:
        if item.get("email") == unique_email:
            found = item
            break

    if found:
        print("생성된 문서가 리스트에서 발견되었습니다:")
        print(found)
    else:
        print("생성한 문서를 조회할 수 없습니다. (중복 인덱스 문제 또는 추가 실패 가능성)")

    print("\n=== 3. 정보 수정 테스트 ===")
    new_title = "Updated Test Song"
    if manager.update_user_info(unique_email, {"title": new_title}):
        print("정보 수정 완료")
        # Re-query and show updated doc
        music_list = manager.get_user_made_music_list()
        for item in music_list:
            if item.get("email") == unique_email:
                print("수정 후 문서:")
                print(item)
                break
    else:
        print("정보 수정이 적용되지 않았습니다.")

    print("\n=== 4. 삭제 테스트 ===")
    if manager.delete_music_list(unique_email):
        print("삭제 완료")
    else:
        print("삭제할 문서가 없습니다.")


if __name__ == "__main__":
    music_list_test()
