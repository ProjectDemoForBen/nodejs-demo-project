import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRoutes from "./routes/todos.ts";

const app = new Application();

app.use(async (ctx, next) => {
    // Oak automatically sends response after any middleware is executed
    console.log('Middleware');
    // whenever there is a middleware doing async task, all the upper middleware should await for them
    await next();
})

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });