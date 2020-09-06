import {Router} from 'express';
import {Todo} from '../models/todo';

const todos: Todo[] = [];
type RequestBody = {text: string};
type RequestParams = {todoId: string};

const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        todos: todos,
    })
})

router.post('/todo', (req, res, next) => {
    const body = req.body as RequestBody
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text
    }
    todos.push(newTodo);

    res.status(201).json({
        message: 'Todo inserted',
        data: newTodo
    })
})

router.put('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParams;
    const todoId = params.todoId;

    const body = req.body as RequestBody

    const index = todos.findIndex(td => td.id === todoId);
    if (index >= 0) {
        todos[index] = {id: todoId, text: body.text}

        return res.status(200).json({
            message: 'Todo updated',
            data: todos[index]
        });
    }

    res.status(404).json({
        message: 'No todo found'
    });
})

router.delete('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParams;
    const todoId = params.todoId;

    const index = todos.findIndex(td => td.id === todoId);

    if (index >= 0) {
        todos.splice(index, 1);

        return res.status(200).json({
            message: 'Todo deleted',
            data: true,
        });
    }

    res.status(404).json({
        message: 'No todo found',
        data: false
    });
})

export default router;