"""
Me-Toon 像素素材生成器
直接用 PIL 绘制像素艺术图片，每张图都是手绘的独立像素艺术
应用 Y2K 噪点朦胧滤镜营造千禧年代 CRT 风格
"""
import os
import random
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'public', 'assets', 'images')

# 像素画调色板
PALETTE = {
    'black': (0, 0, 0),
    'white': (255, 255, 255),
    'xp_blue': (0, 84, 227),
    'xp_light_blue': (102, 178, 255),
    'xp_dark_blue': (10, 75, 192),
    'silver': (192, 192, 192),
    'silver_dark': (128, 128, 128),
    'silver_light': (220, 220, 220),
    'pink': (255, 102, 153),
    'pink_light': (255, 153, 204),
    'gold': (255, 204, 0),
    'gold_dark': (204, 153, 0),
    'green': (51, 255, 51),
    'green_dark': (0, 153, 51),
    'neon_green': (51, 255, 51),
    'red': (220, 50, 50),
    'red_dark': (153, 30, 30),
    'yellow': (255, 230, 100),
    'purple': (153, 102, 255),
    'brown': (139, 90, 43),
    'brown_dark': (90, 60, 30),
    'cream': (245, 230, 200),
    'wood': (160, 110, 70),
    'wood_dark': (110, 70, 40),
    'grass': (90, 145, 60),
    'grass_dark': (60, 110, 40),
    'sky_blue': (110, 178, 230),
    'sky_light': (180, 220, 245),
    'cloud': (255, 255, 255),
    'star_yellow': (255, 240, 150),
    'transparent': (0, 0, 0, 0),
}

def new_canvas(w, h, bg=(0, 0, 0, 0)):
    """创建透明画布"""
    return Image.new('RGBA', (w, h), bg)

def pixel(img, x, y, color):
    """在 (x, y) 位置画一个像素"""
    if isinstance(color, str):
        color = PALETTE[color]
    img.putpixel((x, y), color)

def rect(img, x0, y0, x1, y1, color):
    """画矩形（实心）"""
    if isinstance(color, str):
        color = PALETTE[color]
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if 0 <= x < img.width and 0 <= y < img.height:
                img.putpixel((x, y), color)

def rect_outline(img, x0, y0, x1, y1, color):
    """画矩形（边框）"""
    if isinstance(color, str):
        color = PALETTE[color]
    for x in range(x0, x1 + 1):
        img.putpixel((x, y0), color)
        img.putpixel((x, y1), color)
    for y in range(y0, y1 + 1):
        img.putpixel((x0, y), color)
        img.putpixel((x1, y), color)

def scale_up(img, scale):
    """像素画放大（保持锐利边缘）"""
    w, h = img.size
    return img.resize((w * scale, h * scale), Image.NEAREST)

