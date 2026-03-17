# 海克斯大乱斗菜鸟指北

英雄联盟「海克斯大乱斗」模式速查工具。输入英雄名字，秒查技能加点、海克斯强化推荐、装备推荐。

## 功能

- **技能加点**：主副技能顺序 + 要点说明
- **海克斯强化**：按适配优先级排序（S / A / 差），每个强化标注品阶（银/金/彩）
- **装备推荐**：S / A / 差 分级
- **核心速查**：部分英雄附带一句话总结
- **智能识别**：支持中文名、英文名、常用别名（如"小炮"、"滑板鞋"、"蒙多医生"）；本地匹配失败时自动调用 AI 兜底

## 本地运行

**环境要求**：Node.js 18+、pnpm

```bash
pnpm install
```

在项目根目录创建 `.env`：

```
VITE_GLM_API_KEY=your_api_key_here
```

> API Key 申请：[智谱 BigModel 开放平台](https://open.bigmodel.cn/)

```bash
pnpm dev
```

## 构建

```bash
pnpm build   # 产物在 dist/
```

## 数据说明

- 强化数据来源：[apexlol.info](https://apexlol.info/zh/hextech/)（海克斯大乱斗专属强化池）
- 英雄数据来源：Data Dragon 16.5.1
- 当前收录英雄：45 个
- 推荐数据需经实际对局验证，如发现不准确欢迎提 Issue

## 更新强化数据

强化池随版本更新时，在 Claude Code 中执行：

```
/update-lol-data
```
