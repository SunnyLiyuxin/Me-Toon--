/**
 * 资源清单 — 通过 import.meta.glob 让 Vite 处理所有图片/音频资源
 * 这样配合 vite-plugin-singlefile + assetsInlineLimit，所有资源会被内联为 base64
 * 单文件 HTML 可在本地（file://）和 GitHub 上独立运行，无需额外 assets 目录
 */

// 以 eager 模式导入所有资源，得到 path -> resolvedUrl 的映射
const imageModules = import.meta.glob('./images/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const audioModules = import.meta.glob('./audio/**/*.{wav,mp3}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// 构建 原始逻辑路径 -> Vite 解析后 URL 的映射表
// 同时支持 "./assets/xxx" 和 "/assets/xxx" 和 "assets/xxx" 三种风格
const ASSET_MAP = {}

function register(modules) {
  for (const [key, value] of Object.entries(modules)) {
    // key 形如 "./images/desktop/foo.png"
    // 转换为 "./assets/images/desktop/foo.png"
    const logical = './assets/' + key.replace(/^\.\//, '')
    ASSET_MAP[logical] = value
    // 同时注册去掉前缀的简短形式
    ASSET_MAP[logical.replace('./assets/', '/assets/')] = value
    ASSET_MAP[logical.replace('./assets/', 'assets/')] = value
  }
}

register(imageModules)
register(audioModules)

/**
 * 通过逻辑路径解析资源 URL
 * @param {string} path - 原始路径，如 "./assets/images/desktop/foo.png"
 * @returns {string} 解析后的 URL（构建后为 base64 数据 URI）
 */
export function resolveAsset(path) {
  if (!path) return path
  // 已经是 data: URI 或 http(s) 链接，直接返回
  if (/^(data:|https?:|blob:)/.test(path)) return path
  if (ASSET_MAP[path]) return ASSET_MAP[path]
  // 兜底：原样返回（构建时会报警告）
  console.warn('[manifest] asset not found:', path)
  return path
}

export default ASSET_MAP
