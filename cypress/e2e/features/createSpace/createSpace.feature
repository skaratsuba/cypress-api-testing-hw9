@api
Feature: Create space

  Scenario: Create space for specific team id
    Given Team id exists
    When User send POST to create space for specific team id
    Then Status code is equal 200
    And User send GET the space by id, check name and delete it

  Scenario: Create space with the same name for specific team id
    Given Team id exists
    When User send POST to create space for specific team id
    And User send POST to create space with the same name
    Then Status code is equal 400
    And User send GET the space by id, check name and delete it

  Scenario: Create space for specific team id without the required field "name"
    Given Team id exists
    When User send POST trying to create space without "name"
    Then Status code is equal 400

  Scenario: Create list of spaces for not valid team id
    When User send POST trying to create space for not valid team id
    Then Status code is equal 400

#  Scenario: Create space for specific team id with invalid json
#    When User send POST trying to create space with invalid json
#    Then Status code is equal 400