import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import templates from '../data/templates'
import useLocalStorage from '../hooks/useLocalStorage'

function PromptGenerator() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    topic: '',
    style: 'professional',
    length: 'medium',
    tone: 'neutral',
    additionalInstructions: ''
  })
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [history, setHistory] = useLocalStorage('prompt-history', [])
  const [showError, setShowError] = useState(false)

  const styleOptions = [
    { value: 'professional', label: '专业风格' },
    { value: 'casual', label: '轻松风格' },
    { value: 'creative', label: '创意风格' },
    { value: 'academic', label: '学术风格' },
    { value: 'humorous', label: '幽默风格' }
  ]

  const lengthOptions = [
    { value: 'short', label: '简短' },
    { value: 'medium', label: '中等' },
    { value: 'long', label: '详细' },
    { value: 'very-long', label: '非常详细' }
  ]

  const toneOptions = [
    { value: 'neutral', label: '中性' },
    { value: 'friendly', label: '友好' },
    { value: 'formal', label: '正式' },
    { value: 'enthusiastic', label: '热情' },
    { value: 'calm', label: '冷静' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setFormData(template.defaultValues)
  }

  const generatePrompt = () => {
    if (!formData.topic.trim()) {
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 3000)
      return
    }

    let prompt = ''

    prompt += `请根据以下要求生成内容：\n\n`
    prompt += `主题/内容：${formData.topic}\n\n`
    prompt += `风格要求：${styleOptions.find(s => s.value === formData.style)?.label}\n`
    prompt += `内容长度：${lengthOptions.find(l => l.value === formData.length)?.label}\n`
    prompt += `语气要求：${toneOptions.find(t => t.value === formData.tone)?.label}\n\n`

    if (formData.additionalInstructions.trim()) {
      prompt += `额外要求：${formData.additionalInstructions}\n\n`
    }

    prompt += `请按照以上要求，精心创作优质内容。`

    setGeneratedPrompt(prompt)
    setTimeout(() => {
      saveToHistory()
    }, 0)
  }

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData)
    }
  }, [location.state])

  const saveToHistory = () => {
    const newHistoryItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formData: { ...formData },
      prompt: generatedPrompt
    }
    setHistory(prev => [newHistoryItem, ...prev])
  }

  const copyToClipboard = async () => {
    if (!generatedPrompt) return

    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="min-h-screen bg-pattern bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            提示词生成器
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            快速生成高质量的AI提示词，解锁AI工具的全部潜力
          </p>
        </div>

        <div className="glass-effect rounded-3xl shadow-xl p-6 md:p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-10">
            <div>
              <label className="block text-gray-800 font-semibold mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                选择预设模板
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {templates.map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left card-hover ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-4xl mb-4 transition-transform duration-300 ${
                      selectedTemplate?.id === template.id ? 'animate-float' : 'hover:scale-110 hover:rotate-3'
                    }`}>
                      {template.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      selectedTemplate?.id === template.id ? 'text-blue-700' : 'text-gray-800'
                    }`}>
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                主题/内容
              </label>
              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="请输入您想要生成的内容主题或描述..."
                className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none resize-none input-focus"
                rows={4}
              />
              {showError && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>请输入主题或内容</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-800 font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  风格
                </label>
                <div className="relative">
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer input-focus appearance-none"
                  >
                    {styleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  长度
                </label>
                <div className="relative">
                  <select
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer input-focus appearance-none"
                  >
                    {lengthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  语气
                </label>
                <div className="relative">
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer input-focus appearance-none"
                  >
                    {toneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                额外要求（可选）
              </label>
              <textarea
                name="additionalInstructions"
                value={formData.additionalInstructions}
                onChange={handleInputChange}
                placeholder="添加任何额外的要求或说明..."
                className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none resize-none input-focus"
                rows={3}
              />
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={generatePrompt}
                className="btn-primary inline-flex items-center justify-center gap-3 px-12 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                生成提示词
              </button>
            </div>
          </div>
        </div>

        {generatedPrompt && (
          <div className="glass-effect rounded-3xl shadow-xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                生成的提示词
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {showSuccess && (
                  <span className="bg-green-50 text-green-600 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已复制！
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500/30 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  复制到剪贴板
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 shadow-inner">
              <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed p-4 bg-white/80 rounded-xl">{generatedPrompt}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromptGenerator