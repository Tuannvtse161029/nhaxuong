import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, ExternalLink, Copy, Check, ArrowRight, Loader2, User, Sparkles, Download } from 'lucide-react'
import { propertyApi } from '@/api/propertyApi'
import { ENV } from '@/config/env.config'
import { cn } from '@/utils/cn'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  modelResult?: {
    fileName: string
    model3dUrl: string
    title: string
    specsSummary: string
    htmlContent?: string
  }
  timestamp: string
}

interface AdminAi3DModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectModelUrl?: (url: string, title?: string) => void
}

export function AdminAi3DModal({ isOpen, onClose, onSelectModelUrl }: AdminAi3DModalProps) {
  const [inputPrompt, setInputPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Kỹ Sư AI của Nhaxuong.vn. Bạn hãy nhập bất kỳ yêu cầu thiết kế nhà xưởng nào (ví dụ: "Dựng xưởng Zamil 30x60m có cẩu trục 5 tấn", "Xưởng thép I 24x84m không cẩu", hay kích thước bất kỳ bạn muốn), tôi sẽ tự động tính toán kết cấu và xuất mô hình 3D xoay 360° tương tác ngay tại đây!',
      timestamp: 'Vừa xong',
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  if (!isOpen) return null

  const getFullUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) return relativeUrl
    const base = ENV.API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '')
    return `${base}${relativeUrl}`
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const promptText = inputPrompt.trim()
    if (!promptText || isLoading) return

    const userMsgId = 'msg-user-' + Date.now()
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputPrompt('')
    setIsLoading(true)

    try {
      const res = await propertyApi.generate3DModel({
        prompt: promptText,
      })

      if (res && res.success) {
        const modelUrl = (res as any).model3DUrl || res.model3dUrl || (res as any).model3dUrl || ''
        const htmlCode = res.htmlContent || ''
        const aiMsg: ChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: res.aiMessage || `Đã hoàn tất tính toán kết cấu và dựng mô hình 3D theo yêu cầu: "${promptText}". Bạn có thể xoay 360 độ hoặc phóng to để kiểm tra chi tiết dầm, cột, xà gồ và cẩu trục bên dưới:`,
          modelResult: {
            fileName: res.fileName,
            model3dUrl: modelUrl,
            title: res.title,
            specsSummary: res.specsSummary,
            htmlContent: htmlCode,
          },
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, aiMsg])
      } else {
        const errMsg: ChatMessage = {
          id: 'msg-err-' + Date.now(),
          sender: 'ai',
          text: 'Xin lỗi, không thể khởi tạo mô hình 3D lúc này: ' + (res?.message || 'Vui lòng thử lại với câu lệnh khác.'),
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, errMsg])
      }
    } catch (err: any) {
      console.error('Lỗi Gemini AI 3D:', err)
      const errMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'ai',
        text: 'Lỗi kết nối tới máy chủ AI: ' + (err.message || 'Vui lòng kiểm tra lại mạng hoặc thử lại sau.'),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = (url: string, id: string) => {
    const full = getFullUrl(url)
    navigator.clipboard.writeText(full)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleDownloadHtml = (htmlContent?: string, fileName?: string, modelUrl?: string) => {
    const finalName = fileName || 'nha_xuong_3d.html'
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = finalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (modelUrl) {
      const a = document.createElement('a')
      a.href = getFullUrl(modelUrl)
      a.download = finalName
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleApplyToPost = (url: string, title?: string) => {
    if (onSelectModelUrl) {
      onSelectModelUrl(url, title)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[850px] flex flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Trợ Lý Gemini AI Dựng Mô Hình 3D</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Chat Tùy Biến 24/7
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nhập câu lệnh bất kỳ để AI tự động tính kết cấu và sinh mô hình 3D xoay 360° trực tiếp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2.5 max-w-[95%] sm:max-w-[88%]',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs shadow-xs',
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-teal-600 to-emerald-600'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500'
                )}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  'rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-3 shadow-xs',
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Embedded 3D Viewer if message contains 3D model */}
                {msg.modelResult && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
                    <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-orange-600 dark:text-orange-400">
                        📐 {msg.modelResult.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {msg.modelResult.specsSummary}
                      </div>
                    </div>

                    {/* Interactive 3D Iframe with direct srcDoc (Chống đen màn hình 100%) */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-orange-400/50 shadow-md bg-white">
                      <iframe
                        srcDoc={msg.modelResult.htmlContent || undefined}
                        src={!msg.modelResult.htmlContent ? getFullUrl(msg.modelResult.model3dUrl) : undefined}
                        title={msg.modelResult.title}
                        className="w-full h-full border-0 bg-white"
                        allow="fullscreen; accelerometer; gyroscope"
                      />
                    </div>

                    {/* Action Buttons for this 3D model */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* Nút 1: Tải File HTML Về Máy / Điện Thoại */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadHtml(
                            msg.modelResult!.htmlContent,
                            msg.modelResult!.fileName,
                            msg.modelResult!.model3dUrl
                          )
                        }
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                        title="Tải file HTML về máy để mở offline hoặc tự upload lên bài đăng"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file HTML về máy</span>
                      </button>

                      {/* Nút 2: Gán thẳng vào bài đăng ngay */}
                      {onSelectModelUrl && (
                        <button
                          type="button"
                          onClick={() => handleApplyToPost(msg.modelResult!.model3dUrl, msg.modelResult!.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          title="Gán trực tiếp mô hình này vào bài đăng đang mở"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gán thẳng vào bài đăng</span>
                        </button>
                      )}

                      {/* Nút 3: Chép link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(msg.modelResult!.model3dUrl, msg.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:scale-102 transition cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === msg.id ? 'Đã chép link!' : 'Chép link 3D'}</span>
                      </button>

                      {/* Nút 4: Mở toàn màn hình */}
                      <a
                        href={getFullUrl(msg.modelResult.model3dUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Mở toàn màn hình</span>
                      </a>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'text-[10px] text-right',
                    msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs shadow-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none p-3.5 bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span>Gemini AI đang phân tích yêu cầu, tính toán kết cấu & sinh mô hình 3D...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Nhập yêu cầu nhà xưởng của bạn (VD: Dựng xưởng 32x75m kèo Zamil có cẩu 10T)..."
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className={cn(
                'flex items-center justify-center h-11 w-11 rounded-2xl text-white transition shadow-md shrink-0 cursor-pointer',
                isLoading || !inputPrompt.trim()
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95'
              )}
              title="Gửi yêu cầu"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
