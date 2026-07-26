"""
Me-Toon 素材下载与 Y2K 滤镜处理脚本
- 下载 Bliss 壁纸、QQ 企鹅等网络素材
- 通过 trae text_to_image API 生成像素艺术素材
- 应用 Y2K 噪点朦胧滤镜（千禧年代 CRT 显像管风格）
"""
import os
import sys
import urllib.request
import urllib.parse
import json
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import random

# ROOT 是项目根目录（脚本的上一级）
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'public', 'assets', 'images')
AUDIO = os.path.join(ROOT, 'public', 'assets', 'audio')

# 确保目录存在
for sub in ['desktop', 'gacha', 'detail/cartoons/tutu/characters', 'radio', 'collection', 'lobby']:
    os.makedirs(os.path.join(ASSETS, sub), exist_ok=True)
os.makedirs(os.path.join(AUDIO, 'songs'), exist_ok=True)
os.makedirs(os.path.join(AUDIO, 'sfx'), exist_ok=True)

# 通用请求头
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept': 'image/*,*/*;q=0.8',
}

def download(url, save_path, timeout=30):
    """下载文件"""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            if len(data) < 1000:
                print(f"  ✗ 文件太小 ({len(data)} bytes), 可能不是有效图片: {url}")
                return False
            with open(save_path, 'wb') as f:
                f.write(data)
            print(f"  ✓ 下载成功: {save_path} ({len(data)} bytes)")
            return True
    except Exception as e:
        print(f"  ✗ 下载失败: {url} -> {e}")
        return False

def generate_image(prompt, save_path, image_size='square_hd'):
    """通过 trae text_to_image API 生成图片"""
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={encoded_prompt}&image_size={image_size}"
    return download(url, save_path, timeout=120)

# ============================================================
# Y2K 噪点朦胧滤镜
# 模拟千禧年代 CRT 显示器、扫描线、轻微色噪、整体偏暖色温
# ============================================================
def apply_y2k_filter(img_path, output_path=None, intensity='medium'):
    """对图片应用 Y2K 滤镜"""
    if output_path is None:
        output_path = img_path

    try:
        img = Image.open(img_path).convert('RGB')
    except Exception as e:
        print(f"  ✗ 无法打开 {img_path}: {e}")
        return False

    # 1. 轻微高斯模糊（朦胧感）
    blur_radius = {'low': 0.3, 'medium': 0.5, 'high': 0.8}.get(intensity, 0.5)
    img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    # 2. 增加 JPEG 压缩伪影感（先缩小再放大）
    w, h = img.size
    small = img.resize((max(1, w // 2), max(1, h // 2)), Image.LANCZOS)
    img = small.resize((w, h), Image.LANCZOS)

    # 3. 添加高斯噪点
    noise_intensity = {'low': 8, 'medium': 15, 'high': 25}.get(intensity, 15)
    pixels = img.load()
    random.seed(42)
    for _ in range(w * h // 3):  # 给 1/3 像素加噪
        x = random.randint(0, w - 1)
        y = random.randint(0, h - 1)
        r, g, b = pixels[x, y]
        n = random.randint(-noise_intensity, noise_intensity)
        pixels[x, y] = (
            max(0, min(255, r + n)),
            max(0, min(255, g + n)),
            max(0, min(255, b + n))
        )

    # 4. 提高饱和度并稍微偏暖
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.15)
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.03)

    # 5. 添加扫描线（CRT 风格）
    overlay = Image.new('RGB', (w, h), (0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for y in range(0, h, 2):
        overlay_draw.line([(0, y), (w, y)], fill=(0, 0, 0))
    # 把扫描线以低透明度叠加
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.3))
    pixels_o = overlay.load()
    pixels_i = img.load()
    for y in range(0, h, 2):
        for x in range(0, w, 4):  # 间隔采样减少开销
            r, g, b = pixels_i[x, y]
            pixels_i[x, y] = (int(r * 0.92), int(g * 0.92), int(b * 0.92))

    # 6. 暗角（vignette）增加朦胧氛围
    vignette = Image.new('L', (w, h), 0)
    vig_draw = ImageDraw.Draw(vignette)
    for i in range(40):
        alpha = int(255 * (i / 40))
        margin = i * 2
        vig_draw.rectangle(
            [margin, margin, w - margin, h - margin],
            outline=alpha
        )
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=30))
    # 把暗角作为黑色遮罩叠加上去
    black = Image.new('RGB', (w, h), (0, 0, 0))
    img = Image.composite(img, black, vignette)

    # 7. 保存为高质量 JPEG（让压缩伪影再添一层年代感）
    if output_path.lower().endswith(('.jpg', '.jpeg')):
        img.save(output_path, 'JPEG', quality=82)
    else:
        img.save(output_path)
    print(f"  ✓ Y2K 滤镜应用: {output_path}")
    return True

