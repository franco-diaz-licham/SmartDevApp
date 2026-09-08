import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ArticleMarkdown } from './ArticleMarkdown';

describe('ArticleMarkdown', () => {
  test.each(['\n', '\n\n', '\n  \n', '\r\n', '\r\n\r\n'])('renders headings and list content separated by %j', (separator) => {
    render(
      <ArticleMarkdown
        markdown={['# Domain 1: Cloud Concepts (25–30%)', '## What cloud computing is', '- Delivery of computing services over the internet — VMs, storage, databases, networking, plus expanded offerings like IoT, ML, AI.'].join(separator)}
      />
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Domain 1: Cloud Concepts (25–30%)');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('What cloud computing is');
    expect(screen.getByRole('listitem')).toHaveTextContent('Delivery of computing services over the internet');
  });

  test('preserves paragraphs and groups adjacent list items between headings', () => {
    const { container } = render(<ArticleMarkdown markdown={'# Heading\nFirst line\nSecond line\n- One\n- Two\nFollowing paragraph\n## Subheading'} />);

    expect(Array.from(container.children, (element) => element.tagName)).toEqual(['H2', 'P', 'UL', 'P', 'H3']);
    expect(container.querySelector('p')?.textContent).toBe('First line\nSecond line');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Following paragraph')).toBeInTheDocument();
  });

  test('keeps blank lines and markdown syntax inside fenced code', () => {
    const { container } = render(<ArticleMarkdown markdown={'# Heading\n```md\n## Code heading\n\n- Code list\n```\n## Subheading'} />);

    expect(container.querySelector('code')?.textContent).toBe('## Code heading\n\n- Code list');
    expect(screen.getAllByRole('heading')).toHaveLength(2);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('assigns unique anchors to adjacent repeated headings', () => {
    render(<ArticleMarkdown markdown={'## Repeat\n## Repeat'} />);

    expect(screen.getAllByRole('heading').map((heading) => heading.id)).toEqual(['repeat', 'repeat-2']);
  });
});
