const { GraphQLClient } = require("graphql-request");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../Errors");
const { credentials } = require("../../client");

function getError(err) {
  // Validation errors
  if (err.response && err.response.errors && err.response.errors.length > 0) {
    const message = err.response.errors
      .map((graphqlError) => {
        const path = graphqlError.path ? `(${graphqlError.path}) ` : "";
        const errorMessage = graphqlError.message || "Unknown error";
        return `${path}${errorMessage}`;
      })
      .join("\n");
    return new ExternalZenatonError(message);
  }

  // Internal Server Error
  if (err.response && err.response.status >= 500) {
    return new InternalZenatonError(
      `Please contact Zenaton support - ${err.message}`,
    );
  }

  return new ZenatonError(err.message);
}

async function request(endpoint, query, variables) {
  try {
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "app-id": credentials.appId,
        "api-token": credentials.apiToken,
      },
    });

    return graphQLClient.request(query, variables);
  } catch (err) {
    throw getError(err);
  }
}

const mutations = {
  createWorkflowSchedule: `
    mutation ($createWorkflowScheduleInput: CreateWorkflowScheduleInput!) {
      createWorkflowSchedule(input: $createWorkflowScheduleInput) {
        schedule {
          id
          name
          cron
          insertedAt
          updatedAt
          target {
            ... on WorkflowTarget {
              name
              type
              canonicalName
              programmingLanguage
              properties
              codePathVersion
              initialLibraryVersion
            }
          }
        }
      }
    }`,
  createTaskSchedule: `
    mutation ($createTaskScheduleInput: CreateTaskScheduleInput!) {
      createTaskSchedule(input: $createTaskScheduleInput) {
        schedule {
          id
          name
          cron
          insertedAt
          updatedAt
          target {
            ... on TaskTarget {
              name
              type
              programmingLanguage
              properties
              codePathVersion
              initialLibraryVersion
            }
          }
        }
      }
    }`,
};

module.exports.request = request;
module.exports.mutations = mutations;
