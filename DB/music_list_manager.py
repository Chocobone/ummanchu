import os
import pymongo
from pymongo.errors import DuplicateKeyError
from datetime import datetime
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class MusicListManager:
    def __init__(self):
        # 환경 변수에서 설정 불러오기
        self.uri = os.getenv("MONGO_URI")
        self.db_name = os.getenv("MUSIC_LIST_DB_NAME")
        self.col_name = os.getenv("MUSIC_LIST_COLLECTION_NAME")
        
        # 클라이언트 및 DB 연결
        self.client = pymongo.MongoClient(self.uri)
        self.db = self.client[self.db_name]
        self.collection = self.db[self.col_name]

        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        
        # 인덱스 설정 (이메일 중복 방지 등)
        self._setup_indexes()

    def _setup_indexes(self):
        """이메일 필드에 유니크 인덱스를 생성하여 중복 가입을 방지합니다."""
        self.collection.create_index("email", unique=True)

    # --- C: Create (계정 생성) ---
    def create_user(self, email, audio_url, image_url, title=None):
        
        music_list_doc = {
            "email": email, #user_id처럼 사용
            "audio_url": audio_url,
            "image_url": image_url,
            "title": title,
            "created_at": datetime.now()
        }
        
        try:
            result = self.collection.insert_one(music_list_doc)
            return True, str(result.inserted_id)
        except DuplicateKeyError:
            return False, "이미 존재하는 이메일입니다."
        except Exception as e:
            return False, str(e)

    # # --- R: Read (계정 조회) ---
    # def get_user_by_email(self, email):
    #     """이메일로 사용자 정보를 조회합니다."""
    #     return self.collection.find_one({"email": email}, {"_id": 0, "password": 0}) # 비밀번호 제외하고 반환

    def get_user_made_music_list(self):
        """유저가 생성한 음악 리스트를 조회합니다."""
        music_list = list(self.collection.find({}, {"_id": 0, "password": 0}))
        return music_list

    # --- U: Update (계정 정보 수정) ---
    def update_user_info(self, email, update_data):
        """
        email: 수정할 대상의 이메일
        update_data: 수정할 필드와 값 (Dictionary 형태) 예: {"age": 30, "username": "NewName"}
        """
        result = self.collection.update_one(
            {"email": email},
            {"$set": update_data}
        )
        return result.modified_count > 0

    # --- D: Delete (계정 삭제) ---
    def delete_music_list(self, email):
        """사용자 기록을 삭제합니다."""
        result = self.collection.delete_one({"email": email})
        return result.deleted_count > 0