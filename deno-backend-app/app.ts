// const message = "Hello world";

// const encorder = new TextEncoder();
// const data = encorder.encode(message);

// Deno.writeFile('message.txt', data).then(result => {
//     console.log('Wrote to file!');
// });




import { Application, Context } from "https://deno.land/x/oak/mod.ts";
import tododRoutes from "./routes/todo.ts";

import {connect} from './helpers/db_client.ts';

connect();

const app = new Application();

// if you use async middleware below as `tododRoutes`, you have to register all middleware as `async`
app.use( async(ctx, next) => {
    console.log('Middleware');
    await next();
});

app.use(async(ctx, next) => {
    ctx.response.headers.set("X-Frame-Options", "ALLOWALL");
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
    ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // headers allow for request
    await next();
});

app.use(tododRoutes.routes());
app.use(tododRoutes.allowedMethods());

await app.listen({ port: 8000 });