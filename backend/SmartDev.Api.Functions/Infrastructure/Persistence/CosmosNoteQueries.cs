using Microsoft.Azure.Cosmos;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

internal static class CosmosNoteQueries
{
    public static QueryDefinition BySlug(NoteSlug slug)
    {
        return new QueryDefinition("""
            SELECT * FROM c
            WHERE c.type = @type
              AND c.slug = @slug
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@slug", slug.Value);
    }

    public static QueryDefinition PublishedPublic()
    {
        return new QueryDefinition("""
            SELECT * FROM c
            WHERE c.type = @type
              AND c.status = @status
              AND c.visibility = @visibility
            ORDER BY c.publishedAt DESC
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@status", NoteStatus.Published.ToString())
            .WithParameter("@visibility", NoteVisibility.Public.ToString());
    }

    public static QueryDefinition AllForOwner()
    {
        return new QueryDefinition("""
            SELECT * FROM c
            WHERE c.type = @type
            ORDER BY c.updatedAt DESC
            """)
            .WithParameter("@type", NoteDocument.DocumentType);
    }
}
