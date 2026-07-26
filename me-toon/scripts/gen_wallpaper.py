"""
生成主页壁纸 - 真实魔幻风
元素：气泡、星星、楼房、彩虹、太阳
风格：真实魔幻感（非像素风），色彩丰富、有氛围
尺寸：1280x720 (16:9)
"""
import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUTPUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      'public', 'assets', 'images', 'desktop', 'magic-wallpaper.jpg')
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

W, H = 1280, 720
random.seed(2025726)

# ============================================================
# 1. 渐变天空背景（魔幻紫粉橙）
# ============================================================
def make_gradient_bg():
    """渐变天空：深紫 → 粉紫 → 橙粉 → 浅金"""
    img = Image.new('RGB', (W, H))
    pixels = img.load()
    # 渐变色阶（从上到下）
    stops = [
        (0.00, (45, 35, 95)),       # 深紫
        (0.18, (95, 60, 145)),      # 紫罗兰
        (0.38, (185, 105, 165)),    # 粉紫
        (0.55, (240, 145, 165)),    # 粉橙
        (0.72, (255, 195, 145)),    # 桃橙
        (0.88, (255, 230, 175)),    # 浅金
        (1.00, (255, 245, 210)),    # 米黄
    ]
    for y in range(H):
        t = y / (H - 1)
        # 找到当前 t 所在的区间
        for i in range(len(stops) - 1):
            if stops[i][0] <= t <= stops[i+1][0]:
                t0, c0 = stops[i]
                t1, c1 = stops[i+1]
                k = (t - t0) / (t1 - t0)
                r = int(c0[0] + (c1[0] - c0[0]) * k)
                g = int(c0[1] + (c1[1] - c0[1]) * k)
                b = int(c0[2] + (c1[2] - c0[2]) * k)
                for x in range(W):
                    pixels[x, y] = (r, g, b)
                break
    return img

