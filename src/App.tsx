import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultCard from './components/ResultCard'
import { matchChampion, getRecommendation, type MatchResult } from './services/champion'
import { identifyChampion } from './services/ai'

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
        const zhName = await identifyChampion(input)
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

  const { champion, data, loading, error } = state

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">海克斯大乱斗指北</h1>
          <p className="text-gray-400 text-sm">输入英雄名字，获取技能、海克斯、装备推荐</p>
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
