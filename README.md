Cypress API
if you open api-testing folder 
run in terminal 
'cd CypressApi'
Install latest Node js
and Install all dependencies: 

`npm install`

In CypressApi create file
touch .env
and put inside
'TOKEN={your_current_token}'

In CypressApi/config/config.ts add your team id
'create_space: 'team/{your_team_id}/space'


Run tests via

'npm run cypress:runner'
