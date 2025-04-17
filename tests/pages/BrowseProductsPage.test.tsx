import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { server } from '../mocks/server';
import { http, delay, HttpResponse } from 'msw';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { db } from '../mocks/db';
import { Category, Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

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
    }
    it('should render loading skeleton when fetching categories', () => {
        server.use(http.get('/categories', async ()=> {
            await delay();
            return HttpResponse.json([]);
        }))
        renderComponent()
        const loadingSkeleton = screen.getByRole('progressbar', {name: /categories/i});
        expect(loadingSkeleton).toBeInTheDocument();
    });
    it('should hide the loading skeleton after categories are fetched', async () => {
        renderComponent()
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', {name: /categories/i}))
    })
    it('should render loading skeleton when fetching products', () => {
        server.use(http.get('/products', async ()=> {
            await delay();
            return HttpResponse.json([]);
        }))
        renderComponent()
        const loadingSkeleton = screen.getByRole('progressbar', {name: /products/i});
        expect(loadingSkeleton).toBeInTheDocument();
    });
    it('should hide the loading skeleton after products are fetched', async () => {
        renderComponent()
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', {name: /products/i}))
    });
    it('should render error message when fetching categories fails', async () => {
        server.use(http.get('/categories', () => HttpResponse.error()));
        renderComponent()
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', {name: /categories/i}))
        expect(screen.queryByRole('combobox', {name: /category/i})).not.toBeInTheDocument();
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
    it('should render error message when fetching products fails', async () => {
        server.use(http.get('/products', () => HttpResponse.error()));
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
        renderComponent();
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', {name: /products/i}))
        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(product.price)).toBeInTheDocument();
        })
    });
})