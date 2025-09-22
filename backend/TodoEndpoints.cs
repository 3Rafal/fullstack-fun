using Microsoft.EntityFrameworkCore;

public static class TodoEndpoints
{
    public static RouteGroupBuilder MapTodoEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllTodos);
        group.MapGet("/complete", GetCompleteTodos);
        group.MapGet("/{id}", GetTodo);
        group.MapPost("/", CreateTodo);
        group.MapPut("/{id}", UpdateTodo);
        group.MapDelete("/{id}", DeleteTodo);

        return group;
    }

    private static async Task<IResult> GetAllTodos(TodoDb db) =>
        TypedResults.Ok(await db.Todos.ToArrayAsync());

    private static async Task<IResult> GetCompleteTodos(TodoDb db) =>
        TypedResults.Ok(await db.Todos.Where(t => t.IsComplete).ToListAsync());

    private static async Task<IResult> GetTodo(int id, TodoDb db) =>
        await db.Todos.FindAsync(id) is Todo todo
            ? TypedResults.Ok(todo)
            : TypedResults.NotFound();

    private static async Task<IResult> CreateTodo(Todo todo, TodoDb db)
    {
        db.Todos.Add(todo);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/todoitems/{todo.Id}", todo);
    }

    private static async Task<IResult> UpdateTodo(int id, Todo inputTodo, TodoDb db)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null) return TypedResults.NotFound();

        todo.Name = inputTodo.Name;
        todo.IsComplete = inputTodo.IsComplete;
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static async Task<IResult> DeleteTodo(int id, TodoDb db)
    {
        if (await db.Todos.FindAsync(id) is Todo todo)
        {
            db.Todos.Remove(todo);
            await db.SaveChangesAsync();
            return TypedResults.NoContent();
        }

        return TypedResults.NotFound();
    }
}