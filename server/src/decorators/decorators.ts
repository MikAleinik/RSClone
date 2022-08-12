import fastifyPlugin from "fastify-plugin";

const COOKIE_NAME = "authToken";

export default fastifyPlugin((fastify: any, options: any, next: any) => {
  fastify.decorate("verifyJWT", function (req: any, rpl: any, done: any) {
    const cookie = req.cookies[COOKIE_NAME];
    const verificationCallback = ({ userId, err }: any) => {
      if (userId) {
        //pass this to the handler function so that it can use it to
        //identify the user and process his data
        req.params.userId = userId;
        return done();
      }
      done(err);
    };
    //verifyToken gives userId in case of successful decoding
    //gives err msg in case of error
    // verifyToken(cookie, verificationCallback);
  });
    
  next();
});
