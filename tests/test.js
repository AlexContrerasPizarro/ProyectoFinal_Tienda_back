const request = require('supertest');
const app = require('../routes/productRoutes'); 
const app = require('../routes/userRoutes'); 
const app = require('../routes/orderRoutes'); 

describe('POST /create', () => {
  it('creando productos', async () => {
    const newProduct = {
      name: 'GameTest',
      img: 'test-image-url',
      desc: 'GameTest description',
      price: 9.99,
      count: 10
    };

    const response = await request(app)
      .post('/create')
      .send(newProduct)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body.status).toBe('Success');
    expect(response.body.product.name).toBe('GameTest');
    expect(response.body.product.price).toBe(9.99);
  });
});


describe('Producto delete/:id', () => {
  it('eliminando producto', async () => {
    const product = { name: 'TestProducto', price: 10 };
    const createRes = await request(app)
      .post('/create')
      .send(product);
    const deleteRes = await request(app).delete(`/delete/${createRes.body.data.product.id}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.status).toEqual('Success');
  });
});


describe('POST /register', () => {
    test('registrando usuario', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'test',
                email: 'test@mail.com',
                name: 'Testing',
                password: 'pass',
                role: 'user'
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.data.user).toBeDefined();
    });
});


describe('Creando orden-despacho /create/:id', () => {
  it('creando orden', async () => {
    const res = await request(app)
      .post('/create/1')
      .send({
        products: ['producto1', 'producto2'],
        quantity: [1, 2],
        total: 100,
        name: 'Test',
        address: 'Calle Falsa 123',
        delivered: false
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Success');
    expect(res.body.data.order).toHaveProperty('id');
  });
});