# ============================================================
# 主流程
# ============================================================
def main():
    print("=" * 60)
    print("Me-Toon 素材下载与处理")
    print("=" * 60)

    # ---------- 1. XP Bliss 壁纸（用 API 生成怀旧版） ----------
    print("\n[1/14] XP Bliss 风格壁纸")
    bliss_path = os.path.join(ASSETS, 'desktop', 'bliss-bg.jpg')
    bliss_urls = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Windows_XP_Bliss.jpg/1280px-Windows_XP_Bliss.jpg',
        'https://upload.wikimedia.org/wikipedia/en/c/c6/Windows_XP_Bliss.jpg',
    ]
    bliss_ok = False
    for url in bliss_urls:
        if download(url, bliss_path):
            bliss_ok = True
            break
    if not bliss_ok:
        # 网络不通时，用 API 生成一张 XP Bliss 风格的怀旧图
        generate_image(
            'Windows XP Bliss style wallpaper, rolling green grassy hill under bright blue sky, '
            'fluffy white cumulus clouds, soft sunlight, peaceful pastoral landscape, '
            'nostalgic 2000s operating system default wallpaper aesthetic, '
            'wide landscape composition, vivid colors, photographic style',
            bliss_path, 'landscape_4_3'
        )
    if os.path.exists(bliss_path):
        apply_y2k_filter(bliss_path, bliss_path, 'low')

    # ---------- 2. 像素图标（生成） ----------
    print("\n[2/14] 像素图标 - 电视机")
    icon_tv = os.path.join(ASSETS, 'desktop', 'icon-tv.png')
    generate_image(
        'A retro 48x48 pixel art icon of an old CRT television set, '
        'Windows XP style desktop icon, silver-gray body with blue screen, '
        'two antennas on top, pixelated, transparent background, sharp pixels, '
        'nostalgic 2000s computer icon style',
        icon_tv, 'square_hd'
    )

    print("\n[3/14] 像素图标 - 日记本")
    icon_diary = os.path.join(ASSETS, 'desktop', 'icon-diary.png')
    generate_image(
        'A retro 48x48 pixel art icon of a diary book, '
        'pink cover with yellow pages, small lock on the side, '
        'Windows XP style desktop icon, pixelated, transparent background, '
        'sharp pixels, nostalgic 2000s computer icon style',
        icon_diary, 'square_hd'
    )

    print("\n[4/14] 像素图标 - MP3 播放器")
    icon_mp3 = os.path.join(ASSETS, 'desktop', 'icon-mp3.png')
    generate_image(
        'A retro 48x48 pixel art icon of an old MP3 player, '
        'blue body with green screen showing music note, two round buttons, '
        'Windows XP style desktop icon, pixelated, transparent background, '
        'sharp pixels, nostalgic 2000s computer icon style',
        icon_mp3, 'square_hd'
    )

    print("\n[5/14] 像素图标 - 地球")
    icon_globe = os.path.join(ASSETS, 'desktop', 'icon-globe.png')
    generate_image(
        'A retro 48x48 pixel art icon of a globe, '
        'blue ocean with green continents, silver stand, '
        'Windows XP style desktop icon, pixelated, transparent background, '
        'sharp pixels, nostalgic 2000s computer icon style',
        icon_globe, 'square_hd'
    )

    # ---------- 3. QQ 企鹅 ----------
    print("\n[6/14] 像素 QQ 企鹅")
    qq_path = os.path.join(ASSETS, 'desktop', 'qq-penguin.png')
    qq_ok = download(
        'https://www.pngsucai.com/png/10009827.html',  # 这个无法直接下载
        qq_path
    )
    if not qq_ok:
        # 用 API 生成
        generate_image(
            'A 16x16 pixel art icon of QQ penguin mascot, '
            'black penguin with red scarf, white eyes, yellow beak, '
            'Tencent QQ logo, transparent background, sharp pixels, '
            'retro 2000s pixel art style',
            qq_path, 'square_hd'
        )

    # ---------- 4. 大风车头像 ----------
    print("\n[7/14] 大风车头像")
    dachentou_path = os.path.join(ASSETS, 'desktop', 'dachentou-avatar.png')
    generate_image(
        'A 32x32 pixel art icon of a colorful windmill pinwheel, '
        'CCTV children program Big Windmill Da Feng Che logo style, '
        'red yellow blue green blades, blue sky background, '
        'transparent background, sharp pixels, nostalgic 2000s pixel art',
        dachentou_path, 'square_hd'
    )

    # ---------- 5. 扭蛋机相关素材 ----------
    print("\n[8/14] 像素星空背景")
    starfield_path = os.path.join(ASSETS, 'gacha', 'starfield-bg.jpg')
    generate_image(
        'A wide pixel art starry night sky background, '
        'deep blue and purple gradient, many small twinkling stars, '
        'some larger glowing stars, distant nebula clouds, '
        '8-bit retro game background, nostalgic 2000s pixel art style, '
        'horizontal landscape composition',
        starfield_path, 'landscape_16_9'
    )
    if os.path.exists(starfield_path):
        apply_y2k_filter(starfield_path, starfield_path, 'medium')

    print("\n[9/14] 像素瓷砖地板")
    floor_path = os.path.join(ASSETS, 'gacha', 'floor.png')
    generate_image(
        'Pixel art tile floor in perspective view, '
        'blue and white checkered tiles, retro 8-bit game ground, '
        'seen from low angle, vanishing point perspective, '
        'nostalgic 2000s arcade game style',
        floor_path, 'landscape_16_9'
    )

    print("\n[10/14] 扭蛋机主体")
    gacha_path = os.path.join(ASSETS, 'gacha', 'gacha-machine.png')
    generate_image(
        'A retro pixel art gashapon gacha capsule toy vending machine, '
        'tall vertical machine with transparent dome full of colorful capsule balls, '
        'silver metal base with coin slot, large round twist knob, '
        'pink and gold neon trim, capsule dispensing door at bottom, '
        '8-bit pixel art style, transparent background, sharp pixels, '
        'nostalgic Japanese arcade machine illustration',
        gacha_path, 'portrait_4_3'
    )

    # ---------- 6. 信纸纹理 ----------
    print("\n[11/14] 泛黄信纸纹理")
    letter_path = os.path.join(ASSETS, 'detail', 'letter-paper.jpg')
    generate_image(
        'Aged yellow letter paper texture with horizontal blue lines, '
        'vintage stationery, slightly torn edges, soft paper grain, '
        'warm cream color, nostalgic retro writing paper background, '
        'subtle paper folds and shadows, sentimental 2000s memory',
        letter_path, 'landscape_4_3'
    )
    if os.path.exists(letter_path):
        apply_y2k_filter(letter_path, letter_path, 'low')

    # ---------- 7. 大耳朵图图专用素材 ----------
    print("\n[12/14] 大耳朵图图 - 导演+图图像素肖像")
    portrait_path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'portrait.png')
    generate_image(
        'Pixel art portrait of a Chinese cartoon boy with big round head '
        'and very large ears, three-year-old child, short black hair, '
        'big bright eyes, wearing red and yellow outfit, '
        'next to a smiling adult director figure, '
        '8-bit pixel art style, transparent background, '
        'nostalgic Chinese animation Big Ear Tutu style, 120x120',
        portrait_path, 'square_hd'
    )

    print("\n[13/14] 大耳朵图图 - 首帧截图")
    first_frame_path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'first-frame.png')
    generate_image(
        'Pixel art scene of a happy Chinese family of three sitting on a green sofa '
        'in a warm living room, a young boy with big ears laughing between mom and dad, '
        'CRT TV in background, cozy cartoon style, 8-bit pixel art, '
        'nostalgic Chinese animation Big Ear Tutu style, 150x100',
        first_frame_path, 'landscape_4_3'
    )
    if os.path.exists(first_frame_path):
        apply_y2k_filter(first_frame_path, first_frame_path, 'medium')

    print("\n[14/14] 大耳朵图图 - 记忆星球")
    planet_path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'memory-planet.png')
    generate_image(
        'A small glowing planet sphere in pixel art style, '
        'warm golden yellow color, with silhouette of big cartoon ears on surface, '
        'soft outer glow, magical memory planet, 8-bit pixel art, '
        'transparent background, sharp pixels, 30x30',
        planet_path, 'square_hd'
    )

    print("\n" + "=" * 60)
    print("素材准备完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()
