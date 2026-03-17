import championsData from '../data/champions.json'
import recommendationsData from '../data/recommendations.json'

// 常用别名映射
const ALIASES: Record<string, string> = {
  石头人: 'Malphite',
  石爷: 'Malphite',
  亡灵: 'Sion',
  光辉: 'Lux',
  小炮: 'Tristana',
  崔丝塔娜: 'Tristana',
  火男: 'Brand',
  寒冰: 'Ashe',
  探险家: 'Ezreal',
  ez: 'Ezreal',
  EZ: 'Ezreal',
  女枪: 'MissFortune',
  刀妹: 'Katarina',
  影流: 'Zed',
  亚索: 'Yasuo',
  影男: 'Yone',
  小法师: 'Annie',
  大法师: 'Veigar',
  天启者: 'Karma',
  星之守护: 'Soraka',
  仙灵: 'Lulu',
  琴女: 'Sona',
  发条: 'Orianna',
  九尾: 'Ahri',
  奥托: 'Galio',
  皮城女警: 'Caitlyn',
  女警: 'Caitlyn',
  机器人: 'Blitzcrank',
  布里茨: 'Blitzcrank',
  蒙多: 'DrMundo',
  蒙多医生: 'DrMundo',
  世界蒙多: 'DrMundo',
  滑板鞋: 'Corki',
  科基: 'Corki',
  大发明家: 'Heimerdinger',
  海默: 'Heimerdinger',
  海默丁格: 'Heimerdinger',
  萨米拉: 'Samira',
  黑暗之女: 'Annie',
  堕落天使: 'Morgana',
  绿爸爸: 'Maokai',
  绿毛: 'Zac',
  芒果: 'Zac',
  蓝猫: 'Sona',
  牛头: 'Alistar',
  熊: 'Volibear',
  大虫子: "Cho'Gath",
  蘑菇: 'Teemo',
  小提莫: 'Teemo',
  雪人: 'Nunu',
  德莱厄斯: 'Darius',
  达瑞斯: 'Darius',
  大E: 'Darius',
  德邦: 'Garen',
  盖伦: 'Garen',
  阿特克斯: 'Aatrox',
}

type ChampionsDataType = Record<string, { zhName: string; tags: string[] }>
type RecommendationsDataType = Record<string, unknown>

const champions = championsData as ChampionsDataType
const recommendations = recommendationsData as RecommendationsDataType

export interface MatchResult {
  id: string
  zhName: string
  tags: string[]
  hasData: boolean
}

// 模糊匹配：别名 → 精确匹配 → 部分匹配
export function matchChampion(input: string): MatchResult | null {
  const trimmed = input.trim()

  // 1. 别名查找
  const aliasId = ALIASES[trimmed]
  if (aliasId && champions[aliasId]) {
    return makeResult(aliasId)
  }

  // 2. 精确中文名匹配
  for (const [id, c] of Object.entries(champions)) {
    if (c.zhName === trimmed) return makeResult(id)
  }

  // 3. 部分中文名匹配（输入是名字的一部分）
  for (const [id, c] of Object.entries(champions)) {
    if (c.zhName.includes(trimmed) || trimmed.includes(c.zhName)) {
      return makeResult(id)
    }
  }

  // 4. 英文 ID 匹配（不区分大小写）
  for (const id of Object.keys(champions)) {
    if (id.toLowerCase() === trimmed.toLowerCase()) return makeResult(id)
  }

  return null
}

function makeResult(id: string): MatchResult {
  const c = champions[id]
  return {
    id,
    zhName: c.zhName,
    tags: c.tags,
    hasData: id in recommendations,
  }
}

export function getRecommendation(id: string) {
  return (recommendations as Record<string, unknown>)[id] ?? null
}
