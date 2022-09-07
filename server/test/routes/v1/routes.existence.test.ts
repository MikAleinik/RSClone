'use strict';

import { test } from 'tap';
import { registerServ } from '../../helper';

test('requests the "/users" route exists', async (t) => {
    const app = await registerServ(t);

    const response = await app.inject({
        method: 'GET',
        url: 'v1/users',
    });
    t.equal(response.statusCode, 200, 'checked');
});

test('requests the "/cargotocar" route exists', async (t) => {
    const app = await registerServ(t);

    const response = await app.inject({
        method: 'GET',
        url: 'v1/cargotocar',
    });
    t.equal(response.statusCode, 200, 'checked');
});

test('requests the "/cars" route exists', async (t) => {
    const app = await registerServ(t);

    const response = await app.inject({
        method: 'GET',
        url: 'v1/cars',
    });
    t.equal(response.statusCode, 200, 'checked');
});

test('requests the "/unauth" route exists', async (t) => {
    const app = await registerServ(t);

    const response = await app.inject({
        method: 'GET',
        url: 'v1/unauth',
    });
    t.equal(response.statusCode, 200, 'checked');
});

test('requests the "/cargo" route exists', async (t) => {
    const app = await registerServ(t);

    const response = await app.inject({
        method: 'GET',
        url: 'v1/cargo',
    });
    t.equal(response.statusCode, 200, 'checked');
});
