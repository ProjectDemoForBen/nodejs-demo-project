import {Router} from "https://deno.land/x/oak/mod.ts";

interface Todo {
    id: string;
    text: string
}
type RequestBody = {text: string};
type RequestParams = {todoId: string};

const todos: Todo[] = []

const router = new Router();

router.get('/todos', ctx => {
    ctx.response.status = 200;

    // oak will assume that this should be a JSON
    ctx.response.body = {
        todos: todos,
    }

})

router.post('/todos', async ctx => {
    const body = await ctx.request.body().value as RequestBody;

    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text
    }
    todos.push(newTodo);

    ctx.response.status = 201;
    ctx.response.body = {
        message: 'Todo inserted',
        data: newTodo
    };
})

router.put('/todos/:todoId', async ctx => {
    const params = ctx.params as RequestParams;
    const todoId = params.todoId;

    const body = await ctx.request.body().value as RequestBody

    const index = todos.findIndex(td => td.id === todoId);
    if (index >= 0) {
        todos[index] = {id: todoId, text: body.text}

        ctx.response.status = 200;
        ctx.response.body = {
            message: 'Todo updated',
            data: todos[index]
        };
        return;
    }

    ctx.response.status = 404;
    ctx.response.body = {
        message: 'No todo found'
    };
})

router.delete('/todos/:todoId', ctx => {
    const params = ctx.params as RequestParams;
    const todoId = params.todoId;

    const index = todos.findIndex(td => td.id === todoId);

    if (index >= 0) {
        todos.splice(index, 1);

        ctx.response.status = 200;
        ctx.response.body = {
            message: 'Todo deleted',
            data: true,
        };
        return;
    }

    ctx.response.status = 404;
    ctx.response.body = {
        message: 'No todo found',
        data: false
    };
})

export default router;
