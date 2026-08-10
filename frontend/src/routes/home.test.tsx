import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './home';

describe('HomePage', () => {
  it('shows backend health', () => {
    render(<HomePage status="ok" />);

    expect(screen.getByRole('status')).toHaveTextContent('Backend: ok');
  });
});
