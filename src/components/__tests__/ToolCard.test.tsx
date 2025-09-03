import { render, screen } from '@testing-library/react'
import ToolCard from '../ToolCard'

describe('ToolCard', () => {
  const mockTool = {
    id: 'test-tool',
    name: 'Test Tool',
    category: 'Test Category',
    description: 'This is a test tool description',
    pricing: '$10/月',
    tags: ['tag1', 'tag2', 'tag3']
  }

  it('ツール情報を正しく表示する', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('This is a test tool description')).toBeInTheDocument()
    expect(screen.getByText('$10/月')).toBeInTheDocument()
  })

  it('タグを正しく表示する（最初の2つ）', () => {
    render(<ToolCard tool={mockTool} />)
    
    // ToolCardは最初の2つのタグのみ表示する仕様
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    // tag3は表示されない
    expect(screen.queryByText('tag3')).not.toBeInTheDocument()
  })

  it('リンクが正しく設定されている', () => {
    render(<ToolCard tool={mockTool} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tools/test-tool')
  })
})