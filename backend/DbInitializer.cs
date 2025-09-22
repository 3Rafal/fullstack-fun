public static class DbInitializer
{
    public static void Seed(IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TodoDb>();

        if (!db.Todos.Any())
        {
            db.Todos.AddRange(
                new Todo { Name = "Learn .NET", IsComplete = false },
                new Todo { Name = "Build an API", IsComplete = true }
            );
            db.SaveChanges();
        }
    }
}