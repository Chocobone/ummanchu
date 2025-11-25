import subprocess

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

# 사용 예시
extract_audio_ffmpeg("/mnt/c/Users/user/ummanchu/test_video/test.mp4", "output.mp3")