# ============================================================
# Y2K 滤镜
# ============================================================
def apply_y2k_filter(img_path, output_path=None, intensity='medium', scanlines=True, vignette=True):
    if output_path is None:
        output_path = img_path
    try:
        img = Image.open(img_path).convert('RGB')
    except Exception as e:
        print(f"  ✗ 无法打开 {img_path}: {e}")
        return False

    w, h = img.size

    # 1. 轻微高斯模糊（朦胧感）
    blur_radius = {'low': 0.3, 'medium': 0.5, 'high': 0.8}.get(intensity, 0.5)
    img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    # 2. 添加高斯噪点
    noise_intensity = {'low': 6, 'medium': 12, 'high': 22}.get(intensity, 12)
    pixels = img.load()
    random.seed(42)
    for _ in range(w * h // 4):
        x = random.randint(0, w - 1)
        y = random.randint(0, h - 1)
        r, g, b = pixels[x, y][:3]
        n = random.randint(-noise_intensity, noise_intensity)
        pixels[x, y] = (
            max(0, min(255, r + n)),
            max(0, min(255, g + n)),
            max(0, min(255, b + n))
        )

    # 3. 提高饱和度并稍微偏暖
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.12)
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.04)

    # 4. 扫描线（CRT 风格）
    if scanlines:
        pixels = img.load()
        for y in range(0, h, 2):
            for x in range(w):
                r, g, b = pixels[x, y][:3]
                pixels[x, y] = (int(r * 0.92), int(g * 0.92), int(b * 0.92))

    # 5. 暗角
    if vignette:
        mask = Image.new('L', (w, h), 0)
        draw = ImageDraw.Draw(mask)
        min_dim = min(w, h)
        steps = max(8, min_dim // 4)
        for i in range(steps):
            alpha = int(255 * (i / steps))
            margin = i
            # 确保 margin 不超过图像边界
            if margin * 2 > min_dim:
                break
            draw.rectangle(
                [margin, margin, w - margin - 1, h - margin - 1],
                outline=alpha
            )
        mask = mask.filter(ImageFilter.GaussianBlur(radius=max(15, min_dim // 20)))
        # 把 mask 转成强化暗角效果
        dark_v = Image.new('RGB', (w, h), (20, 15, 30))
        img = Image.composite(img, dark_v, mask)

    if output_path.lower().endswith(('.jpg', '.jpeg')):
        img.save(output_path, 'JPEG', quality=85)
    else:
        # 保留 PNG
        img.save(output_path)
    print(f"  ✓ Y2K 滤镜应用: {output_path}")
    return True

# ============================================================
# 1. Bliss 风格壁纸（用 PIL 绘制）
# ============================================================
def gen_bliss_wallpaper():
    print("\n[1] Bliss 风格壁纸")
    path = os.path.join(ASSETS, 'desktop', 'bliss-bg.jpg')
    # 大尺寸 - 1280x960
    img = Image.new('RGB', (320, 240))  # 像素画原图，最后放大
    draw = ImageDraw.Draw(img)

    # 天空渐变
    for y in range(160):
        ratio = y / 160
        r = int(70 + (180 - 70) * ratio)
        g = int(140 + (220 - 140) * ratio)
        b = int(230 + (245 - 230) * ratio)
        draw.line([(0, y), (320, y)], fill=(r, g, b))

    # 云朵
    clouds = [
        (40, 40, 30, 8), (60, 35, 25, 6), (80, 42, 20, 7),
        (180, 30, 35, 9), (210, 28, 28, 7), (240, 35, 22, 6),
        (130, 60, 18, 5),
    ]
    for cx, cy, cw, ch in clouds:
        for dx in range(cw):
            for dy in range(ch):
                if 0 <= cx + dx < 320 and 0 <= cy + dy < 160:
                    # 椭圆形云朵
                    nx = (dx - cw / 2) / (cw / 2)
                    ny = (dy - ch / 2) / (ch / 2)
                    if nx * nx + ny * ny <= 1:
                        img.putpixel((cx + dx, cy + dy), (255, 255, 255))

    # 远山
    draw.polygon([(0, 150), (50, 130), (100, 145), (150, 125), (200, 140),
                  (250, 130), (300, 145), (320, 135), (320, 170), (0, 170)],
                 fill=(130, 160, 110))

    # 草地（带渐变）
    for y in range(160, 240):
        ratio = (y - 160) / 80
        r = int(140 - 60 * ratio)
        g = int(180 - 50 * ratio)
        b = int(80 - 30 * ratio)
        draw.line([(0, y), (320, y)], fill=(r, g, b))

    # 草地纹理点
    random.seed(7)
    for _ in range(800):
        x = random.randint(0, 319)
        y = random.randint(160, 239)
        r, g, b = img.getpixel((x, y))
        if random.random() > 0.5:
            img.putpixel((x, y), (max(0, r-20), max(0, g-15), max(0, b-10)))
        else:
            img.putpixel((x, y), (min(255, r+25), min(255, g+20), min(255, b+15)))

    # 放大到 1280x960
    img = img.resize((1280, 960), Image.NEAREST)
    img.save(path, 'JPEG', quality=90)
    apply_y2k_filter(path, path, 'low', scanlines=False)

# ============================================================
# 2. 桌面图标 - 电视机
# ============================================================
def gen_icon_tv():
    print("\n[2] 桌面图标 - 电视机")
    path = os.path.join(ASSETS, 'desktop', 'icon-tv.png')
    img = new_canvas(16, 16)
    # 电视机外壳
    rect(img, 3, 5, 12, 12, 'silver')
    rect_outline(img, 3, 5, 12, 12, 'silver_dark')
    # 屏幕
    rect(img, 4, 6, 11, 10, 'xp_blue')
    rect_outline(img, 4, 6, 11, 10, 'black')
    # 屏幕高光
    pixel(img, 5, 7, 'xp_light_blue')
    pixel(img, 6, 7, 'xp_light_blue')
    pixel(img, 5, 8, 'xp_light_blue')
    # 天线
    pixel(img, 5, 3, 'silver_dark')
    pixel(img, 6, 2, 'silver_dark')
    pixel(img, 10, 3, 'silver_dark')
    pixel(img, 9, 2, 'silver_dark')
    # 底座
    pixel(img, 5, 13, 'silver_dark')
    pixel(img, 6, 13, 'silver_dark')
    pixel(img, 9, 13, 'silver_dark')
    pixel(img, 10, 13, 'silver_dark')
    pixel(img, 4, 14, 'silver_dark')
    pixel(img, 11, 14, 'silver_dark')
    # 旋钮
    pixel(img, 11, 11, 'gold')
    img = scale_up(img, 3)  # 48x48
    img.save(path)

# ============================================================
# 3. 桌面图标 - 日记本
# ============================================================
def gen_icon_diary():
    print("\n[3] 桌面图标 - 日记本")
    path = os.path.join(ASSETS, 'desktop', 'icon-diary.png')
    img = new_canvas(16, 16)
    # 封面
    rect(img, 3, 3, 13, 13, 'pink')
    rect_outline(img, 3, 3, 13, 13, 'red_dark')
    # 内页
    rect(img, 4, 4, 12, 12, 'cream')
    rect_outline(img, 4, 4, 12, 12, 'silver_dark')
    # 装订线
    rect(img, 3, 3, 4, 13, 'silver_dark')
    rect(img, 5, 3, 5, 13, 'silver_dark')
    # 横线
    for y in [6, 8, 10]:
        rect(img, 6, y, 11, y, 'xp_light_blue')
    # 锁
    rect(img, 11, 7, 13, 9, 'gold')
    rect_outline(img, 11, 7, 13, 9, 'gold_dark')
    pixel(img, 12, 8, 'gold_dark')
    img = scale_up(img, 3)
    img.save(path)

# ============================================================
# 4. 桌面图标 - MP3 播放器
# ============================================================
def gen_icon_mp3():
    print("\n[4] 桌面图标 - MP3 播放器")
    path = os.path.join(ASSETS, 'desktop', 'icon-mp3.png')
    img = new_canvas(16, 16)
    # 主体
    rect(img, 4, 2, 11, 13, 'xp_blue')
    rect_outline(img, 4, 2, 11, 13, 'xp_dark_blue')
    # 屏幕
    rect(img, 5, 4, 10, 7, 'black')
    rect_outline(img, 5, 4, 10, 7, 'silver_dark')
    # 屏幕内容 - 音符
    pixel(img, 7, 5, 'neon_green')
    pixel(img, 7, 6, 'neon_green')
    pixel(img, 8, 5, 'neon_green')
    pixel(img, 9, 6, 'neon_green')
    # 按钮
    pixel(img, 6, 10, 'white')
    pixel(img, 7, 10, 'silver_dark')
    pixel(img, 8, 10, 'white')
    pixel(img, 9, 10, 'silver_dark')
    pixel(img, 7, 11, 'gold')
    pixel(img, 8, 11, 'gold')
    pixel(img, 7, 12, 'silver_dark')
    pixel(img, 8, 12, 'silver_dark')
    img = scale_up(img, 3)
    img.save(path)

# ============================================================
# 5. 桌面图标 - 地球
# ============================================================
def gen_icon_globe():
    print("\n[5] 桌面图标 - 地球")
    path = os.path.join(ASSETS, 'desktop', 'icon-globe.png')
    img = new_canvas(16, 16)
    # 球体
    for y in range(4, 12):
        for x in range(4, 12):
            nx = (x - 7.5) / 4
            ny = (y - 7.5) / 4
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['xp_blue'])
    # 经线
    for y in range(4, 12):
        if 0 <= y < 16:
            img.putpixel((7, y), PALETTE['green_dark'])
            img.putpixel((8, y), PALETTE['green_dark'])
    # 纬线
    for x in range(4, 12):
        img.putpixel((x, 6), PALETTE['green_dark'])
        img.putpixel((x, 9), PALETTE['green_dark'])
    # 大陆（绿色斑块）
    for px, py in [(5, 5), (6, 5), (9, 5), (10, 6), (5, 8), (6, 9), (9, 9), (10, 10)]:
        img.putpixel((px, py), PALETTE['green'])
    # 高光
    pixel(img, 5, 5, 'xp_light_blue')
    # 支架
    rect(img, 7, 12, 8, 13, 'silver_dark')
    rect(img, 5, 13, 10, 13, 'silver_dark')
    rect(img, 6, 14, 9, 14, 'silver_dark')
    img = scale_up(img, 3)
    img.save(path)

# ============================================================
# 6. QQ 企鹅
# ============================================================
def gen_qq_penguin():
    print("\n[6] 像素 QQ 企鹅")
    path = os.path.join(ASSETS, 'desktop', 'qq-penguin.png')
    img = new_canvas(16, 16)
    # 身体（黑色椭圆）
    body_pixels = [
        (5, 4), (6, 4), (7, 4), (8, 4), (9, 4), (10, 4),
        (4, 5), (5, 5), (6, 5), (7, 5), (8, 5), (9, 5), (10, 5), (11, 5),
        (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (9, 6), (10, 6), (11, 6),
        (4, 7), (5, 7), (6, 7), (7, 7), (8, 7), (9, 7), (10, 7), (11, 7),
        (4, 8), (5, 8), (6, 8), (7, 8), (8, 8), (9, 8), (10, 8), (11, 8),
        (5, 9), (6, 9), (7, 9), (8, 9), (9, 9), (10, 9),
        (5, 10), (6, 10), (7, 10), (8, 10), (9, 10), (10, 10),
        (5, 11), (6, 11), (7, 11), (8, 11), (9, 11), (10, 11),
    ]
    for x, y in body_pixels:
        img.putpixel((x, y), PALETTE['black'])
    # 白肚子
    belly = [
        (6, 7), (7, 7), (8, 7), (9, 7),
        (6, 8), (7, 8), (8, 8), (9, 8),
        (7, 9), (8, 9),
    ]
    for x, y in belly:
        img.putpixel((x, y), PALETTE['white'])
    # 红围巾
    for x in range(4, 12):
        img.putpixel((x, 6), PALETTE['red'])
    img.putpixel((11, 7), PALETTE['red'])
    # 眼睛
    pixel(img, 6, 5, 'black')
    pixel(img, 9, 5, 'black')
    pixel(img, 6, 5, 'white')  # 眼白覆盖
    pixel(img, 9, 5, 'white')
    pixel(img, 7, 5, 'black')  # 瞳孔
    pixel(img, 8, 5, 'black')
    # 嘴（黄色）
    pixel(img, 7, 6, 'yellow')
    pixel(img, 8, 6, 'yellow')
    # 脚（橙色）
    pixel(img, 5, 12, 'gold')
    pixel(img, 6, 12, 'gold')
    pixel(img, 9, 12, 'gold')
    pixel(img, 10, 12, 'gold')
    img = scale_up(img, 1)  # 16x16
    img.save(path)

# ============================================================
# 7. 大风车头像
# ============================================================
def gen_dachentou_avatar():
    print("\n[7] 大风车头像")
    path = os.path.join(ASSETS, 'desktop', 'dachentou-avatar.png')
    img = new_canvas(32, 32)
    # 蓝色背景圆
    for y in range(32):
        for x in range(32):
            nx = (x - 15.5) / 15
            ny = (y - 15.5) / 15
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['sky_blue'])
    # 大风车叶片（4片）
    center = (15, 15)
    blades = [
        ('red', [(15, 15), (15, 14), (16, 13), (16, 12), (15, 11), (14, 12), (14, 13)]),  # 上
        ('gold', [(15, 15), (16, 15), (17, 16), (18, 16), (19, 15), (18, 14), (17, 14)]),  # 右
        ('green', [(15, 15), (15, 16), (14, 17), (14, 18), (15, 19), (16, 18), (16, 17)]),  # 下
        ('purple', [(15, 15), (14, 15), (13, 14), (12, 14), (11, 15), (12, 16), (13, 16)]),  # 左
    ]
    for color, pixels_list in blades:
        for x, y in pixels_list:
            if 0 <= x < 32 and 0 <= y < 32:
                img.putpixel((x, y), PALETTE[color])
    # 中心点
    pixel(img, 15, 15, 'white')
    pixel(img, 16, 15, 'white')
    pixel(img, 15, 16, 'white')
    pixel(img, 16, 16, 'white')
    img = scale_up(img, 1)  # 32x32
    img.save(path)

# ============================================================
# 8. 像素星空背景
# ============================================================
def gen_starfield():
    print("\n[8] 像素星空背景")
    path = os.path.join(ASSETS, 'gacha', 'starfield-bg.jpg')
    img = Image.new('RGB', (320, 240))
    draw = ImageDraw.Draw(img)
    # 渐变背景
    for y in range(240):
        ratio = y / 240
        r = int(15 + 35 * ratio)
        g = int(10 + 25 * ratio)
        b = int(45 + 60 * ratio)
        draw.line([(0, y), (320, y)], fill=(r, g, b))
    # 星云
    random.seed(13)
    for _ in range(8):
        cx = random.randint(0, 320)
        cy = random.randint(0, 240)
        radius = random.randint(30, 60)
        color = random.choice([(80, 50, 120), (50, 80, 140), (120, 60, 100)])
        for y in range(max(0, cy - radius), min(240, cy + radius)):
            for x in range(max(0, cx - radius), min(320, cx + radius)):
                dx = x - cx
                dy = y - cy
                d = (dx * dx + dy * dy) ** 0.5
                if d < radius:
                    alpha = 1 - d / radius
                    r0, g0, b0 = img.getpixel((x, y))
                    img.putpixel((x, y), (
                        min(255, int(r0 + color[0] * alpha * 0.3)),
                        min(255, int(g0 + color[1] * alpha * 0.3)),
                        min(255, int(b0 + color[2] * alpha * 0.3))
                    ))
    # 星星
    for _ in range(150):
        x = random.randint(0, 319)
        y = random.randint(0, 239)
        brightness = random.randint(150, 255)
        size = random.choice([1, 1, 1, 1, 2])
        if size == 1:
            img.putpixel((x, y), (brightness, brightness, brightness - 20 if brightness > 20 else 0))
        else:
            for dx in range(-1, 2):
                for dy in range(-1, 2):
                    if 0 <= x + dx < 320 and 0 <= y + dy < 240:
                        img.putpixel((x + dx, y + dy), (brightness, brightness, brightness))
    # 大星星（带光芒）
    for _ in range(5):
        x = random.randint(20, 300)
        y = random.randint(20, 200)
        img.putpixel((x, y), PALETTE['star_yellow'])
        for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
            if 0 <= x + dx < 320 and 0 <= y + dy < 240:
                img.putpixel((x + dx, y + dy), (255, 220, 100))
    # 放大
    img = img.resize((1280, 960), Image.NEAREST)
    img.save(path, 'JPEG', quality=90)
    apply_y2k_filter(path, path, 'medium')

# ============================================================
# 9. 像素瓷砖地板
# ============================================================
def gen_floor():
    print("\n[9] 像素瓷砖地板")
    path = os.path.join(ASSETS, 'gacha', 'floor.png')
    img = Image.new('RGB', (320, 80))
    # 透视瓷砖
    for y in range(80):
        ratio = y / 80
        # 越远越窄
        tile_w = int(8 + 30 * ratio)
        for x in range(320):
            # 计算属于哪个瓷砖
            offset = (320 // 2) - (tile_w * (320 // tile_w // 2))
            tx = (x - offset) // tile_w if tile_w > 0 else 0
            # 瓷砖颜色（蓝白交替）
            ty = y // 8
            if (tx + ty) % 2 == 0:
                color = (180, 200, 230)
            else:
                color = (90, 120, 180)
            r, g, b = color
            # 远处变暗
            r = int(r * (0.5 + 0.5 * ratio))
            g = int(g * (0.5 + 0.5 * ratio))
            b = int(b * (0.5 + 0.5 * ratio))
            img.putpixel((x, y), (r, g, b))
    img = img.resize((1280, 320), Image.NEAREST)
    img.save(path)
    apply_y2k_filter(path, path, 'low')

# ============================================================
# 10. 扭蛋机主体
# ============================================================
def gen_gacha_machine():
    print("\n[10] 扭蛋机主体")
    path = os.path.join(ASSETS, 'gacha', 'gacha-machine.png')
    img = new_canvas(60, 100)
    # 顶部穹顶（半圆）
    for y in range(20):
        for x in range(20, 40):
            nx = (x - 30) / 10
            ny = (y - 20) / 10
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['gold'])
    # 球仓（透明）
    rect(img, 10, 20, 50, 60, 'white')
    rect_outline(img, 10, 20, 50, 60, 'silver_dark')
    # 球仓内的彩色球
    random.seed(5)
    balls = [
        (15, 25, 'pink'), (25, 28, 'xp_blue'), (35, 25, 'gold'),
        (45, 30, 'green'), (20, 35, 'purple'), (30, 38, 'red'),
        (40, 35, 'xp_light_blue'), (15, 45, 'gold'), (25, 48, 'pink'),
        (35, 45, 'green'), (45, 48, 'xp_blue'), (30, 55, 'purple'),
    ]
    for bx, by, color in balls:
        # 画 3x3 小球
        for dx in range(-1, 2):
            for dy in range(-1, 2):
                if dx * dx + dy * dy <= 1:
                    px, py = bx + dx, by + dy
                    if 11 <= px <= 49 and 21 <= py <= 59:
                        img.putpixel((px, py), PALETTE[color])
        # 高光
        if 11 <= bx - 1 <= 49 and 21 <= by - 1 <= 59:
            img.putpixel((bx - 1, by - 1), PALETTE['white'])
    # 中段 - 标签牌
    rect(img, 10, 62, 50, 70, 'red')
    rect_outline(img, 10, 62, 50, 70, 'red_dark')
    rect(img, 12, 64, 48, 68, 'cream')
    # 标签上的文字（用像素表示）
    for x in range(14, 48, 2):
        pixel(img, x, 66, 'black')
    # 旋钮
    for y in range(72, 80):
        for x in range(25, 35):
            nx = (x - 30) / 5
            ny = (y - 76) / 4
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['silver'])
    pixel(img, 30, 74, 'silver_dark')
    pixel(img, 30, 75, 'silver_dark')
    # 投币口
    rect(img, 27, 82, 33, 84, 'black')
    rect_outline(img, 27, 82, 33, 84, 'gold')
    pixel(img, 28, 83, 'gold')
    # 出货口
    rect(img, 22, 86, 38, 94, 'silver_dark')
    rect_outline(img, 22, 86, 38, 94, 'black')
    rect(img, 24, 88, 36, 92, 'black')
    # 底座
    rect(img, 8, 95, 52, 99, 'silver_dark')
    rect_outline(img, 8, 95, 52, 99, 'black')
    # 放大 5 倍 = 300x500
    img = scale_up(img, 5)
    img.save(path)

# ============================================================
# 11. 泛黄信纸纹理
# ============================================================
def gen_letter_paper():
    print("\n[11] 泛黄信纸纹理")
    path = os.path.join(ASSETS, 'detail', 'letter-paper.jpg')
    img = Image.new('RGB', (320, 240))
    # 米色底
    for y in range(240):
        for x in range(320):
            # 渐变泛黄
            r = 245 + random.randint(-15, 5)
            g = 230 + random.randint(-15, 5)
            b = 200 + random.randint(-15, 5)
            r = max(220, min(255, r))
            g = max(200, min(245, g))
            b = max(170, min(220, b))
            img.putpixel((x, y), (r, g, b))
    # 横线
    for y in range(20, 240, 12):
        for x in range(10, 310):
            img.putpixel((x, y), (184, 200, 216))
    # 边缘撕痕（左右）
    random.seed(3)
    for y in range(240):
        for x in range(0, 3):
            if random.random() > 0.5:
                img.putpixel((x, y), (200, 180, 150))
        for x in range(317, 320):
            if random.random() > 0.5:
                img.putpixel((x, y), (200, 180, 150))
    # 轻微褶皱
    for _ in range(20):
        x = random.randint(0, 319)
        y = random.randint(0, 239)
        for dx in range(random.randint(10, 30)):
            if 0 <= x + dx < 320:
                r, g, b = img.getpixel((x + dx, y))
                img.putpixel((x + dx, y), (max(0, r - 15), max(0, g - 15), max(0, b - 10)))
    # 噪点
    for _ in range(800):
        x = random.randint(0, 319)
        y = random.randint(0, 239)
        r, g, b = img.getpixel((x, y))
        n = random.randint(-10, 10)
        img.putpixel((x, y), (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n))))
    # 放大
    img = img.resize((800, 600), Image.NEAREST)
    img.save(path, 'JPEG', quality=88)
    apply_y2k_filter(path, path, 'low', scanlines=False)

