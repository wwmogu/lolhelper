const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const API_KEY = import.meta.env.VITE_GLM_API_KEY as string

// 识别用户输入是哪个英雄，返回标准中文名（极短调用）
export async function identifyChampion(input: string): Promise<string> {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'glm-4.7',
      max_tokens: 20,
      messages: [
        {
          role: 'system',
          content:
            '你是英雄联盟助手。用户输入一个英雄的名字或别名，你只返回该英雄的标准中文名，不要任何其他内容。例如输入"石头人"返回"石头人"，输入"亚索"返回"疾风剑豪"。',
        },
        { role: 'user', content: input },
      ],
    }),
  })
  if (!resp.ok) throw new Error(`识别失败 ${resp.status}`)
  const data = await resp.json()
  return data.choices[0].message.content.trim()
}

// 生成装备推荐（流式）
export async function queryBuild(
  champion: string,
  tags: string[],
  onChunk: (text: string) => void
): Promise<void> {
  const roleHint = tags.join('/')
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'glm-4.7',
      stream: true,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content:
            '你是英雄联盟「海克斯大乱斗」模式专家。给出指定英雄最主流的出装方案（6件含鞋），格式：装备1、装备2、装备3、装备4、装备5、装备6，然后换行一句话说明思路。只输出这些，不要废话。',
        },
        { role: 'user', content: `${champion}（${roleHint}）` },
      ],
    }),
  })

  if (!response.ok) throw new Error(`API 错误 ${response.status}`)

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const content = json.choices?.[0]?.delta?.content
        if (content) onChunk(content)
      } catch {
        // 忽略
      }
    }
  }
}
