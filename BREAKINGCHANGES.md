# Breaking Changes

## Version 0.5.0

The Zenaton NodeJS library has been going through a major overhaul in version 0.5.0. Particularly, we've made sure that it is now asynchronous from top to bottom, which will make for better performances and reliability all around.

In order to use this new version, you must:

- `zenaton unlisten` tentatively while you upgrade your workers.

- [Upgrade your Zenaton agent to the last version](https://zenaton.com/documentation?lang=node#getting-started-installation) which was shipped at the same time. Upgrading the agent can be done with no consequences for your currently running workflows.

- Update your Zenaton NodeJS SDK to version 0.5.0.

- Version all your workflows by following the instructions in the [workflows versioning documentation](https://zenaton.com/documentation?lang=node#workflow-versioning-for-new-instances).

- Write the new version of your workflows which must follow the new rules listed below.

- And finally `zenaton listen` with your usual parameters.

As an example, imagine you have the following `FoobarWorkflow` and `SimpleTask` like below:

```javascript
// FoobarWorkflow.js
const { Workflow } = require("zenaton");
const SimpleTask = require("./SimpleTask");

module.exports = Workflow("FoobarWorkflow", function() {
  new SimpleTask().dispatch();
});

// SimpleTask.js
const { Task } = require("zenaton");

module.exports = Task("SimpleTask", function(done) {
  done(null, "result");
});
```

The final result post-rewrite would look like this:

```javascript
// FoobarWorkflow.js
const { Version } = require("zenaton");
const FoobarWorkflow_v0 = require("./FoobarWorkflow_v0");
const FoobarWorkflow_v1 = require("./FoobarWorkflow_v1");

module.exports = Version("FoobarWorkflow", [
  FoobarWorkflow_v0,
  FoobarWorkflow_v1,
]);

// FoobarWorkflow_v0.js
const { Workflow } = require("zenaton");
const SimpleTask = require("./SimpleTask");

module.exports = Workflow("FoobarWorkflow_v0", function() {
  new SimpleTask().dispatch();
});

// FoobarWorkflow_v1.js
const { Workflow } = require("zenaton");
const SimpleTask = require("./SimpleTask");

module.exports = Workflow("FoobarWorkflow_v1", async function() {
  await new SimpleTask().dispatch();
  // Or `return new SimpleTask().dispatch();` if no access to async/await
});

// SimpleTask.js
const { Task } = require("zenaton");

module.exports = Task("SimpleTask", async function() {
  return "result";
  // Or `return Promise.resolve("result");` if no access to async/await
});
```

### Asynchronous workflows

Workflows `handle` method must now be asynchronous, which means it must be decorated with the `async` keyword. Inside the method, all tasks and waits execution/dispatching must be prefixed with the `await` keyword.

```javascript
const { Workflow } = require("zenaton");

module.exports = Workflow(
  "MyWorkflow",
  /* HERE */ async function() {
    const result = /* HERE */ await new TaskA().execute();

    /* HERE */ await new Wait().seconds(5).execute();

    const [a, b] = /* HERE */ await new Parallel(
      new TaskA(),
      new TaskB(),
    ).execute();

    /*! DO NOT TRY/CATCH INSIDE THE WORKFLOW HANDLE METHOD !*/
  },
);
```

If you're using a version of NodeJS prior to 7.10, and don't have access to the `async/await` syntactic sugar, you can write old style Promises instead:

```javascript
const { Workflow } = require("zenaton");

module.exports = Workflow("MyWorkflow", function() {
  return new TaskA().execute()
    .then((result) => {
      return new Wait().seconds(5).execute();
    })
    .then(() => {
      return new Parallel(new TaskA(), new TaskB()).execute();
    })
    .then(([a, b]) => {
      // ...
    });

  /*! DO NOT CATCH INSIDE THE WORKFLOW HANDLE METHOD !*/
});
```

### Asynchronous tasks + 'done' callback

Tasks `handle` method should now be asynchronous. Besides, usage of the `done` callback to mark tasks termination has been deprecated. You'll get warning messages in your `zenaton.err` file if you keep using it.

> :warning: **If you are migrating currently running workflows you need to keep using 'done' in the tasks they run.**
>
> You have two possibilities:
>
> - Keep using the `done` callback until all of your old workflows have come to completion. At this point, you can rewrite your tasks to have them return a promise. In the meantime you will get a deprecation warning every time a new asynchronous wokflow runs a task.
>
> - Version your tasks as well and have the new workflows call them instead of the old ones. Create new ones that do the exact same thing than the old ones but return a promise. There is no versioning system for tasks in Zenaton, so you'll have to give them a different name, otherwise you'll get '_"YourTaskName" task can not be defined twice_' errors.
>
> We recommend the first solution if your currently running workflows won't last more than a couple of weeks.

The easiest way to fix both those requirements is to mark the `handle` method with the `async` keyword.

```javascript
const { Task } = require("zenaton");

module.exports = Task(
  "SimpleTask",
  /* HERE */ async function() {
    return "Your task result";
  },
);
```

If you're using a version of NodeJS prior to 7.10, and don't have access to the `async/await` syntactic sugar, you can write old style Promises instead:

```javascript
const { Task } = require("zenaton");

module.exports = Task("SimpleTask", function() {
  // Don't forget to return the promise chain
  return MyAsyncCall().then(() => {
    return "Your task result";
  });
});
```

**Even if your task is synchronous, returning a promise is mandatory.** Marking the `handle` method with the `async` keyword will do the trick, or you can simply use `Promise.resolve()`:

```javascript
// BEFORE (will get deprecation warnings)
module.exports = Task("SimpleTask", function(done) {
  done(null, "Your task result");
});

/***************************************/

// AFTER
module.exports = Task("SimpleTask", function() {
  return Promise.resolve("Your task result");
});
```

### Parallel

Usage of the `execute()` and `dispatch()` methods on the native `Array` prototype have been deprecated. You'll get warning messages in your `zenaton.err` file if you keep using them. Use the `Parallel` class instead.

```javascript
// BEFORE (will get deprecation warnings)
const [a, b] = await [new TaskA(), new TaskB()].execute();

/***************************************/

// AFTER
const { Parallel } = require("zenaton");

const [a, b] = await new Parallel(new TaskA(), new TaskB()).execute();
```
