using Microsoft.Azure.Cosmos;
using SmartDev.Api.Functions.Common.Application;

namespace SmartDev.Api.Functions.Features.Journal.Infrastructure.Persistence;

internal static class CosmosJournalQueries
{
    private const string DefaultOrderBy = "c.occurredOn DESC, c.createdAt DESC";

    public static QueryDefinition All(BaseQuery query)
    {
        var conditions = new List<string> { "c.type = @type" };

        if (!string.IsNullOrWhiteSpace(query.SearchTerm)) {
            conditions.Add("""
                (
                  CONTAINS(LOWER(c.title), @searchTerm)
                  OR CONTAINS(LOWER(c.bodyMarkdown), @searchTerm)
                  OR CONTAINS(LOWER(c.entryType), @searchTerm)
                  OR CONTAINS(LOWER(c.status), @searchTerm)
                  OR CONTAINS(LOWER(c.company.name), @searchTerm)
                  OR CONTAINS(LOWER(c.company.roleTitle), @searchTerm)
                  OR CONTAINS(LOWER(c.workplaceContext), @searchTerm)
                  OR CONTAINS(LOWER(c.outcome), @searchTerm)
                  OR CONTAINS(LOWER(c.impact), @searchTerm)
                  OR CONTAINS(LOWER(c.confidence), @searchTerm)
                  OR EXISTS(SELECT VALUE tag FROM tag IN c.tags WHERE CONTAINS(LOWER(tag.displayName), @searchTerm) OR CONTAINS(LOWER(tag.slug), @searchTerm))
                  OR EXISTS(SELECT VALUE collaborator FROM collaborator IN c.collaborators WHERE CONTAINS(LOWER(collaborator.name), @searchTerm))
                  OR EXISTS(SELECT VALUE article FROM article IN c.relatedArticles WHERE CONTAINS(LOWER(article.title), @searchTerm))
                  OR EXISTS(SELECT VALUE decision FROM decision IN c.decisions WHERE CONTAINS(LOWER(decision), @searchTerm))
                  OR EXISTS(SELECT VALUE blocker FROM blocker IN c.blockers WHERE CONTAINS(LOWER(blocker), @searchTerm))
                  OR EXISTS(SELECT VALUE nextAction FROM nextAction IN c.nextActions WHERE CONTAINS(LOWER(nextAction), @searchTerm))
                )
                """);
        }

        var entryTypeFilter = FindEqualsFilter(query, "entryType");
        if (entryTypeFilter is not null) conditions.Add("c.entryType = @entryType");

        var statusFilter = FindEqualsFilter(query, "status");
        if (statusFilter is not null) conditions.Add("c.status = @status");

        var tagFilter = FindEqualsFilter(query, "tag");
        if (tagFilter is not null) {
            conditions.Add("EXISTS(SELECT VALUE tag FROM tag IN c.tags WHERE LOWER(tag.displayName) = @tag OR LOWER(tag.slug) = @tag)");
        }

        var workplaceContextFilter = FindEqualsFilter(query, "workplaceContext");
        if (workplaceContextFilter is not null) conditions.Add("LOWER(c.workplaceContext) = @workplaceContext");

        var outcomeFilter = FindEqualsFilter(query, "outcome");
        if (outcomeFilter is not null) conditions.Add("LOWER(c.outcome) = @outcome");

        var confidenceFilter = FindEqualsFilter(query, "confidence");
        if (confidenceFilter is not null) conditions.Add("c.confidence = @confidence");

        var queryDefinition = new QueryDefinition($"""
            SELECT * FROM c
            WHERE {string.Join($"{Environment.NewLine} AND ", conditions)}
            ORDER BY {ResolveOrderBy(query)}
            """)
            .WithParameter("@type", JournalEntryDocument.DocumentType);

        if (!string.IsNullOrWhiteSpace(query.SearchTerm)) queryDefinition = queryDefinition.WithParameter("@searchTerm", query.SearchTerm.Trim().ToLowerInvariant());
        if (entryTypeFilter is not null) queryDefinition = queryDefinition.WithParameter("@entryType", entryTypeFilter.Value.Trim());
        if (statusFilter is not null) queryDefinition = queryDefinition.WithParameter("@status", statusFilter.Value.Trim());
        if (tagFilter is not null) queryDefinition = queryDefinition.WithParameter("@tag", tagFilter.Value.Trim().ToLowerInvariant());
        if (workplaceContextFilter is not null) queryDefinition = queryDefinition.WithParameter("@workplaceContext", workplaceContextFilter.Value.Trim().ToLowerInvariant());
        if (outcomeFilter is not null) queryDefinition = queryDefinition.WithParameter("@outcome", outcomeFilter.Value.Trim().ToLowerInvariant());
        if (confidenceFilter is not null) queryDefinition = queryDefinition.WithParameter("@confidence", confidenceFilter.Value.Trim());

        return queryDefinition;
    }

    private static QueryFilter? FindEqualsFilter(BaseQuery query, string field)
    {
        return query.Filters.FirstOrDefault(filter =>
            string.Equals(filter.Field, field, StringComparison.OrdinalIgnoreCase)
            && filter.Operator == FilterOperator.Equals
            && !string.IsNullOrWhiteSpace(filter.Value));
    }

    private static string ResolveOrderBy(BaseQuery query)
    {
        if (string.IsNullOrWhiteSpace(query.SortBy)) return DefaultOrderBy;

        var field = query.SortBy.Trim().ToLowerInvariant() switch {
            "occurredon" or "date" => "c.occurredOn",
            "createdat" => "c.createdAt",
            "updatedat" => "c.updatedAt",
            _ => null
        };

        if (field is null) return DefaultOrderBy;
        var direction = query.SortDirection == SortDirection.Asc ? "ASC" : "DESC";
        return $"{field} {direction}, c.createdAt DESC";
    }
}
