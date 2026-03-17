import augmentsData from '../data/augments.json'
import type { RecommendationData } from '../App'

type RarityLabel = '银' | '金' | '彩'

const RARITY_BADGE: Record<RarityLabel, string> = {
  银: 'bg-gray-500 text-white',
  金: 'bg-yellow-500 text-gray-900',
  彩: 'bg-purple-500 text-white',
}

const TIER_STYLE: Record<string, string> = {
  S: 'bg-yellow-500 text-gray-900',
  A: 'bg-blue-500 text-white',
  avoid: 'bg-gray-700 text-gray-500',
}

// 构建 name → rarity 反查表
function buildRarityMap(): Map<string, RarityLabel> {
  const map = new Map<string, RarityLabel>()
  for (const a of augmentsData.silver as { name: string }[]) map.set(a.name, '银')
  for (const a of augmentsData.gold as { name: string }[]) map.set(a.name, '金')
  for (const a of augmentsData.prismatic as { name: string }[]) map.set(a.name, '彩')
  return map
}

const rarityMap = buildRarityMap()

function AugmentRow({
  tier,
  items,
  strikethrough = false,
}: {
  tier: string
  items: string[]
  strikethrough?: boolean
}) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1 items-center">
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${TIER_STYLE[tier] ?? 'bg-gray-600 text-gray-300'}`}>
        {tier === 'avoid' ? '差' : tier}
      </span>
      {items.map((name) => {
        const rarity = rarityMap.get(name)
        return (
          <span
            key={name}
            className={`text-sm px-2 py-0.5 rounded flex items-center gap-1 ${
              strikethrough
                ? 'bg-gray-800 text-gray-500 line-through'
                : tier === 'S'
                ? 'bg-yellow-900/40 text-yellow-200'
                : tier === 'A'
                ? 'bg-blue-900/40 text-blue-200'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {name}
            {rarity && (
              <span className={`text-[10px] font-bold px-1 rounded ${RARITY_BADGE[rarity]}`}>
                {rarity}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

function AugmentCard({ augments }: { augments: RecommendationData['augments'] }) {
  return (
    <div className="rounded-xl bg-gray-800 border-l-4 border-purple-400 p-5">
      <h2 className="text-white font-bold text-lg mb-3">✨ 海克斯强化</h2>
      <div className="flex flex-col gap-2">
        <AugmentRow tier="S" items={augments.S} />
        <AugmentRow tier="A" items={augments.A} />
        <AugmentRow tier="avoid" items={augments.avoid} strikethrough />
      </div>
    </div>
  )
}

function ItemCard({ items }: { items: RecommendationData['items'] }) {
  return (
    <div className="rounded-xl bg-gray-800 border-l-4 border-yellow-500 p-5">
      <h2 className="text-white font-bold text-lg mb-3">🛡️ 装备推荐</h2>
      <div className="flex flex-col gap-2">
        <AugmentRow tier="S" items={items.S} />
        <AugmentRow tier="A" items={items.A} />
        <AugmentRow tier="avoid" items={items.avoid} strikethrough />
      </div>
    </div>
  )
}

function SummaryCard({ summary }: { summary: NonNullable<RecommendationData['summary']> }) {
  return (
    <div className="rounded-xl bg-gray-950 border border-yellow-500/40 p-5">
      <h2 className="text-yellow-400 font-bold text-lg mb-3">✅ 核心速查</h2>
      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="text-gray-500 mr-2">强化</span>
          <span className="text-gray-200">{summary.augments}</span>
        </div>
        <div>
          <span className="text-gray-500 mr-2">出装</span>
          <span className="text-gray-200">{summary.build}</span>
        </div>
        <div>
          <span className="text-gray-500 mr-2">玩法</span>
          <span className="text-gray-200">{summary.playtip}</span>
        </div>
      </div>
    </div>
  )
}

export default function ResultCard({ data }: { data: RecommendationData }) {
  return (
    <div className="flex flex-col gap-4">
      {/* 技能加点 */}
      <div className="rounded-xl bg-gray-800 border-l-4 border-blue-500 p-5">
        <h2 className="text-white font-bold text-lg mb-2">⚔️ 技能加点</h2>
        <p className="text-yellow-400 font-bold text-2xl mb-1">{data.skillOrder}</p>
        <p className="text-gray-300 text-sm">{data.skillNote}</p>
      </div>

      {/* 海克斯强化（统一推荐排序，带品阶角标） */}
      <AugmentCard augments={data.augments} />

      {/* 装备推荐 */}
      <ItemCard items={data.items} />

      {/* 核心速查（有则显示） */}
      {data.summary && <SummaryCard summary={data.summary} />}
    </div>
  )
}
