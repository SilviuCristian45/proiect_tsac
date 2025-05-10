import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = "https://fakestoreapi.com";
const productsUrl = `${baseUrl}/products`;
const cartUrl = `${baseUrl}/carts`;

const vusMilestones = [5, 20, 50, 100];
let scenarios = {};

for (const vus of vusMilestones) {
  const scenarioName = `test_get_products_with_vus_${vus}`;
  scenarios[scenarioName] = buildScenario('testGetProductById', vus);
  const scenarioNameAddToCart = `test_login_with_vus_${vus}`;
  scenarios[scenarioNameAddToCart] = buildScenario('testLogin', vus);
  const scenarioNameUpdateCart = `test_update_to_cart_with_vus_${vus}`;
  scenarios[scenarioNameUpdateCart] = buildScenario('testUpdateCart', vus);
  const scenarioEmptyCart = `test_empty_cart_with_vus_${vus}`;
  scenarios[scenarioEmptyCart] = buildScenario('testEmptyCart', vus);
}

function buildScenario(execName: string, vus) {
  return {
    executor: 'constant-vus',
    exec: execName,
    vus: vus,
    duration: '10s',
  };
}

export let options = {
  scenarios: scenarios,
};

export function testGetProductById() {
  const productId = Math.floor(Math.random() * 20) + 1;
  const res = http.get(`${productsUrl}/${productId}`);

  const jsonData = res.json();
  check(res, {
    'get product by id status is 200': (r) => r.status === 200,
    'get product by id duration < 500ms': (r) => r.timings.duration < 500,
  });

   // Verifică dacă datele sunt în formatul corect
   check(jsonData, {
    'id is a number': (data) => typeof data.id === 'number',
    'title is a string': (data) => typeof data.title === 'string',
    'price is a number': (data) => typeof data.price === 'number',
    'category is a string': (data) => typeof data.category === 'string',
    'image is a string': (data) => typeof data.image === 'string',
    'rating.rate is a number': (data) => typeof data.rating.rate === 'number',
    'rating.count is a number': (data) => typeof data.rating.count === 'number',
  });

  sleep(1);
}

export function testLogin() {
  const data = { username: "john@gmail.com", password: "m38rmF$" };
  const res = http.post(cartUrl, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'test login is 200': (r) => r.status === 200,
    'test login duration < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}

export function testUpdateCart() {
  const data = { userId: 1, products: [{ id: 2 }] };
  const res = http.put(`${cartUrl}/1`, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'test update cart is 200': (r) => r.status === 200,
    'test update cart duration < 500ms': (r) => r.timings.duration < 500,
  });
}

export function testEmptyCart() {
  const cartId = Math.floor(Math.random() * 7) + 1;
  const res = http.del(`${cartUrl}/${cartId}`);

  check(res, {
    'test empty cart is 200': (r) => r.status === 200,
    'test empty cart duration < 500ms': (r) => r.timings.duration < 500,
  });
}