---
title: "Shell学习笔记2：基本语法"
date: "2024-12-03"
tag: "Shell"
description: "本教程介绍 Linux 命令行 Bash 的基本用法和脚本编程。"
---

### echo 命令

echo命令的作用是在屏幕输出一行文本，可以将该命令的参数原样输出。

```bash
echo hello world
```

如果想要输出的是多行文本，即包括换行符。这时就需要把多行文本放在引号里面。

```bash
echo "<HTML>
  <HEAD>
    <TITLE>Page Title</TITLE>
  </HEAD>
  <BODY>
    Page body.
  </BODY>
</HTML>"
```

#### 支持参数

| 参数       | 描述                                     | 例子                     |
| ---------- | ---------------------------------------- | ------------------------ |
| **-n**参数 | 取消末尾的回车符                         | `echo -n hello world`    |
| **-e**参数 | 解释引号（双引号和单引号）里面的特殊字符 | `echo -e "Hello\nWorld"` |

---

### 命令的格式

Shell 命令基本都是下面的格式。

```bash
command [ arg1 ... [ argN ]]
```

| 参数              | 描述                         | 例子   |
| ----------------- | ---------------------------- | ------ |
| **command**       | 具体的命令或者一个可执行文件 | `echo` |
| **arg1 ... argN** | 传递给命令的参数             | `-e`   |

同一个配置项往往有长和短两种形式，如：

```bash
# 短形式
$ ls -r

# 长形式
$ ls --reverse
```

作用完全一样，前者便于输入，后者便于理解；

有些命令比较长，写成多行会有利于阅读和编辑，这时可以在每一行的结尾加上反斜杠，Bash 就会将下一行跟当前行放在一起解释。

```bash

$ echo foo bar

# 等同于
$ echo foo \
bar
```

---

### 空格

Bash 使用空格（或 Tab 键）区分不同的参数，如果参数之间有多个空格，Bash 会自动忽略多余的空格。

```bash
$ command foo bar


# 等同于
$ command foo              bar
```

---

### 分号

分号（;）是命令的结束符，使得一行可以放置多个命令，上一个命令执行结束后，接着执行第二个命令，不管第一个命令执行成功或失败。

```bash
clear; ls
```

上面例子中，Bash 先执行clear命令，执行完成后，再执行ls命令。

---

### &&和||

```bash
Command1 && Command2
```

如果Command1命令运行成功，则继续运行Command2命令。

```bash
Command1 || Command2
```

上面命令的意思是，如果Command1命令运行失败，则继续运行Command2命令。

---

### type命令

type命令用来判断命令的来源。

```bash
$ type echo
echo is a shell builtin

$ type ls
ls is hashed (/bin/ls)
```

上面代码中，type命令告诉我们，echo是内部命令，ls是外部程序（/bin/ls）。
type命令本身也是内置命令。

| 参数   | 描述                                                                                                      | 例子           |
| ------ | --------------------------------------------------------------------------------------------------------- | -------------- |
| **-a** | 查看一个命令的所有定义                                                                                    | `type -a echo` |
| **-t** | 返回一个命令的类型：别名（alias），关键词（keyword），函数（function），内置命令（builtin）和文件（file） | `type -t bash` |

---

### 快捷键

Bash 提供很多快捷键，可以大大方便操作。下面是一些最常用的快捷键，完整的介绍参见《行操作》一章。

- Ctrl + L：清除屏幕并将当前行移到页面顶部。
- Ctrl + C：中止当前正在执行的命令。
- Shift + PageUp：向上滚动。
- Shift + PageDown：向下滚动。
- Ctrl + U：从光标位置删除到行首。
- Ctrl + K：从光标位置删除到行尾。
- Ctrl + W：删除光标位置前一个单词。
- Ctrl + D：关闭 Shell 会话。
- ↑，↓：浏览已执行命令的历史记录。

除了上面的快捷键，Bash 还具有自动补全功能。命令输入到一半的时候，可以按下 Tab 键，Bash 会自动完成剩下的部分。比如，输入tou，然后按一下 Tab 键，Bash 会自动补上ch。

除了命令的自动补全，Bash 还支持路径的自动补全。有时，需要输入很长的路径，这时只需要输入前面的部分，然后按下 Tab 键，就会自动补全后面的部分。如果有多个可能的选择，按两次 Tab 键，Bash 会显示所有选项，让你选择。

---

### 参考文献

[Bash 脚本教程](https://wangdoc.com/bash/)
[一篇文章让你彻底掌握 Shell](https://mp.weixin.qq.com/s/GmSqHJiBToncvcpFAJUZbw)
