import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useLocalStorage('prompt-history', [])
  const [copiedId, setCopiedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportItems, setExportItems] = useState([])
  const [exportFormat, setExportFormat] = useState('txt')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const oneDay = 24 * 60 * 60 * 1000

    if (diff < oneDay && date.getDate() === now.getDate()) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (diff < oneDay * 2) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const copyToClipboard = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      showToast('已复制到剪贴板！', 'success')
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
      showToast('复制失败，请重试', 'error')
    }
  }

  const reusePrompt = (item) => {
    navigate('/', { state: { formData: item.formData } })
  }

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id))
    setSelectedIds(prev => prev.filter(item => item !== id))
    showToast('已删除', 'success')
  }

  const toggleSelectItem = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(history.map(item => item.id))
  }

  const deselectAll = () => {
    setSelectedIds([])
  }

  const generateTxtContent = (items) => {
    return items.map(item => {
      const date = new Date(item.timestamp).toLocaleString('zh-CN')
      return `【时间】${date}\n【主题】${item.formData.topic}\n【提示词】\n${item.prompt}\n${'='.repeat(80)}\n`
    }).join('\n')
  }

  const exportSingleItem = (item, format) => {
    setExportItems([item])
    setExportFormat(format)
    setShowExportDialog(true)
  }

  const exportSelectedItems = (format) => {
    const items = history.filter(item => selectedIds.includes(item.id))
    setExportItems(items)
    setExportFormat(format)
    setShowExportDialog(true)
  }

  const exportAllItems = (format) => {
    setExportItems(history)
    setExportFormat(format)
    setShowExportDialog(true)
  }

  const confirmExport = () => {
    let content, filename, mimeType
    
    if (exportFormat === 'txt') {
      content = generateTxtContent(exportItems)
      filename = `prompt-history-${Date.now()}.txt`
      mimeType = 'text/plain;charset=utf-8'
    } else {
      content = JSON.stringify(exportItems, null, 2)
      filename = `prompt-history-${Date.now()}.json`
      mimeType = 'application/json;charset=utf-8'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setShowExportDialog(false)
    setExportItems([])
    showToast(`成功导出 ${exportItems.length} 条记录！`, 'success')
  }

  return (
    <div className="min-h-screen bg-pattern bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12 px-4 md:px-8">
      {toast && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 transform transition-all duration-300 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
              历史记录
            </h1>
            <p className="text-gray-600 text-lg">管理和导出您的提示词历史</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </button>
        </div>

        {history.length === 0 ? (
          <div className="glass-effect rounded-3xl shadow-xl p-6 md:p-8 text-center animate-fade-in">
            <div className="text-7xl mb-6 animate-float">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">暂无历史记录</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">您还没有生成任何提示词，快去创建一个吧！</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始使用
            </button>
          </div>
        ) : (
          <>
            <div className="glass-effect rounded-3xl shadow-xl p-6 mb-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectedIds.length === history.length ? deselectAll : selectAll}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedIds.length === history.length ? '取消全选' : '全选'}
                  </button>
                  <span className="text-gray-600 text-sm font-medium">
                    已选择 <span className="text-blue-600 font-bold">{selectedIds.length}</span>/{history.length} 条
                  </span>
                </div>
                
                <div className="flex items-center gap-3 ml-auto flex-wrap">
                  {selectedIds.length > 0 && (
                    <>
                      <span className="text-gray-600 text-sm whitespace-nowrap">导出选中:</span>
                      <button
                        onClick={() => exportSelectedItems('txt')}
                        className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        TXT
                      </button>
                      <button
                        onClick={() => exportSelectedItems('json')}
                        className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        JSON
                      </button>
                    </>
                  )}
                  
                  <span className="text-gray-600 text-sm whitespace-nowrap ml-2">全部导出:</span>
                  <button
                    onClick={() => exportAllItems('txt')}
                    className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TXT
                  </button>
                  <button
                    onClick={() => exportAllItems('json')}
                    className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {history.map((item, index) => (
                <div key={item.id} className="glass-effect rounded-3xl shadow-xl p-6 card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="mt-1 w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all input-focus"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(item.timestamp)}
                        </p>
                        <h3 className="font-semibold text-gray-800 text-xl line-clamp-2 mb-2">{item.formData.topic.substring(0, 100)}{item.formData.topic.length > 100 ? '...' : ''}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="relative group">
                        <button className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          导出
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-10 hidden group-hover:block transition-all duration-300">
                          <button
                            onClick={() => exportSingleItem(item, 'txt')}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 rounded-t-xl transition-all flex items-center gap-2"
                          >
                            📄 TXT格式
                          </button>
                          <button
                            onClick={() => exportSingleItem(item, 'json')}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-cyan-50 rounded-b-xl transition-all flex items-center gap-2"
                          >
                            📋 JSON格式
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.id, item.prompt)}
                        className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover ${
                          copiedId === item.id 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedId === item.id ? "M5 13l4 4L19 7" : "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"} />
                        </svg>
                        {copiedId === item.id ? '已复制' : '复制'}
                      </button>
                      <button
                        onClick={() => reusePrompt(item)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        重新使用
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-3 rounded-xl transition-all flex items-center gap-2 card-hover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        删除
                      </button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200 shadow-inner">
                    <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed max-h-48 overflow-y-auto p-4 bg-white/80 rounded-xl">{item.prompt}</pre>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showExportDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="glass-effect rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6 animate-float">📥</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3 gradient-text">确认导出</h2>
                <p className="text-gray-600 text-lg">
                  即将导出 <span className="font-semibold text-blue-600">{exportItems.length}</span> 条历史记录
                  <br />
                  格式: <span className="font-semibold text-purple-600">{exportFormat.toUpperCase()}</span>
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none bg-gray-200 text-gray-700 hover:bg-gray-300 card-hover"
                >
                  取消
                </button>
                <button
                  onClick={confirmExport}
                  className="btn-primary flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                >
                  确认导出
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default History