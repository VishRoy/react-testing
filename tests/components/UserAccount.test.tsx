import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('UserAccount', () => {
    it('should render user name', () => {
        const user: User = { id: 1, name: 'John Doe', isAdmin: false }
        render(<UserAccount user={user} />);
        expect(screen.getByText(user.name)).toBeInTheDocument();
    });
    it('should render edit button for admin user', () => {
        const user: User = {id: 2, name:'John Doe', isAdmin: true}
        render(<UserAccount user={user} />);
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
    it('should not render edit button for non-admin user', () => {
        render(<UserAccount user={{id: 2, name:'John Doe', isAdmin: false}} />);
        expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });
})