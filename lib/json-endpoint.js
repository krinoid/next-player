// export default (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.statusCode = 200;
//     res.end(JSON.stringify({ name: 'test!!!111' }));
//   };

function createJsonEndpoint(handler) {
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const handlerResult = await handler(req, res);
      const successResponse = {
        success: true,
        data: handlerResult,
      };
      res.statusCode = 200;
      res.end(JSON.stringify(successResponse));
    } catch (err) {
      const errorResponse = {
        success: false,
        data: null,
        error: 'Ooops! Something went wrong...',
      };
      // handler can thrown an error with a specific response code, e.g. 404 for missing items
      res.statusCode = err.statusCode || 500;
      res.end(JSON.stringify(errorResponse));
      console.error(err)
    }
  };
}

export default createJsonEndpoint;
