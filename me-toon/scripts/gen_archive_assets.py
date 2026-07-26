"""
档案室补充素材生成
- 像素收音机（听主题曲）
- 木质相框
"""
import os
from PIL import Image
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'public', 'assets', 'images')

sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from gen_pixel_art import new_canvas, rect, rect_outline, pixel, scale_up, PALETTE, apply_y2k_filter

def gen_radio():
    print("\n[A1] 像素收音机（档案室主题曲按钮）")
    path = os.path.join(ASSETS, 'detail', 'radio-icon.png')
    img = new_canvas(30, 20)
    # 主体（深棕色木纹）
    rect(img, 2, 6, 28, 18, 'brown')
    rect_outline(img, 2, 6, 28, 18, 'brown_dark')
    # 木纹
    for y in [9, 13, 16]:
        for x in range(3, 28):
            if (x + y) % 3 == 0:
                img.putpixel((x, y), PALETTE['brown_dark'])
    # 扬声器格栅
    rect(img, 4, 8, 12, 16, 'black')
    rect_outline(img, 4, 8, 12, 16, 'brown_dark')
    for y in range(9, 16):
        for x in range(5, 12):
            if y % 2 == 0:
                img.putpixel((x, y), PALETTE['silver_dark'])
    # 频率显示窗
    rect(img, 14, 8, 26, 11, 'neon_green')
    rect_outline(img, 14, 8, 26, 11, 'black')
    # 频率数字（像素）
    for x in range(15, 26, 2):
        pixel(img, x, 9, 'black')
        pixel(img, x, 10, 'black')
    # 旋钮
    for y in range(13, 17):
        for x in range(22, 26):
            nx = (x - 24) / 2
            ny = (y - 15) / 2
            if nx * nx + ny * ny <= 1:
                img.putpixel((x, y), PALETTE['silver'])
    pixel(img, 24, 14, 'silver_dark')
    # 天线
    pixel(img, 8, 4, 'silver_dark')
    pixel(img, 8, 5, 'silver_dark')
    pixel(img, 9, 3, 'silver_dark')
    pixel(img, 10, 2, 'silver_dark')
    pixel(img, 11, 1, 'silver_dark')
    # 电源指示灯
    pixel(img, 27, 17, 'red')
    # 放大 2 倍 = 60x40
    img = scale_up(img, 2)
    img.save(path)

def gen_wooden_frame():
    print("\n[A2] 木质相框（导演肖像框）")
    path = os.path.join(ASSETS, 'detail', 'wooden-frame.png')
    img = new_canvas(50, 50)
    # 外框（深棕色木质）
    rect(img, 0, 0, 49, 49, 'wood')
    rect_outline(img, 0, 0, 49, 49, 'wood_dark')
    # 木纹纹理
    for y in range(50):
        for x in range(50):
            # 边缘
            if x < 5 or x > 44 or y < 5 or y > 44:
                if (x * 7 + y * 3) % 5 == 0:
                    img.putpixel((x, y), PALETTE['wood_dark'])
                if (x * 11 + y * 5) % 7 == 0:
                    r, g, b, a = img.getpixel((x, y))
                    img.putpixel((x, y), (min(255, r + 20), min(255, g + 15), min(255, b + 10), a))
    # 内框（浅木色）
    rect(img, 5, 5, 44, 44, 'brown')
    rect_outline(img, 5, 5, 44, 44, 'wood_dark')
    # 中间透明（让肖像显示出来）
    rect(img, 8, 8, 41, 41, (0, 0, 0, 0))
    # 四角金属包边
    for cx, cy in [(2, 2), (47, 2), (2, 47), (47, 47)]:
        for dx in range(-2, 3):
            for dy in range(-2, 3):
                px, py = cx + dx, cy + dy
                if 0 <= px < 50 and 0 <= py < 50:
                    if dx * dx + dy * dy <= 4:
                        img.putpixel((px, py), PALETTE['gold'])
    # 四角高光
    pixel(img, 2, 2, 'white')
    pixel(img, 47, 2, 'white')
    pixel(img, 2, 47, 'white')
    pixel(img, 47, 47, 'white')
    # 放大 3.2 倍 → 160x160
    img = scale_up(img, 3)
    # 裁剪到 160x160
    img = img.crop((0, 0, 160, 160))
    img.save(path)

if __name__ == '__main__':
    gen_radio()
    gen_wooden_frame()
    print("\n✓ 档案室素材生成完成")
