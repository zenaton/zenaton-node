# What's new

## Version 0.5.0

### License

The Zenaton NodeJS library is now licensed under the MIT license.

### Asynchronous workflows/tasks

The whole Zenaton NodeJS experience has been reevaluated to make it asynchronous. This provides better performances and gets rid of the `"Could not use "nc", falling back to slower node.js method for sync requests."` error.

### Single tasks execution

You can now execute/dispatch tasks directly without wrapping them in a workflow.

```javascript
new TaskA().dispatch();
```

### Promises to mark tasks termination

To better match with modern NodeJS, we now allow to return promises from tasks `handle` method to mark asynchronous termination. The use of the old `done` callback is now deprecated, and is planned for removal in a future version of the library.

### Deprecation of builtins extension

We previously extended the `Array` prototype with our own `execute()` and `dispatch()` methods to simplify parallelization of tasks. We had afterthoughts about it and decided to deprecate it at the benefice of the already available `Parallel` class. It is now planned for removal in a future version of the library.

### New serializer

In the process of managing your workflows, Zenaton serializes various data, like the properties you pass to workflows and tasks instances, or tasks output.

Previously this data was serialized as plain JSON (using `JSON.stringify()` / `JSON.parse()`). Now it uses a new solution which allows to serialize exotic data such as [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objec=ts/TypedArray), as well as recursive and duplicated references.

### Various QOL improvements

- The GitHub repo now displays _changelog_, _what's new_ and _breaking changes_ pages.

- Dependencies are now strictly versioned.

- The library's code now uses AirBnB styling rules and Prettier to enforce them.

- Strategic parts of the library's code are now covered with tests.
