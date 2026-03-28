import { render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <App />,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should show the game title and start action', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /spiral/i })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /start new game/i }),
    ).toBeTruthy();
  });
});
