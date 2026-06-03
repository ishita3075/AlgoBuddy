const ivm = require("isolated-vm");
const { EXECUTION_STATUS } = require("./errorCodes");
const { MAX_TIMEOUT_MS, MAX_MEMORY_MB, MAX_OUTPUT_LENGTH } = require("./sandbox.config");

async function executeCode(code) {
  const startTime = Date.now();
  const outputLines = [];

  let isolate;
  try {
    // Create a new Isolate with the strict memory limit
    isolate = new ivm.Isolate({ memoryLimit: MAX_MEMORY_MB });
    
    // Create a new execution context
    const context = isolate.createContextSync();
    const jail = context.global;

    jail.setSync("global", jail.derefInto());

    const logCallback = function (...args) {
      outputLines.push(args.join(" "));
    };
    jail.setSync("_hostLog", new ivm.Reference(logCallback));

    isolate.compileScriptSync(`
      function safeStringify(obj) {
        if (typeof obj === 'string') return obj;
        try { return JSON.stringify(obj); } catch (e) { return String(obj); }
      }
      global.console = {
        log: function(...args) {
          _hostLog.applySync(undefined, args.map(safeStringify));
        },
        error: function(...args) {
          _hostLog.applySync(undefined, args.map(a => "[error] " + safeStringify(a)));
        },
        warn: function(...args) {
          _hostLog.applySync(undefined, args.map(a => "[warn] " + safeStringify(a)));
        },
        info: function(...args) {
          _hostLog.applySync(undefined, args.map(a => "[info] " + safeStringify(a)));
        }
      };
    `).runSync(context);

    // Compile and run the user script safely
    const script = isolate.compileScriptSync(code, { filename: "user-code.js" });
    
    // Pass execution timeout to prevent infinite loops
    script.runSync(context, { timeout: MAX_TIMEOUT_MS });

    const rawOutput = outputLines.join("\n");
    const output = rawOutput.length > MAX_OUTPUT_LENGTH
      ? rawOutput.slice(0, MAX_OUTPUT_LENGTH) + "\n… (output truncated)"
      : rawOutput;

    // Clean up references
    context.release();

    return {
      status: EXECUTION_STATUS.SUCCESS,
      output,
      executionTime: Date.now() - startTime,
      memoryUsed: 0, // In isolated-vm, memory per script is managed strictly by the isolate bound
    };

  } catch (err) {
    const elapsed = Date.now() - startTime;
    
    // Handle Time Limit Exceeded
    if (err.message && err.message.includes("timed out")) {
      return {
        status: EXECUTION_STATUS.TLE,
        output: outputLines.join("\n"),
        error: `Your code exceeded the ${MAX_TIMEOUT_MS}ms time limit.`,
        executionTime: elapsed,
        memoryUsed: 0,
      };
    }

    // Handle Memory Limit Exceeded
    if (err.message && (err.message.includes("memory limit") || err.message.includes("allocation"))) {
      return {
        status: EXECUTION_STATUS.MLE,
        output: outputLines.join("\n"),
        error: `Your code used too much memory (exceeded ${MAX_MEMORY_MB} MB).`,
        executionTime: elapsed,
        memoryUsed: MAX_MEMORY_MB * 1024 * 1024,
      };
    }

    // Handle generic syntax/runtime errors inside user code
    return {
      status: EXECUTION_STATUS.RUNTIME_ERROR,
      output: outputLines.join("\n"),
      error: err.message ?? String(err),
      executionTime: elapsed,
      memoryUsed: 0,
    };
  } finally {
    // Ensure the isolate is destroyed so memory is freed
    if (isolate) {
      isolate.dispose();
    }
  }
}

module.exports = { executeCode };