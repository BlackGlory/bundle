# bundle
一种用于描述文档的目录结构, 受到[TextBundle]的启发.

与TextBundle的不同点:
- Bundle直接以目录结构在文件系统里表示, 不需要打包.
- Bundle的文本文件和元数据文件的格式是任意的, 不局限于Markdown和JSON.

[TextBundle]: http://textbundle.org/

## Install
```sh
npm install --save @blackglory/bundle
# or
yarn add @blackglory/bundle
```

## 定义
一个典型的bundle目录结构如下:
```
.
├── assets
│   ├── foo.png
│   └── bar.png
├── meta.json
└── text.md
```

bundle目录下的其他文件和目录会被忽略, 从而允许在此存放临时文件, 系统文件和版本控制系统.

### `/`
bundle的根目录, 目录名称是随意的, 只需要便于人类识别.

### `/meta.{extension}`
bundle的元数据, 它是一种能够被解析为键值对字典的文件, 格式不受限制, 取决于具体实现.

如果meta文件不存在, 或meta文件存在多个, 则不会将此目录视作一个bundle.

### `/meta.{variant}.{extension}`
bundle元数据的变体.

相同变体名的meta文件只能存在一个, 否则将被视作无效变体.

### `/text.{extension}`
bundle的文本, 格式不受限制, 取决于具体实现.

如果text文件不存在, 或text文件存在多个, 则不会将此目录视作一个bundle.

### `/text.{variant}.{extension}`
bundle文本的变体.

相同变体名的text文件只能存在一个, 否则将被视作无效变体.

### `/assets/**/*.{extension}`
bundle的资源文件.

## API
```ts
interface IBundle {
  /**
   * The path of the root directory.
   */
  root: string

  /**
   * The path of the meta file, relative to the root directory.
   */
  meta: string

  /**
   * The path of the text file, relative to the root directory.
   */
  text: string

  /**
   * The paths of assets, relative to the root directory.
   */
  assets: string[]

  /**
   * The variants.
   */
  variants: Record<string, IBundleVariant>
}

interface IBundleVariant {
  /**
   * The path of the meta file variant, relative to the root directory.
   */
  meta?: string

  /**
   * The path of the text file variant, relative to the root directory.
   */
  text?: string
}
```

### buildBundle
```ts
/**
 * @throws {NotDirectoryError}
 * @throws {NoMetaFileError}
 * @throws {NoTextFileError}
 * @throws {TooManyMetaFilesError}
 * @throws {TooManyTextFilesError}
 */
function buildBundle(pathname: string): Promise<IBundle>
```

### isBundle
```ts
function isBundle(pathname: string): Promise<boolean>
```

### findAllBundles
```ts
function findAllBundles(pathname: string): AsyncIterable<IBundle> 
```
