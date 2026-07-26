"""
生成《喜羊羊与灰太狼》人物客厅角色占位图（像素艺术风格）
9 个角色：
  - 喜羊羊 xiyangyang  白色身体 + 金色铃铛 + 头顶弯角
  - 美羊羊 meiyangyang  粉色蝴蝶结 + 头顶弯角
  - 懒羊羊 lanyangyang  黄色便便头 + 闭眼睡姿
  - 沸羊羊 feiyangyang  深色皮肤 + 头巾
  - 暖羊羊 nuanyangyang  圆脸大耳 + 头花
  - 慢羊羊 manyangyang  白胡子 + 头顶小树苗
  - 灰太狼 huitailang  灰色 + 伤疤 + 黑鼻
  - 红太狼 hongtailang  红色长袍 + 王冠
  - 小灰灰 xiaohuihui  小号灰太狼 + 笑脸
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'images', 'detail', 'cartoons', 'xiyangyang', 'characters')
os.makedirs(OUT, exist_ok=True)

# 角色配置
CHARACTERS = {
    'xiyangyang': {
        'name': '喜羊羊',
        'body': (250, 250, 250),       # 白色羊毛
        'accent': (60, 130, 200),      # 蓝色（领巾）
        'bell': (255, 200, 60),        # 金色铃铛
        'horn': (255, 220, 160),       # 米黄色弯角
        'eye': (40, 40, 40),
        'bg': (180, 220, 180),         # 浅绿背景
    },
    'meiyangyang': {
        'name': '美羊羊',
        'body': (250, 250, 250),
        'accent': (255, 150, 200),     # 粉色蝴蝶结
        'bell': (255, 200, 60),
        'horn': (255, 220, 160),
        'eye': (40, 40, 40),
        'bg': (255, 220, 235),
    },
    'lanyangyang': {
        'name': '懒羊羊',
        'body': (250, 250, 250),
        'accent': (255, 200, 60),      # 黄色便便头
        'bell': (255, 200, 60),
        'horn': (255, 220, 160),
        'eye': (40, 40, 40),
        'bg': (255, 245, 200),
    },
    'feiyangyang': {
        'name': '沸羊羊',
        'body': (220, 200, 180),       # 深色皮肤
        'accent': (200, 60, 60),       # 红色头巾
        'bell': (255, 200, 60),
        'horn': (160, 120, 80),
        'eye': (40, 40, 40),
        'bg': (220, 200, 180),
    },
    'nuanyangyang': {
        'name': '暖羊羊',
        'body': (250, 245, 235),
        'accent': (255, 180, 100),     # 头花橙色
        'bell': (255, 200, 60),
        'horn': (255, 220, 160),
        'eye': (40, 40, 40),
        'bg': (255, 235, 210),
    },
    'manyangyang': {
        'name': '慢羊羊',
        'body': (250, 250, 250),
        'accent': (80, 140, 80),       # 头顶小树苗绿色
        'bell': (255, 200, 60),
        'horn': (255, 220, 160),
        'eye': (40, 40, 40),
        'beard': (220, 220, 220),
        'bg': (235, 230, 200),
    },
    'huitailang': {
        'name': '灰太狼',
        'body': (150, 150, 160),       # 灰色狼身
        'accent': (60, 60, 60),        # 伤疤/帽色
        'bell': None,
        'horn': None,
        'eye': (255, 200, 60),         # 黄色发光眼
        'nose': (40, 40, 40),
        'bg': (90, 90, 110),
    },
    'hongtailang': {
        'name': '红太狼',
        'body': (200, 120, 130),
        'accent': (200, 40, 60),       # 红色长袍
        'bell': None,
        'horn': None,
        'eye': (40, 40, 40),
        'crown': (255, 200, 60),
        'bg': (180, 80, 100),
    },
    'xiaohuihui': {
        'name': '小灰灰',
        'body': (180, 180, 190),
        'accent': (220, 180, 100),
        'bell': None,
        'horn': None,
        'eye': (60, 60, 60),
        'nose': (80, 60, 60),
        'bg': (200, 200, 220),
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

def to_rgba(c):
    if c is None:
        return None
    if len(c) == 4:
        return c
    return c + (255,)

def gen_sheep(img, conf, char_id):
    """羊族角色：白色身体 + 弯角 + 铃铛"""
    W, H = img.size
    body = to_rgba(conf['body'])
    accent = to_rgba(conf['accent'])
    bell = to_rgba(conf['bell']) if conf.get('bell') else None
    horn = to_rgba(conf['horn']) if conf.get('horn') else None
    eye = to_rgba(conf['eye'])
    bg = to_rgba(conf['bg'])

    # 背景
    rect(img, 0, 0, W - 1, H - 1, bg)

    # 头顶弯角（两侧）
    if horn:
        # 左角
        px(img, 8, 8, horn); px(img, 9, 7, horn); px(img, 10, 7, horn)
        px(img, 7, 9, horn); px(img, 8, 9, horn)
        # 右角
        px(img, 21, 8, horn); px(img, 22, 7, horn); px(img, 23, 7, horn)
        px(img, 24, 9, horn); px(img, 23, 9, horn)

    # 头顶特殊装饰
    if char_id == 'meiyangyang':
        # 粉色蝴蝶结
        rect(img, 13, 6, 18, 8, accent)
        px(img, 15, 7, (255, 255, 255, 255)); px(img, 16, 7, (255, 255, 255, 255))
    elif char_id == 'lanyangyang':
        # 黄色便便头（一坨）
        rect(img, 11, 4, 20, 8, accent)
        rect(img, 13, 3, 18, 4, accent)
        rect(img, 15, 2, 16, 3, accent)
    elif char_id == 'feiyangyang':
        # 红色头巾
        rect(img, 8, 8, 23, 11, accent)
        px(img, 22, 11, accent); px(img, 23, 12, accent); px(img, 24, 13, accent)
    elif char_id == 'manyangyang':
        # 头顶小树苗
        rect(img, 15, 2, 16, 6, accent)  # 茎
        rect(img, 13, 2, 18, 3, accent)  # 叶子
        px(img, 14, 1, accent); px(img, 17, 1, accent)

    # 脸（圆形/椭圆）
    rect(img, 8, 9, 23, 22, body)
    # 脸颊两侧羊毛卷（小凸起）
    px(img, 7, 12, body); px(img, 7, 13, body); px(img, 7, 14, body)
    px(img, 24, 12, body); px(img, 24, 13, body); px(img, 24, 14, body)

    # 眼睛
    if char_id == 'lanyangyang':
        # 闭眼（一条线）
        rect(img, 11, 14, 13, 14, eye)
        rect(img, 18, 14, 20, 14, eye)
    else:
        rect(img, 11, 13, 13, 15, eye)
        rect(img, 18, 13, 20, 15, eye)
        # 高光
        px(img, 12, 13, (255, 255, 255, 255))
        px(img, 19, 13, (255, 255, 255, 255))

    # 嘴
    if char_id == 'lanyangyang':
        # 流口水
        px(img, 15, 19, eye); px(img, 16, 19, eye)
        px(img, 16, 20, (150, 200, 255, 255))
        px(img, 16, 21, (150, 200, 255, 255))
    else:
        rect(img, 14, 18, 17, 18, (200, 80, 80, 255))

    # 慢羊羊：白胡子
    if char_id == 'manyangyang' and conf.get('beard'):
        beard = to_rgba(conf['beard'])
        rect(img, 10, 19, 21, 22, beard)
        px(img, 12, 23, beard); px(img, 16, 23, beard); px(img, 20, 23, beard)
        # 老花镜
        rect(img, 10, 12, 14, 16, (60, 60, 60, 255))
        rect(img, 17, 12, 21, 16, (60, 60, 60, 255))
        rect(img, 14, 14, 17, 14, (60, 60, 60, 255))
        # 镜片白色
        rect(img, 11, 13, 13, 15, (200, 220, 240, 200))
        rect(img, 18, 13, 20, 15, (200, 220, 240, 200))
        # 眼睛在镜后
        px(img, 12, 14, eye); px(img, 19, 14, eye)

    # 暖羊羊：圆脸大耳
    if char_id == 'nuanyangyang':
        rect(img, 6, 13, 8, 18, body)
        rect(img, 23, 13, 25, 18, body)
        # 头花
        rect(img, 12, 6, 19, 8, accent)
        px(img, 15, 7, (255, 255, 255, 255)); px(img, 16, 7, (255, 255, 255, 255))

    # 颈部铃铛
    if bell:
        rect(img, 13, 23, 18, 24, (180, 140, 30, 255))  # 绳子
        rect(img, 14, 24, 17, 27, bell)
        px(img, 15, 26, (180, 140, 30, 255)); px(img, 16, 26, (180, 140, 30, 255))

    # 身体（衣服）
    rect(img, 10, 27, 21, 39, body)
    # 衣领
    rect(img, 13, 27, 18, 28, accent)

    # 沸羊羊：肌肉手臂
    if char_id == 'feiyangyang':
        rect(img, 7, 28, 10, 35, body)
        rect(img, 21, 28, 24, 35, body)

def gen_wolf(img, conf, char_id):
    """狼族角色：灰色身体 + 尖耳 + 长嘴"""
    W, H = img.size
    body = to_rgba(conf['body'])
    accent = to_rgba(conf['accent'])
    eye = to_rgba(conf['eye'])
    bg = to_rgba(conf['bg'])
    nose = to_rgba(conf.get('nose', (40, 40, 40)))

    # 背景
    rect(img, 0, 0, W - 1, H - 1, bg)

    # 尖耳朵
    rect(img, 8, 4, 11, 9, body)
    px(img, 9, 3, body); px(img, 10, 3, body)
    rect(img, 20, 4, 23, 9, body)
    px(img, 21, 3, body); px(img, 22, 3, body)
    # 耳朵内侧
    rect(img, 9, 6, 10, 8, accent)
    rect(img, 21, 6, 22, 8, accent)

    # 头部
    rect(img, 8, 8, 23, 22, body)

    # 长嘴（向前突出）
    rect(img, 11, 18, 20, 23, body)
    # 鼻子
    rect(img, 13, 18, 18, 19, nose)

    # 眼睛
    if char_id == 'huitailang':
        # 发光黄眼
        rect(img, 11, 13, 13, 15, eye)
        rect(img, 18, 13, 20, 15, eye)
        px(img, 11, 13, (255, 255, 200, 255))
        px(img, 18, 13, (255, 255, 200, 255))
        # 伤疤（左眼上）
        rect(img, 10, 11, 13, 12, accent)
        px(img, 10, 12, accent); px(img, 13, 11, accent)
    elif char_id == 'hongtailang':
        # 普通眼睛
        rect(img, 11, 13, 13, 15, eye)
        rect(img, 18, 13, 20, 15, eye)
        # 王冠
        crown = to_rgba(conf.get('crown', (255, 200, 60)))
        rect(img, 12, 6, 19, 8, crown)
        px(img, 13, 5, crown); px(img, 16, 4, crown); px(img, 19, 5, crown)
        # 睫毛
        px(img, 11, 12, eye); px(img, 12, 12, eye)
        px(img, 18, 12, eye); px(img, 19, 12, eye)
    else:  # xiaohuihui
        # 圆圆可爱眼
        rect(img, 12, 13, 14, 16, eye)
        rect(img, 17, 13, 19, 16, eye)
        px(img, 13, 14, (255, 255, 255, 255))
        px(img, 18, 14, (255, 255, 255, 255))
        # 微笑
        rect(img, 13, 21, 18, 22, (200, 80, 80, 255))
        px(img, 14, 22, (200, 80, 80, 255))
        px(img, 17, 22, (200, 80, 80, 255))

    # 牙齿（仅成年狼）
    if char_id in ('huitailang', 'hongtailang'):
        px(img, 14, 22, (255, 255, 255, 255)); px(img, 15, 22, (255, 255, 255, 255))
        px(img, 16, 22, (255, 255, 255, 255)); px(img, 17, 22, (255, 255, 255, 255))

    # 身体
    rect(img, 9, 23, 22, 39, body)

    # 红太狼：红色长袍
    if char_id == 'hongtailang':
        rect(img, 9, 23, 22, 39, accent)
        # 平底锅
        rect(img, 4, 30, 9, 32, (120, 120, 120, 255))
        rect(img, 6, 31, 8, 31, (80, 60, 40, 255))

    # 灰太狼：帽子
    if char_id == 'huitailang':
        rect(img, 9, 8, 22, 10, accent)
        px(img, 9, 9, accent); px(img, 22, 9, accent)

    # 小灰灰：羊玩偶
    if char_id == 'xiaohuihui':
        # 玩偶（小白羊）
        rect(img, 4, 30, 10, 36, (250, 250, 250, 255))
        px(img, 5, 31, eye); px(img, 7, 31, eye)
        px(img, 6, 33, (200, 80, 80, 255))

def gen_character(char_id, conf):
    """生成单个角色像素艺术"""
    W, H = 32, 40
    img = new_canvas(W, H)

    if char_id in ('huitailang', 'hongtailang', 'xiaohuihui'):
        gen_wolf(img, conf, char_id)
    else:
        gen_sheep(img, conf, char_id)

    # 放大 8 倍
    big = scale_up(img, 8)
    out_path = os.path.join(OUT, f'{char_id}.png')
    big.save(out_path)
    print(f'  ✓ {conf["name"]}: {out_path} ({big.size[0]}x{big.size[1]})')

if __name__ == '__main__':
    print('生成《喜羊羊与灰太狼》人物客厅角色占位图...')
    for cid, conf in CHARACTERS.items():
        gen_character(cid, conf)
    print('完成。')
