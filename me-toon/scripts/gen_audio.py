"""
8-bit 主题曲占位音频生成器
使用 numpy 生成简单的 chiptune 旋律，模拟《快乐小孩》的氛围
"""
import os
import numpy as np
import wave
import struct

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, 'public', 'assets', 'audio', 'songs')
os.makedirs(AUDIO_DIR, exist_ok=True)

# ============================================================
# 8-bit 合成器
# ============================================================
SAMPLE_RATE = 22050  # 8-bit 风格用较低采样率

def note_freq(note_name):
    """音名 -> 频率"""
    notes = {'C':0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11}
    if len(note_name) == 2:
        n, o = note_name[0], int(note_name[1])
    else:
        n, o = note_name[:2], int(note_name[2])
    midi = 12 * (o + 1) + notes[n]
    return 440.0 * (2 ** ((midi - 69) / 12))

def square_wave(freq, duration, volume=0.3, duty=0.5):
    """方波（经典 8-bit 音色）"""
    total = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, total, False)
    wave_data = np.where(np.mod(t * freq, 1) < duty, 1.0, -1.0)
    # 简单的 ADSR 包络（确保不超出 total 长度）
    attack = min(int(0.02 * SAMPLE_RATE), total // 4)
    decay = min(int(0.05 * SAMPLE_RATE), total // 4)
    release = min(int(0.1 * SAMPLE_RATE), total // 4)
    envelope = np.ones(total)
    if attack > 0:
        envelope[:attack] = np.linspace(0, 1, attack)
    if decay > 0 and attack + decay < total:
        envelope[attack:attack+decay] = np.linspace(1, 0.7, decay)
    if release > 0 and release < total:
        envelope[-release:] = np.linspace(0.7, 0, release)
    return wave_data * envelope * volume

def triangle_wave(freq, duration, volume=0.3):
    """三角波（柔和音色，用于副旋律）"""
    total = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, total, False)
    wave_data = (2 * np.abs(2 * (t * freq - np.floor(t * freq + 0.5))) - 1)
    # 简单包络
    release = min(int(0.1 * SAMPLE_RATE), total // 4)
    envelope = np.ones(total)
    if release > 0 and release < total:
        envelope[-release:] = np.linspace(1, 0, release)
    return wave_data * envelope * volume

def noise_hit(duration, volume=0.2):
    """噪声（用于鼓点）"""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    envelope = np.exp(-t * 8)
    return (np.random.uniform(-1, 1, len(t))) * envelope * volume

def save_wav(data, path):
    """保存为 8-bit WAV"""
    # 归一化到 16-bit
    data = np.clip(data, -1, 1)
    data = (data * 32767).astype(np.int16)
    with wave.open(path, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(data.tobytes())
    print(f"  ✓ 保存: {path} ({len(data) / SAMPLE_RATE:.1f}s)")

# ============================================================
# 生成《快乐小孩》风格的 8-bit 主题曲（约 30 秒）
# ============================================================
def gen_tutu_theme():
    print("\n生成《大耳朵图图》主题曲 8-bit 占位")
    path = os.path.join(AUDIO_DIR, 'tutu-theme.mp3')
    wav_path = os.path.join(AUDIO_DIR, 'tutu-theme.wav')

    # 简化的旋律（C 大调，欢快跳跃的风格）
    # 主旋律 - 模仿"圆圆的脑袋大大耳朵"的节奏
    melody = [
        # 第一乐句
        ('C5', 0.3), ('C5', 0.15), ('E5', 0.3), ('G5', 0.3),
        ('E5', 0.3), ('C5', 0.3), ('G4', 0.45),
        # 第二乐句
        ('A4', 0.3), ('A4', 0.15), ('C5', 0.3), ('E5', 0.3),
        ('D5', 0.3), ('C5', 0.3), ('C5', 0.45),
        # 第三乐句（高潮）
        ('G5', 0.3), ('G5', 0.15), ('E5', 0.3), ('C5', 0.3),
        ('D5', 0.3), ('E5', 0.3), ('G5', 0.45),
        # 第四乐句（收尾）
        ('C5', 0.3), ('D5', 0.3), ('E5', 0.3), ('G5', 0.3),
        ('C5', 0.6), ('G4', 0.6),
    ]

    # 低音线（每小节根音）
    bass = [
        ('C3', 0.9), ('G3', 0.9),
        ('A3', 0.9), ('F3', 0.9),
        ('C3', 0.9), ('G3', 0.9),
        ('C3', 0.9), ('G3', 0.9),
    ]

    # 拼接主旋律
    melody_data = []
    for note, dur in melody:
        if note == 'rest':
            melody_data.append(np.zeros(int(SAMPLE_RATE * dur)))
        else:
            melody_data.append(square_wave(note_freq(note), dur, volume=0.25, duty=0.5))
    melody_data = np.concatenate(melody_data)

    # 拼接低音
    bass_data = []
    for note, dur in bass:
        bass_data.append(triangle_wave(note_freq(note), dur, volume=0.2))
    bass_data = np.concatenate(bass_data)

    # 拼接鼓点
    drum_data = []
    total_duration = len(melody_data) / SAMPLE_RATE
    beat = 0
    while beat < total_duration:
        # 底鼓
        if int(beat * 2) % 2 == 0:
            drum_data.append(noise_hit(0.1, volume=0.15))
        else:
            drum_data.append(np.zeros(int(SAMPLE_RATE * 0.1)))
        # 军鼓
        if int(beat * 2) % 2 == 1:
            drum_data.append(noise_hit(0.08, volume=0.1))
        else:
            drum_data.append(np.zeros(int(SAMPLE_RATE * 0.08)))
        # 留白
        rest = 0.5 - 0.1 - 0.08
        if rest > 0:
            drum_data.append(np.zeros(int(SAMPLE_RATE * rest)))
        beat += 0.5
    drum_data = np.concatenate(drum_data)

    # 对齐长度
    max_len = max(len(melody_data), len(bass_data), len(drum_data))
    melody_data = np.pad(melody_data, (0, max_len - len(melody_data)))
    bass_data = np.pad(bass_data, (0, max_len - len(bass_data)))
    drum_data = np.pad(drum_data, (0, max_len - len(drum_data)))

    # 混音
    mixed = melody_data + bass_data + drum_data
    # 加一点点淡入淡出
    fade_samples = int(0.3 * SAMPLE_RATE)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    mixed[:fade_samples] *= fade_in
    mixed[-fade_samples:] *= fade_out

    # 循环 2 次凑够 1 分钟左右
    mixed = np.concatenate([mixed, mixed])

    save_wav(mixed, wav_path)

    # 尝试转 mp3（如果 ffmpeg 可用）
    import subprocess
    try:
        subprocess.run(
            ['ffmpeg', '-y', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a', '128k', path],
            check=True, capture_output=True
        )
        print(f"  ✓ 转换 MP3: {path}")
        os.remove(wav_path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"  ⚠ ffmpeg 不可用，保留 WAV 格式")
        # 重命名为 .wav 让前端能播放
        # 但 JSON 引用的是 .mp3，所以创建一个 mp3 后缀的拷贝
        os.rename(wav_path, path)
        print(f"  ✓ 已保存为: {path}")

# ============================================================
# 生成《喜羊羊与灰太狼》主题曲《别看我只是一只羊》8-bit 版本（约 30 秒）
# ============================================================
def gen_xiyangyang_theme():
    print("\n生成《喜羊羊与灰太狼》主题曲 8-bit 占位")
    path = os.path.join(AUDIO_DIR, 'xiyangyang-theme.mp3')
    wav_path = os.path.join(AUDIO_DIR, 'xiyangyang-theme.wav')

    # 简化的旋律（C 大调，轻快跳跃的风格）
    # 主旋律 - 模仿"别看我只是一只羊，绿草因为我变得更香"的节奏
    melody = [
        # 第一乐句 "别看我只是一只羊"
        ('C5', 0.3), ('E5', 0.3), ('G5', 0.3), ('C5', 0.3),
        ('E5', 0.3), ('D5', 0.3), ('D5', 0.45),
        # 第二乐句 "绿草因为我变得更香"
        ('E5', 0.3), ('G5', 0.3), ('C5', 0.3), ('A4', 0.3),
        ('C5', 0.3), ('D5', 0.3), ('D5', 0.45),
        # 第三乐句 "天空因为我变得更蓝"
        ('C5', 0.3), ('E5', 0.3), ('G5', 0.3), ('E5', 0.3),
        ('D5', 0.3), ('C5', 0.45),
        # 第四乐句 "白云因为我变得柔软"
        ('D5', 0.3), ('E5', 0.3), ('G5', 0.3), ('A4', 0.3),
        ('G5', 0.6),
        # 副歌 "虽然我只是羊"
        ('C5', 0.3), ('E5', 0.3), ('G5', 0.3), ('C5', 0.6),
    ]

    # 低音线（每小节根音）
    bass = [
        ('C3', 0.9), ('G3', 0.9), ('C3', 0.9),
        ('F3', 0.9), ('G3', 0.9), ('C3', 0.9),
        ('C3', 0.9), ('G3', 0.9),
        ('G3', 0.9), ('C3', 0.9),
        ('C3', 0.9), ('G3', 0.9),
    ]

    # 拼接主旋律
    melody_data = []
    for note, dur in melody:
        if note == 'rest':
            melody_data.append(np.zeros(int(SAMPLE_RATE * dur)))
        else:
            melody_data.append(square_wave(note_freq(note), dur, volume=0.25, duty=0.5))
    melody_data = np.concatenate(melody_data)

    # 拼接低音
    bass_data = []
    for note, dur in bass:
        bass_data.append(triangle_wave(note_freq(note), dur, volume=0.2))
    bass_data = np.concatenate(bass_data)

    # 拼接鼓点
    drum_data = []
    total_duration = len(melody_data) / SAMPLE_RATE
    beat = 0
    while beat < total_duration:
        # 底鼓
        if int(beat * 2) % 2 == 0:
            drum_data.append(noise_hit(0.1, volume=0.15))
        else:
            drum_data.append(np.zeros(int(SAMPLE_RATE * 0.1)))
        # 军鼓
        if int(beat * 2) % 2 == 1:
            drum_data.append(noise_hit(0.08, volume=0.1))
        else:
            drum_data.append(np.zeros(int(SAMPLE_RATE * 0.08)))
        # 留白
        rest = 0.5 - 0.1 - 0.08
        if rest > 0:
            drum_data.append(np.zeros(int(SAMPLE_RATE * rest)))
        beat += 0.5
    drum_data = np.concatenate(drum_data)

    # 对齐长度
    max_len = max(len(melody_data), len(bass_data), len(drum_data))
    melody_data = np.pad(melody_data, (0, max_len - len(melody_data)))
    bass_data = np.pad(bass_data, (0, max_len - len(bass_data)))
    drum_data = np.pad(drum_data, (0, max_len - len(drum_data)))

    # 混音
    mixed = melody_data + bass_data + drum_data
    # 加一点点淡入淡出
    fade_samples = int(0.3 * SAMPLE_RATE)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    mixed[:fade_samples] *= fade_in
    mixed[-fade_samples:] *= fade_out

    # 循环 2 次凑够 1 分钟左右
    mixed = np.concatenate([mixed, mixed])

    save_wav(mixed, wav_path)

    # 尝试转 mp3（如果 ffmpeg 可用）
    import subprocess
    try:
        subprocess.run(
            ['ffmpeg', '-y', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a', '128k', path],
            check=True, capture_output=True
        )
        print(f"  ✓ 转换 MP3: {path}")
        os.remove(wav_path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"  ⚠ ffmpeg 不可用，保留 WAV 格式")
        # 重命名为 .wav 让前端能播放
        # 但 JSON 引用的是 .mp3，所以创建一个 mp3 后缀的拷贝
        os.rename(wav_path, path)
        print(f"  ✓ 已保存为: {path}")

# ============================================================
# 生成 8-bit 音效
# ============================================================
def gen_sfx(name, generator):
    sfx_dir = os.path.join(ROOT, 'public', 'assets', 'audio', 'sfx')
    os.makedirs(sfx_dir, exist_ok=True)
    path = os.path.join(sfx_dir, f'{name}.wav')
    data = generator()
    save_wav(data, path)

def sfx_coin():
    """投币声 - 上升的两个音"""
    a = square_wave(note_freq('C5'), 0.08, volume=0.4)
    b = square_wave(note_freq('E5'), 0.15, volume=0.4)
    return np.concatenate([a, b])

def sfx_click():
    """按钮点击"""
    return square_wave(note_freq('A4'), 0.05, volume=0.3)

def sfx_dispense():
    """出货声 - 下降音阶"""
    notes = [note_freq('G5'), note_freq('E5'), note_freq('C5'), note_freq('G4')]
    parts = [square_wave(f, 0.1, volume=0.3) for f in notes]
    return np.concatenate(parts)

def sfx_ding():
    """叮一声（信息提示）"""
    return triangle_wave(note_freq('C6'), 0.3, volume=0.35)

def sfx_typewriter():
    """打字机咔哒声"""
    t = np.linspace(0, 0.03, int(SAMPLE_RATE * 0.03), False)
    return (np.random.uniform(-1, 1, len(t)) * np.exp(-t * 30)) * 0.15

def sfx_turn():
    """扭蛋机旋钮声"""
    t = np.linspace(0, 1.5, int(SAMPLE_RATE * 1.5), False)
    # 上升音调
    freq = 200 + 800 * t
    wave_data = np.sign(np.sin(2 * np.pi * np.cumsum(freq) / SAMPLE_RATE))
    envelope = np.where(t < 0.1, t / 0.1, np.where(t > 1.4, (1.5 - t) / 0.1, 1.0))
    return wave_data * envelope * 0.2

def sfx_easter():
    """大风车彩蛋音效"""
    notes = [('C5', 0.2), ('E5', 0.2), ('G5', 0.2), ('C6', 0.4)]
    parts = [triangle_wave(note_freq(n), d, volume=0.3) for n, d in notes]
    return np.concatenate(parts)

def main():
    print("=" * 60)
    print("Me-Toon 8-bit 音频生成")
    print("=" * 60)
    gen_tutu_theme()
    gen_xiyangyang_theme()
    print("\n生成 8-bit 音效...")
    gen_sfx('coin', sfx_coin)
    gen_sfx('click', sfx_click)
    gen_sfx('dispense', sfx_dispense)
    gen_sfx('ding', sfx_ding)
    gen_sfx('typewriter', sfx_typewriter)
    gen_sfx('turn', sfx_turn)
    gen_sfx('easter', sfx_easter)
    print("\n✓ 全部音频生成完成")

if __name__ == '__main__':
    main()
