从 apexlol.info 抓取最新的**海克斯大乱斗**强化数据，更新 `src/data/augments.json`。

> ⚠️ 注意：旧版本使用的 `cdragon/arena/zh_cn.json` 是**斗魂竞技场**数据，与海克斯大乱斗强化池不同，已废弃。

步骤：

1. 用 WebFetch 工具抓取以下页面，提取所有强化名（中文）：
   - `https://apexlol.info/zh/hextech/`（海克斯大乱斗强化总览，含银/金/棱彩分类）

2. 将抓取到的数据与当前 `src/data/augments.json` 对比：
   - 列出新增的强化（当前文件中没有的）
   - 列出已删除的强化（页面中不再存在的）
   - 列出名称有变化的强化

3. 如有变化，询问用户确认后，用 Write 工具覆盖写入 `src/data/augments.json`，格式保持：
```json
{
  "silver": [{"name": "..."}, ...],
  "gold": [{"name": "..."}, ...],
  "prismatic": [{"name": "..."}, ...]
}
```

4. 提示用户：更新强化列表后，还需检查 `src/data/recommendations.json` 中各英雄的推荐是否引用了已删除或改名的强化。