# ============================================================
# 12. 大耳朵图图 - 像素肖像
# ============================================================
def gen_tutu_portrait():
    print("\n[12] 大耳朵图图 - 像素肖像")
    path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'portrait.png')
    img = new_canvas(40, 40)
    # 图图（左边）- 大圆头 + 大耳朵
    # 头部
    for y in range(8, 22):
        for x in range(6, 22):
            nx = (x - 14) / 8
            ny = (y - 15) / 7
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))  # 肤色
    # 大耳朵（左右）
    for y in range(11, 19):
        for x in range(2, 7):
            nx = (x - 4) / 3
            ny = (y - 15) / 4
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
        for x in range(21, 26):
            nx = (x - 24) / 3
            ny = (y - 15) / 4
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
    # 头发（黑色）
    for x in range(8, 22):
        for y in range(7, 11):
            nx = (x - 14) / 8
            ny = (y - 9) / 2
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['black'])
    # 眼睛
    rect(img, 10, 14, 12, 16, 'black')
    rect(img, 16, 14, 18, 16, 'black')
    pixel(img, 11, 15, 'white')
    pixel(img, 17, 15, 'white')
    # 嘴巴
    rect(img, 12, 18, 16, 19, 'red')
    # 衣服（红色）
    rect(img, 8, 22, 20, 32, 'red')
    rect_outline(img, 8, 22, 20, 32, 'red_dark')
    # 衣服花纹
    for x in range(10, 20, 2):
        pixel(img, x, 26, 'yellow')
        pixel(img, x, 28, 'yellow')

    # 导演（右边）- 简化的成人形象
    # 头部
    for y in range(8, 22):
        for x in range(26, 38):
            nx = (x - 32) / 6
            ny = (y - 15) / 7
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
    # 头发
    for x in range(26, 38):
        for y in range(7, 11):
            img.putpixel((x, y), (140, 100, 60))
    # 眼睛
    rect(img, 28, 14, 29, 15, 'black')
    rect(img, 34, 14, 35, 15, 'black')
    # 嘴
    rect(img, 30, 18, 33, 19, 'red')
    # 衣服（蓝色）
    rect(img, 25, 22, 38, 32, 'xp_blue')
    rect_outline(img, 25, 22, 38, 32, 'xp_dark_blue')
    # 笑脸标记
    pixel(img, 31, 26, 'white')

    img = scale_up(img, 3)  # 120x120
    img.save(path)
    apply_y2k_filter(path, path, 'low', scanlines=False)

