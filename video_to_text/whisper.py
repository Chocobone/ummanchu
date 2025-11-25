import subprocess
import os
from openai import OpenAI

def extract_audio_ffmpeg(video_path, output_path):
    command = [
        "ffmpeg",
        "-i", video_path,  # 입력 파일
        "-q:a", "0",       # 오디오 품질 (0이 최고 품질)
        "-map", "a",       # 오디오 스트림만 선택
        output_path,
        "-y"               # 같은 이름의 파일이 있으면 덮어쓰기
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"변환 완료: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg 오류 발생: {e}")

def transcribe_video(video_path, api_key):
    """
    비디오 파일을 입력받아 오디오를 추출하고, 
    Whisper API를 통해 텍스트로 변환하여 반환합니다.
    """
    
    # 1. OpenAI 클라이언트 설정
    client = OpenAI(api_key=api_key)
    
    # 임시 오디오 파일명 설정 (mp3 포맷 권장)
    audio_path = "/mnt/c/Users/user/ummanchu/test_video/test.mp4"
    
    try:
        print(f"Checking video file: {video_path}...")
        
        # 2. 비디오에서 오디오 추출 (MoviePy 사용)
        extract_audio_ffmpeg(video_path, "output.mp3")
        
        # 3. Whisper API 호출
        print("Sending audio to Whisper API...")
        
        with open(audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                response_format="text" # 'json', 'text', 'srt', 'verbose_json', 'vtt' 중 선택 가능
            )
            
        print("Transcription completed!")
        return transcript

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
    finally:
        # 4. 임시 오디오 파일 삭제 (정리)
        if os.path.exists(audio_path):
            os.remove(audio_path)
            print("Temporary audio file removed.")

# --- 실행 부분 ---
if __name__ == "__main__":
    # 여기에 본인의 OpenAI API Key를 입력하세요.
    # (환경 변수로 관리하는 것이 좋습니다: os.getenv("OPENAI_API_KEY"))
    MY_API_KEY = "sk-..." 
    
    # 변환할 비디오 파일 경로
    TARGET_VIDEO = "my_video.mp4" 

    result = transcribe_video(TARGET_VIDEO, MY_API_KEY)
    
    if result:
        print("\n--- [Transcription Result] ---")
        print(result)