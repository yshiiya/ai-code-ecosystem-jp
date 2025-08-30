import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface MarkdownData {
  slug: string
  content: string
  frontMatter: Record<string, any>
}

export async function getMarkdownFile(directory: string, slug: string): Promise<MarkdownData | null> {
  const docsDir = path.join(process.cwd(), 'docs', directory)
  const fileName = `${slug}.md`
  const fullPath = path.join(docsDir, fileName)

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      content,
      frontMatter: data
    }
  } catch (error) {
    console.error(`Error reading markdown file: ${fullPath}`, error)
    return null
  }
}

export function getAllMarkdownFiles(directory: string): MarkdownData[] {
  const docsDir = path.join(process.cwd(), 'docs', directory)
  
  try {
    const files = fs.readdirSync(docsDir)
    const markdownFiles = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace('.md', '')
        const fullPath = path.join(docsDir, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        return {
          slug,
          content,
          frontMatter: data
        }
      })
    
    return markdownFiles
  } catch (error) {
    console.error(`Error reading directory: ${docsDir}`, error)
    return []
  }
}

export function getToolData(toolId: string) {
  return getMarkdownFile('tools-data', toolId)
}

export function getMCPData(mcpId: string) {
  return getMarkdownFile('mcp-data', mcpId)
}

export function getCLIData(cliId: string) {
  return getMarkdownFile('cli-tools', cliId)
}