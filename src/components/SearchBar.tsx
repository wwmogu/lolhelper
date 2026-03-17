import React, { useState } from 'react'

interface Props {
  onSearch: (champion: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !loading) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入英雄名字，如：石头人、金克丝"
        disabled={loading}
        className="flex-1 rounded-lg bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold px-6 py-3 transition-colors"
      >
        {loading ? '查询中…' : '查询'}
      </button>
    </form>
  )
}
