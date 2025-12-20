import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import RepoCTA from '../components/features/RepoCard/RepoCTA';

afterEach(() => {
    cleanup();
});

describe('RepoCTA Component', () => {
    it('renders as a button with correct text', () => {
        render(<RepoCTA onNavigate={() => { }} />);
        const button = screen.getByRole('button', { name: /explore trending repositories/i });
        expect(button).toBeTruthy();
    });

    it('navigates to dashboard on click', () => {
        const mockNavigate = vi.fn();
        render(<RepoCTA onNavigate={mockNavigate} />);

        const button = screen.getByRole('button', { name: /explore trending repositories/i });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    });

    it('is statically positioned (not fixed)', () => {
        render(<RepoCTA onNavigate={() => { }} />);
        const button = screen.getByRole('button', { name: /explore trending repositories/i });

        console.log('Button Classes:', button.className);

        expect(button.className).not.toContain('fixed');
        expect(button.className).toContain('group');
        expect(button.className).toContain('flex');
    });
});
