import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor/";
import { TASK_CREATE_STRING_ATTACHMENT } from "@badeball/cypress-cucumber-preprocessor/lib/constants";
import {config} from '@config/config';

const BASE_URL = Cypress.env('base_url') as string;
const apitoken = Cypress.env('token') as string;
const CREATE_SPACE_URL = config.url.space.create_space
const INV_CREATE_SPACE_URL = config.url.space.invalid_create_space

Given('Team id exists', () => {
    cy.log('Team id exists - Run N111');
});

When('User send POST to create space for specific team id', () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const requestBodyName = `Space name ${randomString}`;
    cy.wrap(requestBodyName).as('spaceName');

    cy.request({
        method: 'POST',
        url: `${BASE_URL}/${CREATE_SPACE_URL}`,
        headers: {
            Authorization: `${apitoken}`,
            Accept: 'application/json'
        },
        body: {name: `${requestBodyName}`}
        }).then((resp) => {
            cy.wait(2000)
            cy.wrap(resp.body.id).as('spaceId');
            cy.wrap(resp.status).as('statusCode');
        }); 
});

Then('User send GET the space by id, check name and delete it', () => {
    cy.get('@spaceId').then((id) => {
        cy.sentRequest('get', `${BASE_URL}/space/${id}`);
        cy.get<Cypress.Response<Body>>('@obtainedResponse').then((resp: Cypress.Response<Body>) => {
            cy.get('@spaceName').then((expectedName) => {
                expect(String(resp.name)).to.eql(String(expectedName));
            });
        cy.sentRequest('delete', `${BASE_URL}/space/${id}`);
        cy.checkStatusCode(200);
        });
    });
});

When('User send POST to create space with the same name', (filename:string) => {
    cy.fixture('spaces/create_space').then((body) =>{
        cy.get('@spaceName').then((sameName) => {
            body.name = `${sameName}`;
            cy.sentRequest('post', `${BASE_URL}/${CREATE_SPACE_URL}`, body);
            cy.get('@error').then((errorText) => {
                expect(String(errorText)).to.eql(String("Space with this name already exists"));
            });
        });
    });
});

When('User send POST trying to create space without "name"', (body) => {
    body = {};
    cy.sentRequest('post', `${BASE_URL}/${CREATE_SPACE_URL}`, body);
        cy.get('@error').then((errorText) => {
            expect(String(errorText)).to.eql(String("Space name invalid"));
    });
});

When('User send POST trying to create space for not valid team id', () => {
    cy.sentRequest('post', `${BASE_URL}/${INV_CREATE_SPACE_URL}`);
        cy.get('@statusText').then((expectedText) => {
            expect(String(expectedText)).to.eql(String("Bad request"));
    });
});

/*
When('User send POST trying to create space with invalid json', (filename:string) => {
    cy.fixture('spaces/create_invalid').then((body) =>{
        cy.sentRequest('post', `${BASE_URL}/${CREATE_SPACE_URL}`, body);
        cy.get('@error').then((errorText) => {
            expect(String(errorText)).to.contain(String("Unexpected token } in JSON"));
        });
    });
});

When('User send POST trying to create space with invalid json', () => {
    const invalidJsonBody = '{"name": "New Space Name",}';

    cy.request({
        method: 'POST',
        url: `${BASE_URL}/${CREATE_SPACE_URL}`,
        headers: {
            Authorization: `${apitoken}`,
            Accept: 'application/json'
        },
        body: {"name": "New Space Name",},
    }).then((resp) => {
        cy.wrap(resp.status).as('statusCode');
        expect(String(resp.body.err)).to.contain(String("Unexpected token } in JSON"));
      });
    //body = '{"name": "New Space Name,';
    cy.sentRequest('post', `${BASE_URL}/${CREATE_SPACE_URL}`, '"name": "New Space Name"}');
        cy.get('@error').then((errorText) => {
            expect(String(errorText)).to.contain(String("Unexpected token } in JSON"));
    });
});
*/