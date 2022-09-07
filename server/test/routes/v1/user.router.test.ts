'use strict';

import { test } from 'tap';
import request from 'request';
import { registerServT } from '../../helper';
import { AppConfig } from '../../../src/config/app.config';

test('create -> auth -> delete user tests', (t) => {
    t.plan(7);
    AppConfig.init();
    const server = registerServT(t);
    t.teardown(() => server.close());

    const testEmail = 'email@me22.com';
    const testPass = '123';

    server.listen({ port: 3000 }, (err) => {
        t.error(err);
        request(
            {
                method: 'POST',
                url: 'http://localhost:' + AppConfig.config.PORT + '/v1/users/register',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    email: testEmail,
                    login: 'l1',
                    password: testPass,
                    first_name: 'fn',
                    last_name: 'fl',
                    role_id: 1,
                }),
            },
            (err, response, body) => {
                t.error(err);
                t.equal(response.statusCode, 201);

                const { id } = JSON.parse(body);

                request(
                    {
                        method: 'POST',
                        url: 'http://localhost:' + AppConfig.config.PORT + '/v1/auth',
                        headers: {
                            'content-type': 'application/json; charset=utf-8',
                        },
                        body: JSON.stringify({
                            email: testEmail,
                            password: testPass,
                        }),
                    },
                    (err, response, body) => {
                        t.error(err);
                        t.equal(response.statusCode, 200);

                        request(
                            {
                                method: 'DELETE',
                                url: 'http://localhost:' + AppConfig.config.PORT + '/v1/users/' + id,
                            },
                            (err, response, body) => {
                                t.error(err);
                                t.equal(response.statusCode, 200);
                            }
                        );
                    }
                );
            }
        );
    });
});
