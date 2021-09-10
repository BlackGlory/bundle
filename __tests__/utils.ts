import * as path from 'path'

export function getFixturesPath(relativePath: string): string {
  return path.join(__dirname, './fixtures', relativePath)
}
