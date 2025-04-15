import { fireEvent, render, screen } from '@testing-library/react'
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
    const renderComponent = () => {
        render(<TermsAndConditions />);
        return {
            heading: screen.getByRole('heading'),
            checkbox: screen.getByRole('checkbox'),
            button: screen.getByRole('button')
        }
    }
    it('should render TermsAndConditions with correct text and initial state', () => {
        const {heading, checkbox, button} = renderComponent();
        // const heading = screen.getByRole('heading');
        // expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Terms & Conditions');

        // const checkbox = screen.getByRole('checkbox');
        // expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        // const button = screen.getByRole('button');
        // expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('should enable checkbox when submit button is clicked', async () => {
        const { checkbox, button } = renderComponent();
        render(<TermsAndConditions />);
        
        // const checkbox = screen.getByRole('checkbox');
        //fireEvent.click(checkbox);
        // userEvent.click(checkbox)
        const user = userEvent.setup();
        await user.click(checkbox);
        expect(button).toBeEnabled();
    })
})