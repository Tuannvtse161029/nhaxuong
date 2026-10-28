import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, AlertCircle, Headphones } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AudioPlayerProps {
  src?: string
  title?: string
  className?: string
  autoPlay?: boolean
}

export function AudioPlayer({ src, title = 'Thuyết minh thông số nhà xưởng', className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setHasError(false)
    setIsLoading(true)

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setIsLoading(false)
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const onError = () => {
      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [src])

  const togglePlay = () => {
    if (!audioRef.current || hasError) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true))
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Fallback UI if audio file has an error
  if (hasError || !src) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-amber-900 text-xs dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200',
          className
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300">
            Tập tin âm thanh thuyết minh hiện đang được cập nhật. Bạn có thể xem video drone hoặc văn bản mô tả.
          </p>
        </div>
      </div>
    )
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        'group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Headphones className="w-4 h-4" />
          </div>
          <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </span>
        </div>
        <span className="shrink-0 text-[10px] font-mono font-medium text-slate-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Controls & Progress bar */}
      <div className="flex items-center gap-3">
        {/* Play / Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all dark:bg-teal-600 dark:hover:bg-teal-700"
          title={isPlaying ? 'Tạm dừng' : 'Nghe thuyết minh (.mp3)'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Progress Slider */}
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={isLoading || duration === 0}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:bg-slate-800"
          />
          {/* Visual dynamic progress fill */}
          <div
            style={{ width: `${progressPercent}%` }}
            className="pointer-events-none absolute left-0 h-1.5 rounded-lg bg-teal-600"
          />
        </div>

        {/* Mute button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
