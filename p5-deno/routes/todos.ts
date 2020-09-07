import {Router} from "https://deno.land/x/oak/mod.ts";
import {getDb} from "../helpers/db_client.ts";
import {ObjectId} from "https://deno.land/x/mongo@v0.11.1/mod.ts";

interface TodoDto {
    id?: string;
    text: string;
}

interface Todo {
    _id: { $oid: string };
    // _id : ObjectId; .... al hacer el equals seria { _id : ObjectId(tid) }
    text: string;
}

type RequestBody = { text: string };
type RequestParams = { todoId: string };

const router = new Router();

router.get('/todos', async ctx => {
    ctx.response.status = 200;

    const todos = await getDb().collection<Todo>('todos').find();
    const dtoTodos = todos.map(
        (todo: { _id: ObjectId; text: string }) => {
            return {id: todo._id.$oid, text: todo.text}
        })
    // oak will assume that this should be a JSON
    ctx.response.body = {
        todos: dtoTodos,
    }

})

router.post('/todos', async ctx => {
    const body = await ctx.request.body().value as RequestBody;

    const newTodo: TodoDto = {
        text: body.text
    }

    const id = await getDb().collection<Todo>('todos').insertOne(newTodo);
    newTodo.id = id.$oid;
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

    const { matchedCount, modifiedCount, upsertedId } = await getDb().collection<Todo>('todos').updateOne({
        _id: { $oid : todoId}
    }, { $set: { text: body.text } });

    if (matchedCount > 0) {

        ctx.response.status = 200;
        ctx.response.body = {
            message: 'Todo updated',
            data: await getDb().collection('todos').findOne({
                _id: { $oid : todoId}
            })
        };
        return;
    }

    ctx.response.status = 404;
    ctx.response.body = {
        message: 'No todo found'
    };
})

router.delete('/todos/:todoId', async ctx => {
    const params = ctx.params as RequestParams;
    const todoId = params.todoId;


    const deleteCount = await getDb().collection('todos').deleteOne({
        _id: { $oid : todoId}
    });

    if (deleteCount > 0) {

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