# ============================================================
# 13. 大耳朵图图 - 首帧截图
# ============================================================
def gen_tutu_first_frame():
    print("\n[13] 大耳朵图图 - 首帧截图")
    path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'first-frame.png')
    img = new_canvas(60, 40)
    # 客厅背景墙
    rect(img, 0, 0, 60, 25, (245, 220, 180))
    # 地板
    rect(img, 0, 25, 60, 40, 'wood')
    # 木纹
    for y in range(25, 40, 2):
        for x in range(0, 60, 6):
            pixel(img, x, y, 'wood_dark')
    # 沙发（绿色）
    rect(img, 8, 18, 30, 28, 'green_dark')
    rect(img, 8, 16, 12, 28, 'green_dark')
    rect(img, 26, 16, 30, 28, 'green_dark')
    rect(img, 8, 16, 30, 18, 'green')
    # 沙发格子
    for x in range(10, 30, 4):
        for y in range(20, 28, 4):
            pixel(img, x, y, 'green')
    # 电视（背景）
    rect(img, 40, 5, 56, 18, 'silver')
    rect_outline(img, 40, 5, 56, 18, 'silver_dark')
    rect(img, 42, 7, 54, 16, 'xp_blue')
    # 电视雪花点
    random.seed(2)
    for _ in range(20):
        x = random.randint(42, 54)
        y = random.randint(7, 16)
        img.putpixel((x, y), PALETTE['white'])
    # 三个人物（简化）
    # 爸爸（左）
    rect(img, 11, 12, 15, 20, 'xp_blue')
    for y in range(8, 13):
        for x in range(11, 16):
            nx = (x - 13) / 2.5
            ny = (y - 10) / 2.5
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
    # 图图（中）
    rect(img, 19, 14, 23, 20, 'red')
    for y in range(10, 15):
        for x in range(19, 24):
            nx = (x - 21) / 2.5
            ny = (y - 12) / 2.5
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
    # 大耳朵
    pixel(img, 17, 12, (255, 220, 180))
    pixel(img, 18, 12, (255, 220, 180))
    pixel(img, 24, 12, (255, 220, 180))
    pixel(img, 25, 12, (255, 220, 180))
    # 妈妈（右）
    rect(img, 26, 12, 30, 20, 'pink')
    for y in range(8, 13):
        for x in range(26, 31):
            nx = (x - 28) / 2.5
            ny = (y - 10) / 2.5
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (255, 220, 180))
    # 笑脸（表示开心）
    pixel(img, 12, 11, 'black')
    pixel(img, 14, 11, 'black')
    pixel(img, 13, 12, 'red')
    pixel(img, 20, 12, 'black')
    pixel(img, 22, 12, 'black')
    pixel(img, 21, 13, 'red')
    pixel(img, 27, 11, 'black')
    pixel(img, 29, 11, 'black')
    pixel(img, 28, 12, 'red')

    img = scale_up(img, 3)  # 180x120 ~ 150x100
    # 裁剪到 150x100
    img = img.crop((0, 0, 150, 100))
    # 重新创建画布到 150x100
    canvas = Image.new('RGBA', (150, 100), (0, 0, 0, 0))
    canvas.paste(img, (0, 0))
    canvas.save(path)
    apply_y2k_filter(path, path, 'medium')

