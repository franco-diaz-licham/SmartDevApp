using Microsoft.Azure.Cosmos;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

internal static class CosmosNoteQueries
{
    public static QueryDefinition SlugIds(NoteSlug slug)
    {
        return new QueryDefinition("""
            SELECT VALUE c.id
            FROM c
            WHERE c.type = @type
              AND c.slug = @slug
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@slug", slug.Value);
    }

    public static QueryDefinition PublishedPublic(BaseQuery? query = null)
    {
        return BuildNotesQuery(
            query,
            [
                "c.type = @type",
                "c.status = @status",
                "c.visibility = @visibility"
            ],
            "c.publishedAt DESC")
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
            ORDER BY c.category.displayName
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@status", NoteStatus.Published.ToString())
            .WithParameter("@visibility", NoteVisibility.Public.ToString());
    }

    public static QueryDefinition OwnerCategoryNames()
    {
        return new QueryDefinition("""
            SELECT DISTINCT VALUE c.category.displayName
            FROM c
            WHERE c.type = @type
            ORDER BY c.category.displayName
            """)
            .WithParameter("@type", NoteDocument.DocumentType);
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
            ORDER BY tag.displayName
            """)
            .WithParameter("@type", NoteDocument.DocumentType)
            .WithParameter("@status", NoteStatus.Published.ToString())
            .WithParameter("@visibility", NoteVisibility.Public.ToString());
    }

    public static QueryDefinition AllForOwner(BaseQuery? query = null)
    {
        return BuildNotesQuery(query, ["c.type = @type"], "c.updatedAt DESC")
            .WithParameter("@type", NoteDocument.DocumentType);
    }

    private static QueryDefinition BuildNotesQuery(BaseQuery? query, IReadOnlyCollection<string> baseConditions, string orderBy)
    {
        var conditions = baseConditions.ToList();
        if (!string.IsNullOrWhiteSpace(query?.SearchTerm)) {
            conditions.Add("""
                (
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
                """);
        }

        var categoryFilter = query?.Filters.FirstOrDefault(filter =>
            string.Equals(filter.Field, "category", StringComparison.OrdinalIgnoreCase)
            && filter.Operator == FilterOperator.Equals
            && !string.IsNullOrWhiteSpace(filter.Value));

        if (categoryFilter is not null) conditions.Add("LOWER(c.category.displayName) = @category");

        var queryDefinition = new QueryDefinition($"""
            SELECT * FROM c
            WHERE {string.Join($"{Environment.NewLine} AND ", conditions)}
            ORDER BY {orderBy}
            """);

        if (!string.IsNullOrWhiteSpace(query?.SearchTerm)) queryDefinition = queryDefinition.WithParameter("@searchTerm", query.SearchTerm.Trim().ToLowerInvariant());
        if (categoryFilter is not null) queryDefinition = queryDefinition.WithParameter("@category", categoryFilter.Value.Trim().ToLowerInvariant());
        return queryDefinition;
    }
}
