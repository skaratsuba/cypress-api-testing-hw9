 Cypress.Commands.add('sentRequest', (type: string, endpoint: string, payload?: JSON) => {
    cy.log(`trying sent request to ${endpoint} with body ${JSON.stringify(payload)}`)
                cy.request({
                    method: type,
                    url: endpoint,
                    failOnStatusCode: false,
                    headers: {
                        Authorization: Cypress.env('token'),
                        Accept: 'application/json',
                    },
                    body: payload,
                }).then((resp: Cypress.Response<Body>) => {
                    cy.wait(2000)


                    
                    cy.log(`${type} Response status: ${resp.status} - ${resp.statusText}`);
                    cy.log(`request body ${JSON.stringify(payload)}`);
                    cy.log(`response body ${JSON.stringify(resp.body)}`);
                    cy.wrap(resp.status).as('statusCode');
                    cy.wrap(resp.body).as('obtainedResponse');
                    cy.wrap(resp.body.err).as('error');
                    cy.wrap(resp.statusText).as('statusText');

                });
            })

Cypress.Commands.add('checkStatusCode', (code: number) => {
    cy.get<string>('@statusCode').then((statusCode: string) => {
                expect(Number(statusCode)).to.be.eq(Number(code));
    });
})
