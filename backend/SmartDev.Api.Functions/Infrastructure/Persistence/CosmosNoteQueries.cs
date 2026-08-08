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

    public static QueryDefinition PublishedPublicSearch(string searchTerm)
    {
        return new QueryDefinition("""
            SELECT * FROM c
            WHERE c.type = @type
              AND c.status = @status
              AND c.visibility = @visibility
              AND (
                CONTAINS(LOWER(c.title), @searchTerm)
                OR CONTAINS(LOWER(c.summary), @searchTerm)
                OR CONTAINS(LOWER(c.bodyMarkdown), @searchTerm)
                OR CONTAINS(LOWER(c.category.displayName), @searchTerm)
                OR EXISTS(
                  SELECT VALUE tag
                  FROM tag IN c.tags
                  WHERE CONTAINS(LOWER(tag.displayName), @searchTerm)
                     OR CONTAINS(LOWER(tag.slug), @searchTerm)
                )
              )
            ORDER BY c.publishedAt DESC
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@status", NoteStatus.Published.ToString())
            .WithParameter("@visibility", NoteVisibility.Public.ToString())
            .WithParameter("@searchTerm", searchTerm.Trim().ToLowerInvariant());
    }

    public static QueryDefinition PublishedPublicCategoryNames()
    {
        return new QueryDefinition("""
            SELECT DISTINCT VALUE c.category.displayName
            FROM c
            WHERE c.type = @type
              AND c.status = @status
              AND c.visibility = @visibility
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@status", NoteStatus.Published.ToString())
            .WithParameter("@visibility", NoteVisibility.Public.ToString());
    }

    public static QueryDefinition PublishedPublicTagNames()
    {
        return new QueryDefinition("""
            SELECT DISTINCT VALUE tag.displayName
            FROM c
            JOIN tag IN c.tags
            WHERE c.type = @type
              AND c.status = @status
              AND c.visibility = @visibility
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
