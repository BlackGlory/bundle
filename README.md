# bundle
一种目录结构, 用于描述包含多媒体资源的单篇文章, 受到[TextBundle](http://textbundle.org/)强烈启发.

## Install

```sh
npm install --save @blackglory/bundle
# or
yarn add @blackglory/bundle
```

## 设计理念
一个CMS(在bundle的语境下是纯文本CMS)应该迁就于用户体验, 而不是让用户反过来配合它:
- 基于纯文本的系统没有供应商锁定, 并且用户拥有最大的编辑自由.
- 纯文本不等于Markdown, 文章的格式应该是自由的.
- 文章的文本与其相关的多媒体资源是一个整体, 应尽可能放在一起.
  这有助于降低用户的认知负担, 也让相关文件更加整洁, 更易于管理.

## 定义
一个典型的bundle目录结构如下:

```
.
├── assets
│   ├── hello.png
│   └── world.png
├── index.md
└── meta.json
```

bundle目录下的其他文件和目录会被忽略, 从而允许在此存放临时文件, 系统文件和版本控制系统使用的目录.

### /
bundle的根目录, 目录的名称可以是随意的, 只要易于人类识别就好.

### /index
文章的入口, 也是文章的文本内容, 扩展名只与具体的解析器有关.

如果index文件不存在, 则不会将此目录视作一个bundle.

### /meta
文章的元数据, 是能够被解析为键值对字典的格式, 扩展名只与具体的解析器有关.

如果meta文件不存在, 则不会将此目录视作一个bundle.

### /assets
存放文章使用到的资源的目录.
