import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';
import {http, HttpResponse} from 'msw';
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
    })
})