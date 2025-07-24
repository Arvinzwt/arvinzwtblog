---
title: "sqlite3，nodejs的亲密好友"
date: "2025-07-25"
tag: "Nodejs"
description: "Nodejs开发工具推荐"
---

SQLite是一个轻量级的嵌入式数据库引擎，它不需要单独的服务器进程，而是直接将数据库存储在磁盘文件中。对于Node.js开发者来说，特别是使用Express框架构建中小型应用时，SQLite是一个绝佳的选择。本文将详细介绍如何在Express项目中使用better-sqlite3这个高性能的SQLite3驱动。

## 为什么选择better-sqlite3？

在Node.js生态中，有几个SQLite3驱动可供选择：

1. **sqlite3**：最传统的选择，使用回调风格的API
2. **better-sqlite3**：同步API设计，性能更好
3. **TypeORM**等ORM工具：提供更高层次的抽象

better-sqlite3因其以下特点而脱颖而出：

- **同步API**：简化代码逻辑，无需处理回调或Promise链
- **卓越性能**：基准测试显示比sqlite3快10倍
- **简单易用**：API设计直观，学习曲线平缓
- **活跃维护**：持续更新和改进

## 安装better-sqlite3

首先，在你的Express项目中安装better-sqlite3：

```bash
npm install better-sqlite3
```

注意：better-sqlite3是原生模块，安装时需要编译。确保你的系统已安装Python和C++编译工具链。

## 基本使用指南

### 1. 初始化数据库连接

创建一个数据库连接通常放在单独的文件中（如`database.js`）：

```javascript
const Database = require('better-sqlite3');

// 创建或连接到数据库文件
const db = new Database('mydb.sqlite', {
  // 启用verbose模式记录执行的SQL语句
  verbose: console.log
});

// 启用WAL模式提高性能
db.pragma('journal_mode = WAL');

module.exports = db;
```

### 2. 创建表

在应用启动时，通常需要初始化数据库表结构：

```javascript
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();
```

### 3. 在Express路由中使用

以下是一些常见的CRUD操作示例：

