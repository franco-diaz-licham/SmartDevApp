using SmartDev.Api.Functions.Domain.Notes;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Application.Ports;

public interface INoteRepository
{
    Task<Note?> GetByIdAsync(NoteId id, CancellationToken cancellationToken);

    Task<Note?> GetBySlugAsync(NoteSlug slug, CancellationToken cancellationToken);

    Task<DocumentPage<Note>> GetPublishedPublicNotesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<Note>> GetPublishedPublicNotesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyCollection<Note>> GetAllForOwnerAsync(CancellationToken cancellationToken);

    Task AddAsync(Note note, CancellationToken cancellationToken);

    Task SaveAsync(Note note, CancellationToken cancellationToken);
}
