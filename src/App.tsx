import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultCard from './components/ResultCard'
import { matchChampion, getRecommendation, type MatchResult } from './services/champion'
import { identifyChampion } from './services/ai'
import { clearApiKey, getStoredApiKey, saveApiKey } from './services/apiKey'

export interface RecommendationData {
  skillOrder: string
  skillNote: string
  items: { S: string[]; A: string[]; avoid: string[] }
  augments: { S: string[]; A: string[]; avoid: string[] }
  summary?: {
    augments: string
    build: string
    playtip: string
  }
}

interface AppState {
  champion: MatchResult | null
  data: RecommendationData | null
  loading: boolean
  error: string
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey())
  const [apiKeyDraft, setApiKeyDraft] = useState(() => getStoredApiKey())
  const [apiKeyMessage, setApiKeyMessage] = useState('')
  const [state, setState] = useState<AppState>({
    champion: null,
    data: null,
    loading: false,
    error: '',
  })

  async function handleSearch(input: string) {
    setState({ champion: null, data: null, loading: true, error: '' })

    try {
      // 1. 本地模糊匹配
      let match = matchChampion(input)

      // 2. 匹配失败则交给 AI 识别（极短调用，仅 ~20 token）
      if (!match) {
        if (!apiKey) {
          setState({
            champion: null,
            data: null,
            loading: false,
            error: `未能识别英雄「${input}」。可在上方配置 GLM API Key 后启用 AI 兜底识别。`,
          })
          return
        }

        const zhName = await identifyChampion(input, apiKey)
        match = matchChampion(zhName)
      }

      if (!match) {
        setState({ champion: null, data: null, loading: false, error: `未能识别英雄「${input}」，请尝试其他写法` })
        return
      }

      const rec = getRecommendation(match.id) as RecommendationData | null
      setState({ champion: match, data: rec, loading: false, error: '' })
    } catch (err) {
      setState({
        champion: null, data: null, loading: false,
        error: err instanceof Error ? err.message : '请求失败，请稍后重试',
      })
    }
  }

  function handleSaveApiKey() {
    const trimmed = apiKeyDraft.trim()
    if (!trimmed) {
      setApiKeyMessage('请输入有效的 API Key。')
      return
    }

    saveApiKey(trimmed)
    setApiKey(trimmed)
    setApiKeyMessage('API Key 已保存到当前浏览器本地存储。')
  }

  function handleClearApiKey() {
    clearApiKey()
    setApiKey('')
    setApiKeyDraft('')
    setApiKeyMessage('已清除本地保存的 API Key。')
  }

  const { champion, data, loading, error } = state

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">海克斯大乱斗指北</h1>
          <p className="text-gray-400 text-sm">输入英雄名字，获取技能、海克斯、装备推荐</p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/70 p-4 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">AI 兜底识别设置</h2>
              <p className="text-xs text-gray-400">
                GitHub Pages 为纯静态站点，无法安全托管服务端密钥。这里改为用户自行输入 GLM API Key，仅保存在当前浏览器。
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${apiKey ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
              {apiKey ? '已配置' : '未配置'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder="输入你的 GLM API Key"
              className="flex-1 rounded-lg bg-gray-900 border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-4 py-3 transition-colors"
            >
              保存 Key
            </button>
            <button
              type="button"
              onClick={handleClearApiKey}
              className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-3 transition-colors"
            >
              清除
            </button>
          </div>

          {apiKeyMessage && <p className="mt-2 text-xs text-gray-300">{apiKeyMessage}</p>}
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="mt-8 text-center text-gray-400 animate-pulse">识别英雄中…</div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-900/50 border border-red-700 px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {champion && (
          <div className="mt-6">
            <p className="text-gray-500 text-xs mb-3">
              {champion.zhName}
              {!data && <span className="text-yellow-600 ml-2">（暂无收录数据）</span>}
            </p>
            {data && <ResultCard data={data} />}
          </div>
        )}
      </div>
    </div>
  )
}