#### 创建用户

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/users', (req, res) => {
  const { username, email } = req.body;
  
  try {
    const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    const info = stmt.run(username, email);
    
    res.status(201).json({
      id: info.lastInsertRowid,
      username,
      email
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});
```

#### 获取用户列表

```javascript
router.get('/users', (req, res) => {
  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
  const users = stmt.all();
  
  res.json(users);
});
```

#### 获取单个用户

```javascript
router.get('/users/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});
```

#### 更新用户

```javascript
router.put('/users/:id', (req, res) => {
  const { username, email } = req.body;
  
  try {
    const stmt = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
    const changes = stmt.run(username, email, req.params.id);
    
    if (changes.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: req.params.id, username, email });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});
```

#### 删除用户

```javascript
router.delete('/users/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(req.params.id);
  
  if (info.changes === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(204).end();
});
```

## 高级特性

### 1. 事务处理

better-sqlite3提供了简单的事务API：

```javascript
router.post('/posts', (req, res) => {
  const { userId, title, content } = req.body;
  
  try {
    db.transaction(() => {
      // 检查用户是否存在
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
      if (!user) throw new Error('User not found');
      
      // 插入文章
      const stmt = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)');
      const info = stmt.run(userId, title, content);
      
      return info.lastInsertRowid;
    })();
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### 2. 预处理语句重用

预处理语句可以重用，提高性能：

```javascript
// 在模块级别准备语句
const getUserStmt = db.prepare('SELECT * FROM users WHERE id = ?');
const getPostsByUserStmt = db.prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC');

router.get('/users/:id/posts', (req, res) => {
  const user = getUserStmt.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const posts = getPostsByUserStmt.all(req.params.id);
  res.json({ user, posts });
});
```

### 3. 数据序列化和反序列化

better-sqlite3支持自定义类型序列化：

```javascript
// 注册自定义类型处理器
db.defaultSafeIntegers(true); // 处理大整数

// 对于JSON数据
db.function('json', (val) => JSON.stringify(val));
db.function('json_extract', (val, prop) => {
  try {
    const obj = JSON.parse(val);
    return obj[prop];
  } catch {
    return null;
  }
});
```

### 4. 备份数据库

```javascript
router.post('/backup', (req, res) => {
  const backupFilename = `mydb-backup-${Date.now()}.sqlite`;
  
  db.backup(backupFilename)
    .then(() => {
      res.json({ success: true, file: backupFilename });
    })
    .catch(err => {
      res.status(500).json({ error: 'Backup failed' });
    });
});
```

## 性能优化技巧

1. **使用WAL模式**：如前所述，`journal_mode = WAL`可以显著提高并发性能
2. **批量插入**：使用事务进行批量插入
   ```javascript
   db.transaction(() => {
     const stmt = db.prepare('INSERT INTO logs (message) VALUES (?)');
     for (const message of messages) {
       stmt.run(message);
     }
   })();
   ```
3. **内存模式**：对于临时数据，可以使用内存数据库
   ```javascript
   const memoryDb = new Database(':memory:');
   ```
4. **调整PRAGMA设置**：
   ```javascript
   // 提高性能的PRAGMA设置
   db.pragma('synchronous = NORMAL');
   db.pragma('temp_store = MEMORY');
   db.pragma('mmap_size = 30000000000');
   ```

## 安全最佳实践

1. **永远不要直接拼接SQL**：始终使用预处理语句
   ```javascript
   // 错误做法（容易SQL注入）
   db.prepare(`SELECT * FROM users WHERE username = '${username}'`).get();
   
   // 正确做法
   db.prepare('SELECT * FROM users WHERE username = ?').get(username);
   ```
2. **限制连接数**：虽然SQLite是文件数据库，但better-sqlite3允许多个连接
3. **定期备份**：实现自动备份机制
4. **敏感数据加密**：考虑使用SQLite的加密扩展或应用层加密

## 与Express集成的最佳实践

1. **中间件模式**：将数据库连接附加到请求对象
   ```javascript
   // app.js
   const db = require('./database');
   
   app.use((req, res, next) => {
     req.db = db;
     next();
   });
   
   // 路由中
   router.get('/data', (req, res) => {
     const data = req.db.prepare('SELECT * FROM data').all();
     res.json(data);
   });
   ```
2. **错误处理中间件**：统一处理数据库错误
   ```javascript
   app.use((err, req, res, next) => {
     if (err.code && err.code.startsWith('SQLITE_')) {
       // 处理数据库错误
       return res.status(500).json({ error: 'Database error' });
     }
     next(err);
   });
   ```
3. **健康检查端点**：监控数据库连接状态
   ```javascript
   router.get('/health', (req, res) => {
     try {
       req.db.prepare('SELECT 1').get();
       res.json({ status: 'healthy' });
     } catch {
       res.status(500).json({ status: 'unhealthy' });
     }
   });
   ```

## 测试策略

1. **内存数据库**：测试时使用`:memory:`数据库
   ```javascript
   const testDb = new Database(':memory:');
   ```
2. **每个测试用例独立数据库**：
   ```javascript
   beforeEach(() => {
     const db = new Database(':memory:');
     // 初始化测试数据
   });
   
   afterEach(() => {
     db.close();
   });
   ```
3. **快照测试**：验证SQL查询结果
   ```javascript
   test('get user by id', () => {
     const user = db.prepare('SELECT * FROM users WHERE id = ?').get(1);
     expect(user).toMatchSnapshot();
   });
   ```

## 部署注意事项

1. **文件权限**：确保应用有数据库文件的读写权限
2. **文件锁定**：在集群模式下，避免多个进程同时写入SQLite文件
3. **备份策略**：实现定期备份机制
4. **性能监控**：监控查询性能，特别是随着数据量增长

## 何时选择SQLite vs 其他数据库

SQLite非常适合：
- 中小型应用
- 嵌入式应用
- 开发原型
- 单机应用
- 需要零配置的场景

考虑其他数据库（如PostgreSQL、MySQL）当：
- 需要高并发写入
- 数据量非常大
- 需要复杂的用户权限管理
- 需要分布式架构

## 结语

better-sqlite3为Node.js开发者提供了一种简单、高效的方式来利用SQLite的强大功能。在Express项目中，它特别适合中小型应用、原型开发和需要简单数据持久化的场景。通过本文介绍的模式和最佳实践，你可以构建出结构良好、性能优越的应用程序。

SQLite的简单性并不意味着功能有限 - 它支持大多数标准SQL功能，包括事务、触发器、视图和复杂的查询。结合better-sqlite3的同步API，你可以编写出既简洁又高效的数据库代码。

下次当你开始一个新的Node.js项目时，不妨考虑SQLite这个亲密好友 - 它可能会成为你技术栈中最不起眼但最可靠的一员。
