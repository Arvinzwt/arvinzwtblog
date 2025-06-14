---
title: "Shell学习笔记3：模式拓展"
date: "2024-12-04"
tag: "Shell"
description: "本教程介绍 Linux 命令行 Bash 的基本用法和脚本编程。"
---

### 简介

当你在 Shell 中输入一条命令并按下回车后，Shell 会按照以下步骤处理你的输入：

- 1、Shell 首先会根据空格把你的命令拆分成几个独立的部分（称为“词元”或“token”）。
- 2、如果某个词元里包含 \*、?、{}、~、$ 等特殊字符，Shell 会先自动替换它们（称为“扩展”）。
- 3、在所有扩展完成后，Shell 才会真正调用对应的程序（如 cp、ls、echo 等），并传递处理后的参数。

这种特殊字符的扩展，称为模式扩展（globbing）。Bash 一共提供八种扩展，并严格按照顺序执行：

- 大括号扩展

- 波浪号扩展

- 参数扩展

- 命令扩展

- 算术扩展

- 进程扩展

- 单词拆分

- 文件名扩展

从上到下处理命令行，每种扩展完成后才会进入下一步。其中需要注意的是：

- 双引号 " " 会禁用部分扩展（如 \*、?），但允许变量和命令替换

- 单引号 ' ' 会禁用所有扩展

- 模式扩展：在 Bash 文档中特指文件名扩展（即通配符 \*?[]），但广义上可能被用来泛指所有扩展

- 引用删除：是 Shell 解析的最后一步（在所有扩展之后），严格来说不属于"扩展"范畴

示例：

```bash
echo "*.txt"    # 输出 *.txt（不扩展）
echo '$HOME'    # 输出 $HOME（不扩展）
echo "$var"     # 输出 $var 的值
```

Bash 允许用户打开或者关闭扩展。

```bash
# 关闭扩展
$ set -o noglob
# 或者
$ set -f

# 打开扩展
$ set +o noglob
# 或者
$ set +f
```

### 扩展详解

#### 大括号扩展

大括号扩展 {...} 会生成任意给定的字符串组合，主要用于生成多个相似字符串。
基本语法：

```bash
{字符串1,字符串2,字符串3}
```

示例：

```bash
echo a{b,c,d}e   # 输出 abe ace ade
echo {1..5}      # 输出 1 2 3 4 5
echo {a..d}      # 输出 a b c d
echo {01..10}    # 输出 01 02 03 ... 10
```

进阶用法：

```bash
# 步进
echo {1..10..2}  # 输出 1 3 5 7 9

# 嵌套扩展
echo {A{1,2},B{3,4}}  # 输出 A1 A2 B3 B4

# 创建目录
mkdir /usr/local/src/bash/{old,new,dist,bugs}
```

#### 波浪号扩展

波浪号 ~ 表示用户的主目录。
基本用法：

```bash
echo ~       # 输出当前用户主目录
echo ~root   # 输出root用户的主目录
echo ~fred   # 输出fred用户的主目录
```

特殊用法：

```bash
echo ~+      # 等同于 pwd，输出当前目录
echo ~-      # 输出上一个工作目录（等同于 $OLDPWD）

```

#### 参数拓展

参数扩展 ${...} 用于引用和操作变量。

基本用法：

```bash
echo $USER    # 简写形式
echo ${USER}  # 标准形式

```

高级用法：

```bash
# 默认值
${var:-default}    # 如果var未设置或为空，返回default
${var:=default}    # 如果var未设置或为空，设置var为default并返回

# 字符串操作
${#var}           # 返回字符串长度
${var:offset:len} # 子字符串
${var#pattern}    # 删除最短匹配前缀
${var##pattern}   # 删除最长匹配前缀
${var%pattern}    # 删除最短匹配后缀
${var%%pattern}   # 删除最长匹配后缀

# 替换
${var/old/new}    # 替换第一个匹配
${var//old/new}   # 替换所有匹配
```

#### 命令拓展

命令扩展 $(...) 或 `...` 用于执行命令并将输出替换到当前位置。

示例：

```bash
echo "Today is $(date)"
echo "There are $(ls | wc -l) files here"

```

#### 算术拓展

算术扩展 $((...)) 用于执行算术运算。

示例：

```bash
echo $((2 + 2))      # 输出 4
x=5; y=7
echo $((x * y))      # 输出 35
echo $(( (x + y) / 2 ))  # 输出 6

```

支持的运算符包括：+ - \* / % \*\* ++ -- 等。

#### 进程拓展

进程扩展 <(...) 和 >(...) 用于处理命令输出作为文件。

示例：

```bash
diff <(ls dir1) <(ls dir2)  # 比较两个目录的文件列表


```

#### 单词拆分

Shell 会根据 $IFS（内部字段分隔符）对未加引号的扩展结果进行单词拆分。
默认情况下，$IFS 包含空格、制表符和换行符。

示例：

```bash
text="one two three"
for word in $text; do
    echo $word
done
# 输出：
# one
# two
# three

```

#### 文件名拓展

文件名扩展（通配符扩展）使用特殊字符匹配文件名：

- \*：匹配任意数量任意字符

- ?：匹配单个任意字符

- [...]：匹配括号内的任意一个字符

- [!...] 或 [^...]：不匹配括号内的字符
- 示例：

```bash
ls *.txt           # 列出所有.txt文件
ls image?.jpg      # 列出image1.jpg, image2.jpg等
ls [abc]*          # 列出以a、b或c开头的文件
ls [!0-9]*         # 列出不以数字开头的文件

```

高级用法：

```bash
ls {*.mp3,*.mp4}   # 列出所有.mp3和.mp4文件
ls *.{jpg,png}      # 列出所有.jpg和.png文件

```

#### 引用删除

引用删除是 Shell 处理的最后一步，它会删除所有未引用的转义字符 \ 和引号字符。

示例：

```bash
echo \'hello\'      # 输出 'hello'
echo "'hello'"      # 输出 'hello'

```

### 最佳实践

#### 1、引号使用：

- 使用双引号保护变量扩展和命令扩展

- 使用单引号保护不需要任何扩展的字符串

- 避免在文件名中使用空格或特殊字符

#### 扩展顺序：

- 记住扩展是按顺序进行的，大括号扩展最先，文件名扩展最后

- 复杂的扩展可以分步测试

#### 调试技巧：

```bash
set -x   # 开启调试模式

# 执行命令
set +x   # 关闭调试模式
```

#### 安全性：

- 对用户输入进行验证，防止命令注入
- 使用 -- 表示选项结束，防止文件名被解释为选项

### 参考文献

[Bash 脚本教程](https://wangdoc.com/bash/)
[一篇文章让你彻底掌握 Shell](https://mp.weixin.qq.com/s/GmSqHJiBToncvcpFAJUZbw)
