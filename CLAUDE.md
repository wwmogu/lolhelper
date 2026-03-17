# 海克斯大乱斗菜鸟指北

> **归档约定**：每次修改本文件前，先将旧版本复制到 `Archive/CLAUDE-vX-描述.md`，再覆盖本文件。

## 项目简介

面向英雄联盟「海克斯大乱斗」模式的网页查询工具。输入英雄名字，立刻获得：技能加点顺序、海克斯强化推荐（按适配优先级排序）、装备推荐。

## 当前架构（MVP 已完成）

### 核心设计原则

- **数据静态化**：技能加点、海克斯强化、装备全部来自本地 JSON，不依赖 AI 生成
- **AI 仅做兜底**：只在本地模糊匹配失败时，调用 GLM-4.7 识别英雄名（极短调用，max_tokens=20）
- **无后端**：纯前端，浏览器直接调用 AI API
- **Pages 兼容**：可直接部署到 GitHub Pages，API Key 由用户在运行时输入并保存在本地浏览器

### 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **构建**: Vite + pnpm
- **AI**: 智谱 BigModel GLM-4.7（`https://open.bigmodel.cn/api/paas/v4/chat/completions`）
- **API Key**: 用户在前端页面输入，存到浏览器 `localStorage`

### 文件结构

```
src/
├── App.tsx                     # 主组件，搜索逻辑
├── components/
│   ├── SearchBar.tsx           # 输入框 + 查询按钮
│   └── ResultCard.tsx          # 结果展示（技能/强化/装备卡片）
├── services/
│   ├── champion.ts             # 英雄模糊匹配（别名表 + 精确/部分匹配）
│   ├── ai.ts                   # GLM-4.7 调用（identifyChampion 兜底识别）
│   └── apiKey.ts               # 浏览器本地 API Key 读写
└── data/
    ├── champions.json          # 172 个英雄（来自 Data Dragon 16.5.1）
    ├── augments.json           # 202 个海克斯大乱斗强化（来自 apexlol.info）
    └── recommendations.json    # 45 个英雄的静态推荐数据
```

### 数据说明

**`augments.json`**
- 来源：apexlol.info/zh（海克斯大乱斗专属强化池）
- 注意：不能使用 Community Dragon `cdragon/arena/` 端点，那是斗魂竞技场数据，两者强化池不同
- 结构：`{ silver: [{name}], gold: [{name}], prismatic: [{name}] }`
- 用途：在 ResultCard 中为每个强化显示品阶角标（银/金/彩）

**`recommendations.json`**
- 每个英雄包含：`skillOrder`、`skillNote`、`items {S,A,avoid}`、`augments {S,A,avoid}`、`summary?`
- `augments` 为扁平结构，按推荐优先级排序（不分品阶分组），品阶仅作为角标展示
- 强化名必须与 `augments.json` 中的名称完全一致，否则角标不显示

**`champions.json`**
- 来源：Data Dragon 16.5.1
- 结构：`{ [id]: { zhName, tags } }`

### 强化显示逻辑

ResultCard 中为每个强化名查找品阶：
```
augments.json → name→tier 反查表 → 显示 银/金/彩 角标
```
S/A/差 三行，差级条目带删除线。

## 开发命令

```bash
pnpm install
pnpm dev      # 开发服务器
pnpm build    # 生产构建
```

## GitHub Pages 部署

- `vite.config.ts` 使用相对 `base`，适配仓库子路径部署
- `.github/workflows/deploy-pages.yml` 会在 `main` 分支推送后自动构建并发布
- Pages 为公开静态托管，不能内置平台级密钥；当前采用“用户自行输入 API Key”的模式

## 自定义 Slash Command

`.claude/commands/update-lol-data.md` — `/update-lol-data`

更新强化数据时使用：从 apexlol.info/zh 抓取最新海克斯大乱斗强化列表，与当前 augments.json 对比，确认后更新文件。

## 待改进

- 覆盖英雄数量：当前 45 个，172 个英雄中大多数暂无数据
- 推荐数据需经实际对局验证后持续修正
- 强化名称可能随版本更新变化，需定期执行 `/update-lol-data`
