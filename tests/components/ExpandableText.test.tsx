import { fireEvent, render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';


describe('ExpandableText', () => {
    const fullText = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis veniam dolore quia architecto corrupti voluptas ad totam. Porro repellat quis, rerum voluptas rem animi deserunt, distinctio, consequuntur voluptatibus exercitationem possimus! Odio et facilis repudiandae nobis, veritatis itaque non. Non, excepturi voluptatum! Cum hic, ea quibusdam minima ut sed alias. Dolore sequi cumque fugit non tenetur, voluptas ipsam numquam ducimus asperiores ut nisi, incidunt corrupti, quam odit earum placeat amet quaerat sint at voluptatem commodi quos nam ex quibusdam? Eligendi voluptate eum architecto totam doloremque, est autem inventore repudiandae consequatur adipisci similique debitis animi voluptates natus accusamus iste tempore, sit ratione.';
    const truncatedText = fullText.substring(0, 255) + '...';
    it('should render the full text if less than 255 chars', () => {
        const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, totam!'

        render(<ExpandableText text={text} />)

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it('should render truncated text when characters is greater than 255 chars', async () => {
        
        render(<ExpandableText text={fullText} />)
        
        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent(/more/i);
    });
    it('should expand text when Show More button is clicked', () => {
        render(<ExpandableText text={fullText} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText(fullText)).toBeInTheDocument();
        expect(button).toHaveTextContent(/less/i);
    });
    it('should collapse text when Show Less button is clicked', () => {
        render(<ExpandableText text={fullText} />);
        const showMoreButton = screen.getByRole('button', { name: /more/i });
        fireEvent.click(showMoreButton);
        const showLessButton = screen.getByRole('button', { name: /less/i });
        fireEvent.click(showLessButton);
        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(showMoreButton).toHaveTextContent(/more/i);
    })
})