# ============================================================
# 14. 大耳朵图图 - 记忆星球
# ============================================================
def gen_tutu_memory_planet():
    print("\n[14] 大耳朵图图 - 记忆星球")
    path = os.path.join(ASSETS, 'detail', 'cartoons', 'tutu', 'memory-planet.png')
    img = new_canvas(16, 16)
    # 球体（金色）
    for y in range(16):
        for x in range(16):
            nx = (x - 7.5) / 7
            ny = (y - 7.5) / 7
            if nx * nx + ny * ny <= 1:
                # 渐变
                d = (nx * nx + ny * ny) ** 0.5
                r = int(255 - 30 * d)
                g = int(204 - 50 * d)
                b = int(50 + 50 * d)
                img.putpixel((x, y), (max(0, r), max(0, g), max(0, b), 255))
    # 大耳朵剪影（中间）
    # 左耳
    for y in range(5, 11):
        for x in range(4, 7):
            nx = (x - 5) / 2
            ny = (y - 8) / 3
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (200, 100, 30, 255))
    # 右耳
    for y in range(5, 11):
        for x in range(9, 12):
            nx = (x - 10) / 2
            ny = (y - 8) / 3
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), (200, 100, 30, 255))
    # 中心点
    rect(img, 7, 7, 8, 9, (200, 100, 30, 255))
    # 高光
    pixel(img, 4, 4, (255, 240, 150, 255))
    pixel(img, 5, 4, (255, 240, 150, 255))
    img = scale_up(img, 2)  # 32x32
    img.save(path)

# ============================================================
# 主函数
# ============================================================
def main():
    print("=" * 60)
    print("Me-Toon 像素素材生成器")
    print("=" * 60)
    gen_bliss_wallpaper()
    gen_icon_tv()
    gen_icon_diary()
    gen_icon_mp3()
    gen_icon_globe()
    gen_qq_penguin()
    gen_dachentou_avatar()
    gen_starfield()
    gen_floor()
    gen_gacha_machine()
    gen_letter_paper()
    gen_tutu_portrait()
    gen_tutu_first_frame()
    gen_tutu_memory_planet()
    print("\n" + "=" * 60)
    print("✓ 全部素材生成完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()
