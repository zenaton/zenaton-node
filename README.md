# Zenaton library for Node

This Zenaton library for Node lets you code and launch workflows using Zenaton platform. You can sign up for an account at [https://zenaton.com](https://zenaton.com).

## Requirements

Node 5 and later.

## Installation

Install the package with:

```
npm install zenaton --save
```

## Client Initialisation

You should have a `.env` file with `ZENATON_APP_ID`, `ZENATON_API_TOKEN` and `ZENATON_APP_ENV` parameters. You'll find them [here](https://zenaton.com/app/api).

The package needs to be configured with them:

```
require("dotenv").config();

var app_id = process.env.ZENATON_APP_ID;
var api_token = process.env.ZENATON_API_TOKEN;
var app_env = process.env.ZENATON_APP_ENV;

require("zenaton").Client.init(app_id, api_token, app_env);
```

## Writing Workflows and Tasks

Writing a workflow is as simple as:

```
var { Workflow } = require("zenaton");

module.exports = Workflow("MyWorkflow", function() {
  // workflow implementation
});
```

Note that your workflow implementation should be idempotent.
see [documentation](https://zenaton.com/app/documentation#workflow-basics-implementation).

Writing a task is as simple as:

```
var { Task } = require('zenaton')

module.exports = Task("SimpleTask", function(done) {
  // task implementation ending by done(error, result)
});
```

## Launching a workflow

Once your Zenaton client is initialised, you can start a workflow with

```
new MyWorkflow().dispatch();
```

## Worker Installation

Your workflow's tasks will be executed on your worker servers. Please install a Zenaton worker on it:

```
curl https://install.zenaton.com | sh
```

that you configure with

```
zenaton listen --env=.env --boot=boot.js
```

where `.env` is the env file containing your credentials, and `boot.js` is a file that will be included before each task execution - this file should load all workflow classes.

## Documentation

Please see https://zenaton.com/documentation for complete documentation.
