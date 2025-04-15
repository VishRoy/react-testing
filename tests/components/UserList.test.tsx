import { render, screen } from '@testing-library/react';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
    it('should render no users when the array is empty', () => {
        render(<UserList users={[]} />);
        const message = screen.getByText(/no users available/i);
        expect(message).toBeInTheDocument();
    });
    it('should render a list of users', () => {
        const users: User[] = [ { id: 1, name: 'John Doe', isAdmin: false }, { id: 2, name: 'Jane Doe', isAdmin: true } ]
        render(<UserList users={users} />);
        users.forEach(user => {
            const link = screen.getByRole('link', { name: user.name });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href' , `/users/${user.id}`)
        })
    })
})