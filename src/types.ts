export interface IBundle {
  /**
   * The path of the root directory
   */
  root: string

  /**
   * The path of the meta file, relative to the root directory
   */
  meta: string

  /**
   * The path of the text file, relative to the root directory
   */
  text: string

  /**
   * The path of assets, relative to the root directory
   */
  assets: string[]
}
