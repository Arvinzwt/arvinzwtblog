---
title: "MATTER笔记02：核心模块"
date: "2025-04-01"
tag: "matter.js"
description: "一个用于网页的2D刚体物理引擎"
---

## 引擎（Engine）

核心模块，负责更新物理世界和模拟物体运动。

## 世界（World））

包含所有物理物体、约束和碰撞对的容器。

## 物体（Bodies））

用于创建各种形状的刚体（如矩形、圆形、多边形等）。

## 约束（Constraints））

如弹簧、铰链等，用于限制物体间的运动。

## 复合体（Composites））

将多个物体和约束组合成复杂结构（如车辆、链式结构等）。

## 碰撞检测（Collision））

高效的碰撞检测系统，支持多种形状的碰撞。

### 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)
[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

上一篇：[MATTER笔记01：基础概念](/posts/post-015)

下一篇：[MATTER笔记03：主要模块](/posts/post-017)
