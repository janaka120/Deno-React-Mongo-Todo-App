import { Router } from "https://deno.land/x/oak/mod.ts";
import {
    ObjectId,
    Bson
  } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getCollection } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
    id?: string;
    text: string;
}

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
    const  todos = await getCollection().find().toArray(); // {_id: ObjectId(), text: string}
    const transformedTodos = todos.map((todo: {_id: ObjectId, text: string}) => {
        return { id: todo._id.toString(), text: todo.text }
    });
    console.log("transformedTodos >>", transformedTodos);
    ctx.response.body = {todos: transformedTodos};
});
router.post('/todos', async (ctx) => {
    const body = await ctx.request.body();
    const values = await body.value;
    const newTodo: Todo = {
        text:  values.text
    }
    const  id = await getCollection().insertOne(newTodo);
    newTodo.id = id.$oid;

    return ctx.response.body = {message: "Created todo!", todo: newTodo};
});
router.put('/todos/:todoId', async (ctx) => {
    try{
        const todoId = ctx.params.todoId!;
        const body = await ctx.request.body();
        const values = await body.value;

        await getCollection().updateOne({ _id: new Bson.ObjectId(todoId) }, {
            $set: {
                text: values.text,
            }
        }, { ignoreUndefined: true });

        ctx.response.body = {message: "Updated todo!"};
    }catch(e) {
        console.log("todo put error >>>>", e);
    };
});
router.delete('/todos/:todoId', async (ctx) => {
    const todoId = ctx.params.todoId!;
    await getCollection().deleteOne({ _id: new Bson.ObjectId(todoId) });

    ctx.response.body = {message: "Deleted todo!"};
});

export default router;