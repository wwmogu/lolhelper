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

> API Key 申请：[智谱 BigModel 开放平台](https://open.bigmodel.cn/)

```bash
pnpm dev
```

打开页面后，在顶部「AI 兜底识别设置」中输入你自己的 GLM API Key。Key 仅保存在当前浏览器的 `localStorage`，不会参与构建，也不会上传到仓库。

## 构建

```bash
pnpm build   # 产物在 dist/
```

## 部署到 GitHub Pages

可以，当前项目已经适配纯静态部署：

- 页面主体是 React + Vite 静态站点
- 查询数据来自本地 JSON
- AI 只在本地匹配失败时调用，改成了用户运行时输入 API Key，不依赖服务端

仓库中已包含 GitHub Pages workflow：推送到 `main` 后会自动构建并发布 `dist/`。

首次启用时，在 GitHub 仓库设置中确认：

1. `Settings -> Pages -> Build and deployment` 选择 `GitHub Actions`
2. 默认分支为 `main`

注意：

- GitHub Pages 是公开静态托管，不能安全保存平台级 API Key
- 现在的方案是让每个用户自行输入自己的 GLM API Key，仅在自己的浏览器里保存
- 如果未来需要“免输入 Key”，就必须增加后端代理，不适合直接放在 Pages 上

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
