"""
生成人物客厅的角色占位图（像素艺术风格）
4 个角色：胡图图、张小丽、胡英俊、小怪
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'images', 'detail', 'cartoons', 'tutu', 'characters')
os.makedirs(OUT, exist_ok=True)

# 角色配置：基础色调、特征
CHARACTERS = {
    'hututu': {
        'name': '胡图图',
        'skin': (255, 220, 170),
        'hair': (60, 30, 10),
        'cloth': (255, 180, 60),     # 黄色T恤
        'accent': (220, 60, 60),     # 红色（大耳朵）
        'bg': (255, 240, 200),
    },
    'zhangxiaoli': {
        'name': '张小丽',
        'skin': (255, 220, 180),
        'hair': (120, 60, 30),
        'cloth': (255, 120, 150),    # 粉色围裙
        'accent': (200, 80, 100),
        'bg': (255, 220, 230),
    },
    'huyingjun': {
        'name': '胡英俊',
        'skin': (245, 210, 170),
        'hair': (40, 30, 20),
        'cloth': (100, 140, 200),    # 蓝色衬衫
        'accent': (60, 90, 140),
        'bg': (210, 225, 245),
    },
    'xiaoguai': {
        'name': '小怪',
        'skin': (255, 255, 255),     # 白猫
        'hair': (60, 60, 60),        # 黑色斑纹
        'cloth': (200, 200, 200),
        'accent': (255, 180, 80),    # 橙色眼睛
        'bg': (240, 240, 250),
    },
}

def new_canvas(w, h, bg=(0, 0, 0, 0)):
    return Image.new('RGBA', (w, h), bg)

def px(img, x, y, color):
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), color)

def rect(img, x0, y0, x1, y1, color):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px(img, x, y, color)

def scale_up(img, scale):
    w, h = img.size
    return img.resize((w * scale, h * scale), Image.NEAREST)

def gen_character(char_id, conf):
    """生成单个角色的像素艺术头像"""
    # 32x40 像素原画
    W, H = 32, 40
    img = new_canvas(W, H)
    draw = ImageDraw.Draw(img)

    skin = conf['skin'] + (255,)
    hair = conf['hair'] + (255,)
    cloth = conf['cloth'] + (255,)
    accent = conf['accent'] + (255,)
    bg = conf['bg'] + (255,)

    # 背景
    rect(img, 0, 0, W - 1, H - 1, bg)

    if char_id == 'xiaoguai':
        # 猫脸
        # 头部（白色）
        rect(img, 8, 10, 23, 25, skin)
        # 黑色斑纹
        rect(img, 10, 12, 14, 16, hair)
        rect(img, 18, 18, 22, 22, hair)
        # 耳朵（三角）
        px(img, 8, 10, hair); px(img, 9, 11, hair); px(img, 10, 12, hair)
        px(img, 23, 10, hair); px(img, 22, 11, hair); px(img, 21, 12, hair)
        # 眼睛（橙色）
        px(img, 12, 16, accent); px(img, 13, 16, accent)
        px(img, 18, 16, accent); px(img, 19, 16, accent)
        # 鼻子嘴
        px(img, 15, 19, (220, 100, 100, 255))
        px(img, 16, 19, (220, 100, 100, 255))
        px(img, 14, 21, hair); px(img, 15, 21, hair)
        px(img, 16, 21, hair); px(img, 17, 21, hair)
        # 胡须
        px(img, 6, 18, hair); px(img, 7, 18, hair)
        px(img, 24, 18, hair); px(img, 25, 18, hair)
        # 身体
        rect(img, 10, 26, 21, 39, cloth)
    else:
        # 人物头部
        # 头发
        rect(img, 8, 6, 23, 9, hair)
        rect(img, 8, 6, 10, 14, hair)
        rect(img, 21, 6, 23, 14, hair)
        # 脸
        rect(img, 10, 9, 21, 19, skin)
        # 眼睛
        rect(img, 12, 13, 13, 14, (40, 30, 20, 255))
        rect(img, 18, 13, 19, 14, (40, 30, 20, 255))
        # 嘴
        rect(img, 14, 17, 17, 17, (200, 80, 80, 255))

        # 胡图图特征：大耳朵
        if char_id == 'hututu':
            rect(img, 7, 12, 8, 16, skin)
            rect(img, 23, 12, 24, 16, skin)
            rect(img, 6, 13, 7, 15, accent)
            rect(img, 24, 13, 25, 15, accent)
            # 头顶一撮毛
            px(img, 15, 5, hair); px(img, 16, 5, hair)
            px(img, 15, 4, hair); px(img, 16, 4, hair)

        # 张小丽特征：长发
        if char_id == 'zhangxiaoli':
            rect(img, 7, 8, 9, 22, hair)
            rect(img, 22, 8, 24, 22, hair)

        # 胡英俊特征：眼镜
        if char_id == 'huyingjun':
            rect(img, 11, 12, 14, 15, (255, 255, 255, 255))
            rect(img, 17, 12, 20, 15, (255, 255, 255, 255))
            rect(img, 11, 12, 11, 15, (60, 60, 60, 255))
            rect(img, 14, 12, 14, 15, (60, 60, 60, 255))
            rect(img, 17, 12, 17, 15, (60, 60, 60, 255))
            rect(img, 20, 12, 20, 15, (60, 60, 60, 255))
            rect(img, 11, 12, 14, 12, (60, 60, 60, 255))
            rect(img, 17, 12, 20, 12, (60, 60, 60, 255))
            rect(img, 11, 15, 14, 15, (60, 60, 60, 255))
            rect(img, 17, 15, 20, 15, (60, 60, 60, 255))
            px(img, 15, 13, (60, 60, 60, 255)); px(img, 16, 13, (60, 60, 60, 255))
            # 眼睛在眼镜后面
            px(img, 12, 13, (40, 30, 20, 255)); px(img, 13, 13, (40, 30, 20, 255))
            px(img, 18, 13, (40, 30, 20, 255)); px(img, 19, 13, (40, 30, 20, 255))

        # 衣服（身体）
        rect(img, 9, 20, 22, 39, cloth)
        # 衣服领口
        rect(img, 14, 20, 17, 21, skin)

    # 放大 8 倍
    big = scale_up(img, 8)
    out_path = os.path.join(OUT, f'{char_id}.png')
    big.save(out_path)
    print(f'  ✓ {conf["name"]}: {out_path} ({big.size[0]}x{big.size[1]})')

if __name__ == '__main__':
    print('生成人物客厅角色占位图...')
    for cid, conf in CHARACTERS.items():
        gen_character(cid, conf)
    print('完成。')
