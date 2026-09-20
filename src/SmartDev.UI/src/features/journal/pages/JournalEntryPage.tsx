import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { JournalEntryContent } from '../components/JournalEntryContent';
import { JournalEntryMetadataPane } from '../components/JournalEntryMetadataPane';
import { JournalEntryPageSkeleton } from '../components/JournalEntryPageSkeleton';
import { useJournalEntryForm, type EditableJournalEntryField, type JournalEntryFormController } from '../hooks/useJournalEntryForm';
import { useCreateJournalEntryMutation, useUpdateJournalEntryMutation } from '../queries/journal.mutations';
import { useJournalEntryFormQuery } from '../queries/journal.queries';
import { defaultJournalEntryFormValues } from '../types/journalEntryForm.schema';

export const JournalEntryPage = () => {
  const navigate = useNavigate();
  const newEntryMatch = useMatch('/journal/new');
  const { entryId = '' } = useParams();
  const { isAuthReady } = useAuth();
  const isNewEntry = Boolean(newEntryMatch);
  const [editingField, setEditingField] = useState<EditableJournalEntryField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');

  const entryQuery = useJournalEntryFormQuery(entryId, isAuthReady && !isNewEntry && entryId.trim().length > 0);
  const createEntryMutation = useCreateJournalEntryMutation();
  const updateEntryMutation = useUpdateJournalEntryMutation(entryId);
  const activeMutation = isNewEntry ? createEntryMutation : updateEntryMutation;
  const form = useJournalEntryForm();
  const { draft, getValidForm, reset } = form;

  useEffect(() => {
    document.title = `${isNewEntry ? 'New journal entry' : draft.title || 'Journal'} | ${appConfig.appName}`;
  }, [draft.title, isNewEntry]);

  useEffect(() => {
    if (!entryQuery.data || isNewEntry) return;
    reset(entryQuery.data);
  }, [entryQuery.data, isNewEntry, reset]);

  const saveEntry = async () => {
    setSavedMessage('');
    const entry = await getValidForm();
    if (!entry) return;

    try {
      if (isNewEntry) {
        const savedEntry = await createEntryMutation.mutateAsync(entry);
        reset(entry);
        setEditingField(undefined);
        setSavedMessage('Journal entry saved.');
        void navigate(`/journal/${encodeURIComponent(savedEntry.entryId)}`, { replace: true });
        return;
      }

      await updateEntryMutation.mutateAsync(entry);
      reset(entry);
      setEditingField(undefined);
      setSavedMessage('Journal entry saved.');
    } catch {
      // Mutation state renders the visible error message.
    }
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveEntry();
  };

  const handleEditField = (field: EditableJournalEntryField) => {
    setSavedMessage('');
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(undefined);
  };

  const handleCancel = () => {
    reset(isNewEntry ? defaultJournalEntryFormValues : entryQuery.data);
    setEditingField(undefined);
    setSavedMessage('');
  };

  if (!isAuthReady || (!isNewEntry && entryQuery.isLoading)) return <JournalEntryPageSkeleton />;

  const mutationError = activeMutation.isError ? 'Journal entry could not be saved.' : '';
  const formController: JournalEntryFormController = {
    values: draft,
    errors: form.errors,
    editingField,
    isDirty: form.isDirty,
    isSaving: activeMutation.isPending || form.isSubmitting,
    savedMessage,
    blurField: handleFieldBlur,
    editField: handleEditField,
    updateField: form.updateField
  };

  return (
    <WorkspacePageWrapper>
      <form className="h-full min-h-0" onSubmit={handleSave}>
        <div className="mx-auto h-full max-w-[1500px] overflow-y-auto lg:grid lg:grid-cols-[1fr_18rem] lg:overflow-hidden">
          <JournalEntryContent form={formController} />
          <JournalEntryMetadataPane form={formController} mutationError={mutationError} onCancel={handleCancel} />
        </div>
      </form>
    </WorkspacePageWrapper>
  );
};
