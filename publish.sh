#!/usr/bin/env bash


#rm -rf node_modules package-lock.json
#pnpm install
#npm run dev:turbopack
#echo 'npm 重装完成'

#const fs = require("fs/promises");
#const path = require("path");
#
#async function renameFiles(directoryPath) {
#  try {
#    const files = await fs.readdir(directoryPath);
#
#    await Promise.all(
#      files.map(async (file, index) => {
#        const oldPath = path.join(directoryPath, file);
#        const oldName = path.basename(oldPath);
#        const da = function (n) {
#          return n <= 9 ? `00${n}` : n <= 99 ? `0${n}` : `n`;
#        };
#
#        const ext = path.extname(file);
#        const newName = da(parseFloat(oldName.split(".")[0]) + 1);
#        const newPath = path.join(directoryPath, `post-${newName}${ext}`);
#
#        await fs.rename(oldPath, newPath);
#        console.log(`Renamed: ${file} → ${newName}`);
#        // console.log(newPath, 11);
#      }),
#    );
#
#    console.log("所有文件重命名完成！");
#  } catch (err) {
#    console.error("出错:", err);
#  }
#}
#
#// 使用示例
#renameFiles("./posts"); // 替换为你的文件夹路径
