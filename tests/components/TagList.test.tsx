import { render, screen, waitFor } from '@testing-library/react'
import TagList from '../../src/components/TagList';

describe('TagList', () => {
    it('should render tags', async() => {
        render(<TagList />)

        // waitFor is used to wait for the asynchronous operation to complete
        // and the component to re-render with the new state.
        // This is useful when the component fetches data or performs some async operation.
        
        // await waitFor(() => {
        //     const listItems = screen.getAllByRole('listitem');
        //     expect(listItems.length).toBeGreaterThan(0);
        // })

        // findAllByRole is a query that returns a promise that resolves when the elements are found.
        // It automatically waits for the elements to appear in the DOM.
        const listItems = await screen.findAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
    })
})