# ============================================================
# 2. 太阳（带光晕）
# ============================================================
def draw_sun(img):
    """在右上角画一个大太阳，带多层光晕"""
    cx, cy = int(W * 0.78), int(H * 0.32)
    # 多层光晕（从外到内）
    glow_layers = [
        (180, (255, 220, 150, 18)),
        (140, (255, 230, 170, 35)),
        (110, (255, 240, 190, 55)),
        (85,  (255, 245, 200, 90)),
        (65,  (255, 250, 220, 140)),
        (50,  (255, 252, 230, 200)),
        (38,  (255, 254, 240, 240)),
    ]
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for r, color in glow_layers:
        od.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
    # 太阳核心
    core_r = 28
    od.ellipse([cx-core_r, cy-core_r, cx+core_r, cy+core_r],
               fill=(255, 255, 245, 255))
    # 合成
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 3. 彩虹（半圆弧）
# ============================================================
def draw_rainbow(img):
    """在太阳下方画一道彩虹弧"""
    cx = int(W * 0.78)
    cy = int(H * 0.55)  # 彩虹圆心
    colors = [
        (255, 90, 90),    # 红
        (255, 150, 80),   # 橙
        (255, 215, 90),   # 黄
        (120, 220, 120),  # 绿
        (100, 180, 240),  # 蓝
        (130, 130, 220),  # 靛
        (180, 120, 220),  # 紫
    ]
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    base_r = 280
    thickness = 14
    for i, color in enumerate(colors):
        r = base_r - i * thickness
        alpha = 90 - i * 5
        od.ellipse([cx-r, cy-r, cx+r, cy+r],
                   outline=color + (alpha,),
                   width=thickness)
    # 高斯模糊让彩虹柔和
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=2))
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 4. 远处楼房剪影（城市天际线）
# ============================================================
def draw_cityscape(img):
    """画城市天际线 - 远近两层"""
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)

    # 远景楼房（更模糊、更淡）
    far_y = int(H * 0.62)
    far_color = (75, 55, 110, 130)
    x = 0
    random.seed(123)
    while x < W:
        bw = random.randint(40, 90)
        bh = random.randint(60, 140)
        od.rectangle([x, far_y - bh, x + bw, far_y], fill=far_color)
        # 远处窗户灯光（零星）
        if random.random() > 0.4:
            for _ in range(random.randint(1, 3)):
                wx = x + random.randint(5, max(6, bw - 5))
                wy = far_y - bh + random.randint(10, max(11, bh - 5))
                od.rectangle([wx, wy, wx + 3, wy + 3], fill=(255, 220, 150, 100))
        x += bw + random.randint(0, 4)

    far_layer = overlay.filter(ImageFilter.GaussianBlur(radius=1.5))
    img.paste(far_layer, (0, 0), far_layer)

    # 近景楼房（更清晰、更深）
    overlay2 = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od2 = ImageDraw.Draw(overlay2)
    near_y = int(H * 0.78)
    near_color = (45, 30, 75, 200)
    x = 0
    random.seed(456)
    while x < W:
        bw = random.randint(50, 110)
        bh = random.randint(100, 200)
        od2.rectangle([x, near_y - bh, x + bw, near_y], fill=near_color)
        # 屋顶细节（三角形屋顶）
        if random.random() > 0.6:
            od2.polygon([(x, near_y - bh), (x + bw // 2, near_y - bh - 20), (x + bw, near_y - bh)],
                        fill=(35, 20, 65, 220))
        # 窗户灯光（较多）
        win_color = (255, 215, 130, 220)
        cols = max(1, bw // 18)
        rows = max(1, bh // 22)
        for c in range(cols):
            for r in range(rows):
                if random.random() > 0.55:
                    wx = x + 6 + c * 16
                    wy = near_y - bh + 8 + r * 20
                    od2.rectangle([wx, wy, wx + 6, wy + 8], fill=win_color)
        x += bw + random.randint(0, 2)

    img.paste(overlay2, (0, 0), overlay2)
    return img

# ============================================================
# 5. 星星（散布在天空上部）
# ============================================================
def draw_stars(img):
    """在天空上部画星星"""
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    random.seed(789)
    # 大量小星星
    for _ in range(120):
        x = random.randint(0, W)
        y = random.randint(0, int(H * 0.45))
        brightness = random.randint(150, 255)
        size = random.choice([1, 1, 1, 2, 2, 3])
        alpha = random.randint(120, 255)
        od.ellipse([x-size, y-size, x+size, y+size],
                   fill=(brightness, brightness, brightness - 20, alpha))
    # 几颗大星星（带十字光芒）
    big_stars = [
        (int(W * 0.12), int(H * 0.18)),
        (int(W * 0.28), int(H * 0.10)),
        (int(W * 0.45), int(H * 0.22)),
        (int(W * 0.62), int(H * 0.08)),
        (int(W * 0.92), int(H * 0.15)),
    ]
    for cx, cy in big_stars:
        # 中心
        od.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 255, 240, 255))
        # 十字光芒
        od.line([(cx-12, cy), (cx+12, cy)], fill=(255, 255, 240, 180), width=1)
        od.line([(cx, cy-12), (cx, cy+12)], fill=(255, 255, 240, 180), width=1)
        # 斜光芒
        od.line([(cx-8, cy-8), (cx+8, cy+8)], fill=(255, 255, 240, 100), width=1)
        od.line([(cx-8, cy+8), (cx+8, cy-8)], fill=(255, 255, 240, 100), width=1)

    # 添加发光效果
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.6))
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 6. 气泡（飘浮在中间区域）
# ============================================================
def draw_bubbles(img):
    """画飘浮的气泡，带高光"""
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    random.seed(101)
    # 气泡位置和大小
    bubbles = []
    for _ in range(35):
        x = random.randint(50, W - 50)
        y = random.randint(int(H * 0.25), int(H * 0.75))
        r = random.randint(12, 45)
        bubbles.append((x, y, r))

    for cx, cy, r in bubbles:
        # 气泡主体（半透明，带淡彩色）
        hue_colors = [
            (180, 220, 255, 35),   # 浅蓝
            (255, 200, 230, 35),   # 浅粉
            (220, 255, 200, 35),   # 浅绿
            (255, 240, 180, 35),   # 浅黄
            (220, 200, 255, 35),   # 浅紫
        ]
        base_color = random.choice(hue_colors)
        # 外圈
        od.ellipse([cx-r, cy-r, cx+r, cy+r], fill=base_color)
        # 内部更透明
        inner_r = int(r * 0.85)
        od.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r],
                   fill=(255, 255, 255, 10))
        # 高光（左上）
        hl_r = max(2, r // 4)
        hl_x = cx - r // 3
        hl_y = cy - r // 3
        od.ellipse([hl_x-hl_r, hl_y-hl_r, hl_x+hl_r, hl_y+hl_r],
                   fill=(255, 255, 255, 180))
        # 小高光点
        od.ellipse([hl_x-1, hl_y-1, hl_x+1, hl_y+1],
                   fill=(255, 255, 255, 240))
        # 描边
        od.ellipse([cx-r, cy-r, cx+r, cy+r],
                   outline=(255, 255, 255, 80), width=1)

    # 轻微模糊让气泡更梦幻
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 7. 地面（草地 + 倒影）
# ============================================================
def draw_ground(img):
    """画底部地面/草地"""
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    ground_y = int(H * 0.78)
    # 草地渐变
    for y in range(ground_y, H):
        t = (y - ground_y) / (H - ground_y)
        r = int(70 + (40 - 70) * t)
        g = int(120 + (80 - 120) * t)
        b = int(90 + (60 - 90) * t)
        od.line([(0, y), (W, y)], fill=(r, g, b, 220))
    # 草地高光（顶部）
    od.line([(0, ground_y), (W, ground_y)], fill=(150, 200, 140, 180), width=2)
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 8. 整体氛围光（柔光叠加）
# ============================================================
def add_atmosphere(img):
    """添加整体氛围光 - 中心暖光"""
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    # 中心暖光
    cx, cy = int(W * 0.5), int(H * 0.4)
    for r in range(500, 0, -20):
        alpha = max(0, 8 - r // 60)
        if alpha > 0:
            od.ellipse([cx-r, cy-r, cx+r, cy+r],
                       fill=(255, 220, 180, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=30))
    img.paste(overlay, (0, 0), overlay)
    return img

# ============================================================
# 主流程
# ============================================================
def main():
    print('生成真实魔幻风壁纸...')
    print('  1/8 渐变天空背景')
    img = make_gradient_bg()
    print('  2/8 星星')
    img = draw_stars(img)
    print('  3/8 太阳')
    img = draw_sun(img)
    print('  4/8 彩虹')
    img = draw_rainbow(img)
    print('  5/8 远近楼房')
    img = draw_cityscape(img)
    print('  6/8 草地')
    img = draw_ground(img)
    print('  7/8 飘浮气泡')
    img = draw_bubbles(img)
    print('  8/8 整体氛围光')
    img = add_atmosphere(img)

    # 转 RGB 保存为 JPG（文件更小）
    final = img.convert('RGB')
    final.save(OUTPUT, 'JPEG', quality=88, optimize=True)
    print(f'\n✓ 壁纸已生成: {OUTPUT}')
    print(f'  尺寸: {W}x{H} (16:9)')
    fsize = os.path.getsize(OUTPUT)
    print(f'  文件大小: {fsize / 1024:.1f} KB')

if __name__ == '__main__':
    main()
