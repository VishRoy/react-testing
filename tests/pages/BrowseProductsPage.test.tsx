import { Theme } from '@radix-ui/themes';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { CartProvider } from '../../src/providers/CartProvider';
import { db } from '../mocks/db';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
    const categories: Category[] = [];
    const products: Product[] = [];
    beforeAll(() => {
        [1, 2].forEach((item) => {
          const category = db.category.create({ name: 'Category ' + item });
          categories.push(category);
          [1, 2].forEach(() => {
            products.push(
              db.product.create({ categoryId: category.id })
            );
          });
        });
    });

    afterAll(() => {
        const categoryIds = categories.map(category => category.id);
        db.category.deleteMany({where : {id: {in: categoryIds}}});

        const productsIds = products.map(product => product.id);
        db.product.deleteMany({where : {id: {in: productsIds}}});
    })
    const renderComponent = () => {
        render(
            <Theme>
                <CartProvider>
                    <BrowseProducts />
                </CartProvider>
            </Theme>
        );
        return {
            getProductSkeletion : () => screen.getByRole('progressbar', {name: /products/i}),
            getCategoriesSkeleton: () => screen.getByRole('progressbar', {name: /categories/i})
        }
    }
    it('should render loading skeleton when fetching categories', () => {
        simulateDelay('/categories');
        const {getCategoriesSkeleton} = renderComponent()
        expect(getCategoriesSkeleton()).toBeInTheDocument();
    });
    it('should hide the loading skeleton after categories are fetched', async () => {
        const {getCategoriesSkeleton} = renderComponent()
        await waitForElementToBeRemoved(getCategoriesSkeleton)
    })
    it('should render loading skeleton when fetching products', () => {
        simulateDelay('/products');
        const {getProductSkeletion} = renderComponent()
        expect(getProductSkeletion()).toBeInTheDocument();
    });
    it('should hide the loading skeleton after products are fetched', async () => {
        const { getProductSkeletion} = renderComponent()
        await waitForElementToBeRemoved(getProductSkeletion)
    });
    it('should render error message when fetching categories fails', async () => {
        simulateError('/categories');
        const { getCategoriesSkeleton } = renderComponent()
        await waitForElementToBeRemoved(getCategoriesSkeleton)
        expect(screen.queryByRole('combobox', {name: /category/i})).not.toBeInTheDocument();
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
    it('should render error message when fetching products fails', async () => {
        simulateError('/products');
        renderComponent()
        const errorMessage = await screen.findByText(/error/i);
        expect(errorMessage).toBeInTheDocument();
    });
    it('should render categories dropdown filter', async() => {
        renderComponent();
        const combobox = await screen.findByRole('combobox');
        expect(combobox).toBeInTheDocument();

        const user = userEvent.setup()
        await user.click(combobox);
        // const options = await screen.findAllByRole('option');
        // expect(options.length).toBeGreaterThan(0);
        expect(screen.getByRole('option', {name: /all/i})).toBeInTheDocument();
        categories.forEach(category => {
            expect(screen.getByRole('option', {name: category.name})).toBeInTheDocument();
        })
    });
    it('should render products',async () => {
        const {getProductSkeletion} = renderComponent();
        await waitForElementToBeRemoved(getProductSkeletion)
        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(product.price)).toBeInTheDocument();
        })
    });
})