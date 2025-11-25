from user_manager import userManager

## test code
def user_test():
    manager = userManager()
    
    print("=== 1. 계정 생성 테스트 ===")
    success, message = manager.create_user("김철수", "chulsoo@example.com", "password123", age=25)
    if success:
        print(f"계정 생성 성공! ID: {message}")
    else:
        print(f"계정 생성 실패: {message}")

    # 중복 생성 테스트
    success, message = manager.create_user("김철수", "chulsoo@example.com", "password123")
    print(f"중복 생성 시도 결과: {message}")

    print("\n=== 2. 계정 조회 테스트 ===")
    user_info = manager.get_user_by_email("chulsoo@example.com")
    print(f"조회된 사용자 정보: {user_info}")

    print("\n=== 3. 로그인 검증 테스트 ===")
    if manager.verify_login("chulsoo@example.com", "password123"):
        print("로그인 성공!")
    else:
        print("로그인 실패!")

    print("\n=== 4. 정보 수정 테스트 ===")
    if manager.update_user_info("chulsoo@example.com", {"age": 26, "username": "철수김"}):
        print("정보 수정 완료")
        print("수정 후 정보:", manager.get_user_by_email("chulsoo@example.com"))

    print("\n=== 5. 계정 삭제 테스트 ===")
    if manager.delete_user("chulsoo@example.com"):
        print("계정 삭제 완료")
    else:
        print("삭제할 계정이 없습니다.")

# if __name__ == "__main__":
#     main()

user_test()