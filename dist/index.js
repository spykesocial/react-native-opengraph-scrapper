import openGraphScraperLite from "./openGraphScraperLite.js";
const buildErrorResult = (options, exception) => ({
  success: false,
  requestUrl: options.url,
  error: exception instanceof Error ? exception.message : String(exception),
  errorDetails: exception instanceof Error ? exception : new Error(String(exception))
});
async function run(options, callback) {
  const hasCallback = typeof callback === "function";
  if (hasCallback) {
    try {
      const results = await openGraphScraperLite(options);
      callback(false, results.ogObject, results.response);
      return void 0;
    } catch (exception) {
      callback(true, buildErrorResult(options, exception));
      return void 0;
    }
  }
  try {
    const results = await openGraphScraperLite(options);
    return {
      error: false,
      result: results.ogObject,
      response: results.response
    };
  } catch (exception) {
    const returnError = {
      error: true,
      result: buildErrorResult(options, exception)
    };
    return Promise.reject(returnError);
  }
}
var index_default = run;
export {
  index_default as default,
  run
};
//# sourceMappingURL=index.js.map