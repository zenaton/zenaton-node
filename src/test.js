function timeoutPromise (time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(Date.now());
    }, time)
  })
}

function doSomethingAsync () {
  return timeoutPromise(1000);
}

async function doAsync () {
  var start = Date.now(), time;
  console.log(0);
  time = await doSomethingAsync();
  console.log(time - start);
  time = await doSomethingAsync();
  console.log(time - start);
  time = await doSomethingAsync();
  console.log(time - start);
}

doAsync();
