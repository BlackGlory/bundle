import * as path from 'path'
import { fileURLToPath } from 'url'

export function getFixturesPath(relativePath: string): string {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  return path.join(__dirname, './fixtures', relativePath)
}
