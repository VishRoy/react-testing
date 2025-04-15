import { fireEvent, render, screen } from '@testing-library/react';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';

describe('ToastDemo', () => {
    it('should render a toast', async() => {
        render(<>
            <ToastDemo />
            <Toaster />
        </>);

        const button = screen.getByRole('button', { name: /Show Toast/i });
        fireEvent.click(button);
        const toast = await screen.findByText('Success');
        expect(toast).toBeInTheDocument();
    })
})