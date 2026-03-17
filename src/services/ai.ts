const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

// 识别用户输入是哪个英雄，返回标准中文名（极短调用）
export async function identifyChampion(input: string, apiKey: string): Promise<string> {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
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
