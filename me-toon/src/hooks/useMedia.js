import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * 音效播放 Hook
 * 缓存 Audio 对象，避免重复创建
 */
const audioCache = {}

export function useSound() {
  const play = useCallback((name) => {
    try {
      const path = `/assets/audio/sfx/${name}.wav`
      if (!audioCache[name]) {
        audioCache[name] = new Audio(path)
        audioCache[name].volume = 0.4
      }
      const audio = audioCache[name]
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch (e) {
      // 忽略播放错误
    }
  }, [])

  return play
}

/**
 * 打字机效果 Hook
 * @param {string} text - 要逐字显示的文字
 * @param {number} speed - 每字符间隔 ms
 * @param {boolean} start - 是否开始
 * @returns {[string, boolean]} [已显示的文字, 是否完成]
 */
export function useTypewriter(text, speed = 80, start = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!start || !text) return
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    const timer = setInterval(() => {
      if (indexRef.current >= text.length) {
        clearInterval(timer)
        setDone(true)
        return
      }
      const nextChar = text[indexRef.current]
      setDisplayed(prev => prev + nextChar)
      indexRef.current += 1
      // 段落停顿（遇到换行后多停一会）
      if (nextChar === '\n' && text[indexRef.current] === '\n') {
        clearInterval(timer)
        setTimeout(() => {
          const t = setInterval(() => {
            if (indexRef.current >= text.length) {
              clearInterval(t)
              setDone(true)
              return
            }
            const ch = text[indexRef.current]
            setDisplayed(prev => prev + ch)
            indexRef.current += 1
          }, speed)
        }, 500)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, start])

  return [displayed, done]
}

/**
 * 音乐播放 Hook
 * @param {string} src - 音频路径
 * @returns {[boolean, function, function]} [是否播放中, 播放, 暂停]
 */
export function useMusic(src) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!src) return
    audioRef.current = new Audio(src)
    audioRef.current.loop = true
    audioRef.current.volume = 0.5
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [src])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      pause()
    } else {
      play()
    }
  }, [playing, play, pause])

  return [playing, toggle, play, pause]
}
