import http from 'k6/http';
import { check, sleep } from 'k6';

const productsUrl = "https://fakestoreapi.com/products"

const vusMilestones = [5, 20, 50, 100]

let scenarios = {};

for (const vus of vusMilestones) {
  const scenarioName = `test_get_products_with_vus_${vus}`;

  // Adaugă un scenariu pentru fiecare număr de VUs
  scenarios[scenarioName] = {
    executor: 'constant-vus',
    exec: 'testGetProducts',
    vus: vus,
    duration: '10s',
  };
}


export let options = {
  scenarios: scenarios,
};
  
  export function testGetProducts() {
    const res = http.get(productsUrl);
    const jsonData = res.json()
    check(res, {
      'get users status is 200': (r) => r.status === 200,
      'get users duration < 500ms': (r) => r.timings.duration < 500,
      'number of users is 10': (r) => jsonData.length === 20,

    });
  }