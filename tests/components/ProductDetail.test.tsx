import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';
import {http, HttpResponse, delay} from 'msw';
import { db } from '../mocks/db';

describe('ProductDetail', () => {
    let productId: number;
    beforeAll(() => {
        const product = db.product.create();
        productId = product.id;
    })
    afterAll(() => {
        db.product.delete({where: {id: {equals: productId}}});
    });
    it('should render product details', async () => {
        const product = db.product.findFirst({where : {id: {equals: productId}}});
        render(<ProductDetail productId={productId} />);
        const productName = await screen.findByText(new RegExp(product!.name));
        expect(productName).toBeInTheDocument();
    });
    it('should render The given product was not found. if no product is found', async () => {
        server.use(http.get('/products/1', () => HttpResponse.json(null, {status: 404})));
        render(<ProductDetail productId={1} />);
        const message = await screen.findByText(/not found./i);
        expect(message).toBeInTheDocument();
    });
    it('should render an error for invalid productId', async () => {
        render(<ProductDetail productId={0} />);
        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
    it('should render an error if data fetching fails', async () => {
        server.use(http.get('/products/1', () => HttpResponse.error()));
        render(<ProductDetail productId={1} />);
        const message = await screen.findByText(/error/i);
        expect(message).toBeInTheDocument();
    });
    it('should render loading when fetching data', () => {
        server.use(http.get('/product/1', async() => {
            await delay();
            return HttpResponse.json([]);
        }));
        render(<ProductDetail productId={1} />);
        const message = screen.getByText(/loading/i);
        expect(message).toBeInTheDocument();
    });
    it('should remove the loading indicator after data is fetched', async () => {
        render(<ProductDetail productId={1} />);

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    });
    it('should remove the loading indicator if data fetching fails', async () => {
        server.use(http.get('/products', () => HttpResponse.error()));
        render(<ProductDetail productId={1}/>);
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    })
})