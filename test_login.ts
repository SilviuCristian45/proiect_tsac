import http from 'k6/http';
import { check, sleep } from 'k6';

const loginUrl = "https://fakestoreapi.com/auth/login"

const vusMilestones = [5, 20, 50, 100]
let scenarios = {}

for (const vus of vusMilestones) {
  const scenarioName = `test_login_with_vus_${vus}`;

  // Adaugă un scenariu pentru fiecare număr de VUs
  scenarios[scenarioName] = {
    executor: 'constant-vus',
    exec: 'testLogin',
    vus: vus,
    duration: '10s',
  };
}

export let options = {
  scenarios: scenarios,
};

export function testLogin() {
    const url = loginUrl;
    const payload = JSON.stringify({
      username: 'johnd',
      password: 'm38rmF$',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let res = http.post(url, payload, params);
    check(res, {
      'login status is 200': (r) => r.status === 200,
      'login duration < 500ms': (r) => r.timings.duration < 500,
    });
  }