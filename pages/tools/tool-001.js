import CodeEditor from "../../components/CodeEditor";
import React, { useState, useRef } from "react";
import PostsLayout from "../../components/PostsLayout";
import Head from "next/head";
import { ArchiveButton } from "../../components/ArchiveButton";

export default function Tool001() {
  const [code, setCode] = useState("");
  const codeEditRef = useRef(null);
  const host = "远程IP";
  const user = "用户名";
  const localPath = "/本地/目录";

  const codes = [
    {
      id: "0",
      name: "docker",
      children: [
        {
          id: "0-1",
          name: "docker：安装docker",
          desc: `
#更新系统：打开终端，运行以下命令来更新系统的软件包列表：
sudo apt update

#安装依赖包：运行以下命令以安装Docker所需的依赖包：
sudo apt install apt-transport-https ca-certificates curl software-properties-common

#添加Docker官方的GPG密钥：运行以下命令以下载并添加Docker官方的GPG密钥：
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

#添加Docker存储库：运行以下命令以添加Docker的官方存储库：
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

#安装Docker引擎：运行以下命令以安装Docker引擎：
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

#启动Docker服务：运行以下命令以启动Docker服务：
sudo systemctl start docker

#配置Docker为开机自启动：运行以下命令以配置Docker为开机自启动：
sudo systemctl enable docker
      `,
        },
        {
          id: "0-2",
          name: "docker：docker-compose安装",
          desc: `
#下载Docker Compose二进制文件：运行以下命令以下载Docker Compose的二进制文件：
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

#授予执行权限：运行以下命令以授予docker-compose二进制文件执行权限：
sudo chmod +x /usr/local/bin/docker-compose

#创建软链接：创建一个指向docker-compose的软链接，以便能够全局访问：
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

#验证安装：运行以下命令以验证Docker Compose是否成功安装：
docker-compose --version
      `,
        },
        {
          id: "0-3",
          name: "docker：运行docker-compose",
          desc: "docker-compose up -d",
        },
        {
          id: "0-4",
          name: "docker：运行docker-compose指定环境文件",
          desc: "docker-compose -f docker-compose.yml -e .env.prod up",
        },
        {
          id: "0-5",
          name: "docker：运行docker-compose指定文件位置",
          desc: "docker-compose -f /path/to/docker-compose.yml up",
        },
        {
          id: "0-6",
          name: "docker：进入容器内部",
          desc: `docker exec -it container_name_or_id bash`,
        },
      ],
    },
    {
      id: "2",
      name: "ssh",
      children: [
        {
          id: "2-1",
          name: "ssh：ssh密钥同步",
          desc: `ssh-copy-id -i ~/.ssh/id_rsa.pub ${user}@${host}`,
        },
        {
          id: "2-2",
          name: "ssh：ssh登录",
          desc: `ssh ${user}@${host}`,
        },
        {
          id: "2-3",
          name: "ssh：ssh生成密钥",
          desc: `ssh-keygen -t rsa -C "****@***.com"  `,
        },
        {
          id: "2-4",
          name: "ssh：ssh 从 known_hosts 文件中删除指定的主机密钥",
          desc: `ssh-keygen -R ${host}`,
        },
      ],
    },
    {
      id: "3",
      name: "scp",
      children: [
        {
          id: "3-1",
          name: "scp：scp上传文件｜文件夹",
          desc: `scp -r ${localPath} ${user}@${host}:/远程/路径/`,
        },
        {
          id: "3-2",
          name: "scp：scp下载文件｜文件夹",
          desc: `scp -r ${user}@${host}:/home/web ${localPath}`,
        },
        {
          id: "3-3",
          name: "说明",
          desc: `
-P：指定 SSH 端口（默认22时可省略）
-r：递归复制目录
-C：压缩传输
-i：指定私钥文件（默认用~/.ssh/id_rsa）
          `,
        },
      ],
    },
    {
      id: "4",
      name: "node",
      children: [
        {
          id: "4-1",
          name: "node：安装cnpm",
          desc: "npm install -g cnpm --registry=https://registry.npm.taobao.org",
        },
      ],
    },
    {
      id: "5",
      name: "ufw",
      children: [
        {
          id: "5-1",
          name: "ufw：检查防火墙是否已经启用",
          desc: "sudo ufw status verbose",
        },
        {
          id: "5-2",
          name: "ufw：列出已经开放的端口",
          desc: "sudo ufw status numbered",
        },
        {
          id: "5-3",
          name: "ufw：查看某个特定的端口是否已经开放",
          desc: "sudo ufw status | grep 80",
        },
        {
          id: "5-4",
          name: "ufw：开放特定端口",
          desc: "sudo ufw allow 8080/tcp",
        },
        {
          id: "5-5",
          name: "ufw：开放特定段位端口",
          desc: "sudo ufw allow 6000:6999/tcp",
        },
        {
          id: "5-6",
          name: "ufw：开放多个端口",
          desc: "sudo ufw allow 8080/tcp 9000/tcp 10000/tcp",
        },
        {
          id: "5-7",
          name: "ufw：开放特定 IP 地址访问特定端口",
          desc: `sudo ufw allow from ${host} to any port 8080/tcp`,
        },
        {
          id: "5-8",
          name: "ufw：重启防火墙",
          desc: `
sudo ufw disable  # 先禁用 ufw 防火墙
sudo ufw enable   # 再启用 ufw 防火墙
sudo ufw reload
      `,
        },
      ],
    },
    {
      id: "6",
      name: "systemctl",
      children: [
        {
          id: "6-1",
          name: "systemctl: 查看ubuntu软件运行情况",
          desc: `sudo systemctl status shadowsocks-libev`,
        },
        {
          id: "6-2",
          name: "systemctl: 关闭ubuntu软件",
          desc: `sudo systemctl stop shadowsocks-libev`,
        },
        {
          id: "6-3",
          name: "systemctl: 启动ubuntu软件",
          desc: `sudo systemctl start shadowsocks-libev`,
        },
        {
          id: "6-4",
          name: "systemctl: 启用自动启动",
          desc: `sudo systemctl enable shadowsocks-libev`,
        },
      ],
    },
    {
      id: "7",
      name: "git",
      children: [
        {
          id: "7-1",
          name: "git撤销远程提交",
          desc: `
git reset --soft gitHashCode***
git push origin dev --force
        `,
        },
        {
          id: "7-2",
          name: "批量删除已合并分支",
          desc: 'git branch --merged | grep -v "\\*" | xargs -n 1 git branch -d',
        },
      ],
    },
    {
      id: "8",
      name: "tar",
      children: [
        {
          id: "8-1",
          name: "tar:命令行压缩文件",
          desc: `tar -czvf mysql.gz mysqlfile1 mysqlfile2 mysqldirectory`,
        },
        {
          id: "8-2",
          name: "tar:命令行解压文件",
          desc: `tar -xzvf mysql.gz`,
        },
        {
          id: "8-3",
          name: "tar:查看压缩文件",
          desc: `tar -tf mysql.gz`,
        },
        {
          id: "8-4",
          name: "tar:添加文件到已有的压缩文件中",
          desc: `tar -rf mysql.gz newfile`,
        },
        {
          id: "8-5",
          name: "tar:从压缩的文件中删除",
          desc: `tar -f mysql.gz --delete file1`,
        },
        {
          id: "8-6",
          name: "tar:描述",
          desc: `-x表示从归档文件中提取文件，-z表示使用gzip解压缩算法，-v表示显示详细信息，-f后面跟着要解压缩的归档文件的名称`,
        },
      ],
    },
    {
      id: "9",
      name: "raspberry",
      children: [
        {
          id: "9-1",
          name: "发现《raspberrypi.local》的局域网服务",
          desc: ` dns-sd -G v4v6 raspberrypi.local `,
        },
      ],
    },
  ];

  const handleItemClick = (dItem) => {
    if (codeEditRef.current) {
      codeEditRef.current.handleChange(dItem.desc);
    }
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  return (
    <PostsLayout propsClass="bg-white px-3">
      <Head>
        <title>常用开发指令</title>
      </Head>
      <div className="py-3">
        <CodeEditor
          ref={codeEditRef}
          value={code}
          height={"100px"}
          onChange={handleCodeChange}
        />
        <ul
          style={{ height: `calc(100vh - 260px)` }}
          className="overflow-y-auto mt-3"
        >
          {codes.map((cItem) => {
            return (
              <li
                key={cItem.id}
                className="border border-gray-300 rounded-sm mb-3"
              >
                <h3 className="font-semibold text-base bg-blue-100 px-3 py-1">
                  {cItem.name}
                </h3>
                <div className="p-3">
                  {cItem.children.map((dItem) => {
                    return (
                      <ArchiveButton
                        propClass="mx-3 my-1"
                        key={dItem.id}
                        onClick={() => handleItemClick(dItem)}
                        type=""
                      >
                        {dItem.name}
                      </ArchiveButton>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </PostsLayout>
  );
}
