---
title: "Shell学习笔记1：Bash 简介"
date: "2024-12-02"
tag: "Shell"
description: "本教程介绍 Linux 命令行 Bash 的基本用法和脚本编程。"
---

Bash 是一个“命令行解释器”，你可以把它想象成你和电脑“说话”的翻译官。

- 你输入文字命令（比如 ls、cd），Bash 会听懂并告诉电脑该做什么。

- 它是 Linux 和 macOS 系统默认的“翻译官”（Windows 用户也可以通过工具如 Git Bash 使用它）。

Shell 是用户与操作系统内核（Kernel）交互的“命令行界面”，而 **Bash** 只是其中一种 Shell。不同的 Shell 有不同的语法、功能和特点。以下是常见的 Shell 种类及其简单对比：

### **0. bash和shell**

Shell 是“命令行解释器”的总称，Bash 是其中的一种。可以类比为：

- Shell ≈ 手机
- Bash ≈ iPhone（手机的一种，且目前最流行）。

### **1. 主流 Shell 类型**

#### **(1) Bourne Shell (`sh`)**

- **历史最悠久**，1977 年由 Stephen Bourne 开发。
- **特点**：语法简洁，但功能较少（比如没有命令行历史、Tab 补全）。
- **现状**：现代系统上的 `sh` 通常是其他 Shell 的兼容模式（如 Bash 以 `sh` 模式运行）。

#### **(2) Bash (Bourne-Again Shell)**

- **最流行**，1989 年作为 `sh` 的增强版发布。
- **特点**：
  - 支持 `sh` 的所有功能，并扩展了交互式操作（如命令历史、自动补全）。
  - 支持数组、字符串操作等高级特性。
- **现状**：Linux 和 macOS 的默认 Shell（macOS 现已改为 `zsh`，但仍保留 Bash）。

#### **(3) Zsh (Z Shell)**

- **Bash 的强力竞争者**，1990 年发布，近年因 Oh My Zsh 框架流行。
- **特点**：
  - 兼容 Bash，但更强大（如更智能的补全、主题美化）。
  - 支持全局别名、拼写纠正等。
- **现状**：macOS 从 Catalina 开始默认 Shell 改为 Zsh。

#### **(4) Korn Shell (`ksh`)**

- 1983 年发布，结合了 `sh` 和 C Shell 的优点。
- **特点**：脚本兼容 `sh`，交互体验类似 Bash，但更轻量。
- **现状**：常见于商业 Unix 系统（如 IBM AIX）。

#### **(5) C Shell (`csh`) 和 Tenex C Shell (`tcsh`)**

- **语法类 C 语言**，适合熟悉 C 的程序员。
- **特点**：
  - `csh` 最早支持命令行历史、作业控制，但脚本语法易出错。
  - `tcsh` 是 `csh` 的增强版，加入了补全等功能。
- **现状**：逐渐被 Bash/Zsh 取代，但在某些学术领域仍在使用。

#### **(6) Fish (Friendly Interactive Shell)**

- **现代设计**，2005 年发布，强调用户体验。
- **特点**：
  - 自动补全、语法高亮、图形化配置。
  - 语法不兼容 Bash，更适合交互式使用。
- **现状**：适合个人电脑，但脚本移植性较差。

---

### **2. 如何查看和切换 Shell？**

- **查看当前 Shell**：
  ```bash
  echo $SHELL
  ```
- **查看系统已安装的 Shell**：
  ```bash
  cat /etc/shells
  ```
- **临时切换 Shell**（如切换到 `zsh`）：
  ```bash
  zsh
  ```
- **永久切换 Shell**：
  ```bash
  chsh -s /bin/zsh  # 将默认 Shell 改为 zsh
  ```

---

### **3. 如何选择 Shell？**

| Shell    | 适合场景           | 优点                      | 缺点             |
| -------- | ------------------ | ------------------------- | ---------------- |
| **Bash** | 通用、脚本兼容性   | 功能全面，文档丰富        | 配置复杂         |
| **Zsh**  | 交互式使用、美化   | 插件生态强大（Oh My Zsh） | 启动稍慢         |
| **Fish** | 个人电脑、新手友好 | 开箱即用，直观            | 不兼容 Bash 语法 |
| **sh**   | 脚本兼容性         | 极简，跨平台              | 功能太少         |
| **ksh**  | 商业 Unix 环境     | 轻量稳定                  | 社区支持少       |

---

### **4. 一句话总结**

- **写脚本？** 用 `Bash`（兼容性最好）或 `sh`（追求最小依赖）。
- **日常用？** 选 `Zsh`（功能+颜值）或 `Fish`（无脑上手）。
- **老系统？** 可能需要 `ksh` 或 `csh`。

---

### 参考文献

[Bash 脚本教程](https://wangdoc.com/bash/)
[一篇文章让你彻底掌握 Shell](https://mp.weixin.qq.com/s/GmSqHJiBToncvcpFAJUZbw)
