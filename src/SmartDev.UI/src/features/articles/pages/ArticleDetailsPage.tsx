import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { ArticleContent } from '../components/ArticleContent';
import { ArticleMetadataPane } from '../components/ArticleMetadataPane';
import { ArticleDetailsPageSkeleton } from '../components/ArticleDetailsPageSkeleton';
import { ArticlesSectionsPane } from '../components/ArticlesSectionsPane';
import { useArticleEntryForm, type EditableArticleEntryField, type ArticleEntryFormController } from '../hooks/useArticleEntryForm';
import { useArticleNarration } from '../hooks/useArticleNarration';
import { useCreateArticleMutation, useGenerateArticleAudioMutation, useUpdateArticleMutation } from '../queries/article.mutations';
import { useOwnerArticleQuery, usePublicArticleQuery } from '../queries/article.queries';
import { getArticleSections } from '../utils/articleContent';

export const ArticleDetailsPage = () => {
  const navigate = useNavigate();
  const newArticleMatch = useMatch('/workspace/articles/new');
  const { articleId = '' } = useParams();
  const { isAuthReady, isPublicView } = useAuth();

  const isNewArticle = Boolean(newArticleMatch);
  const hasArticleId = articleId.trim().length > 0;

  const [editingField, setEditingField] = useState<EditableArticleEntryField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');
  const [audioGenerationMessage, setAudioGenerationMessage] = useState('');

  const form = useArticleEntryForm();
  const { draft, draftArticle } = form;
  const { getValidForm, reset, resetFromArticle, updateField } = form;
  const { getSavedMessage } = useArticleNarration();

  const publicArticleQuery = usePublicArticleQuery(articleId, isAuthReady && hasArticleId && isPublicView);
  const ownerArticleQuery = useOwnerArticleQuery(articleId, isAuthReady && hasArticleId && !isPublicView);
  const articleQuery = isPublicView ? publicArticleQuery : ownerArticleQuery;

  const createArticleMutation = useCreateArticleMutation();
  const updateArticleMutation = useUpdateArticleMutation(articleId);
  const generateArticleAudioMutation = useGenerateArticleAudioMutation(articleId);
  const activeMutation = isNewArticle ? createArticleMutation : updateArticleMutation;

  const persistedArticle = isNewArticle ? undefined : articleQuery.data;
  const article = isNewArticle ? draftArticle : persistedArticle;

  const articleMarkdown = isPublicView ? (article?.bodyMarkdown ?? '') : draft.bodyMarkdown;
  const sections = useMemo(() => getArticleSections(articleMarkdown), [articleMarkdown]);

  useEffect(() => {
    document.title = `${isNewArticle ? 'New article' : (article?.title ?? 'Article')} | ${appConfig.appName}`;
  }, [isNewArticle, article?.title]);

  useEffect(() => {
    if (!persistedArticle || !hasArticleId || isPublicView) return;

    resetFromArticle(persistedArticle);
  }, [hasArticleId, isPublicView, persistedArticle, resetFromArticle]);

  const handleEditField = (field: EditableArticleEntryField) => {
    if (isPublicView) return;
    setSavedMessage('');
    setAudioGenerationMessage('');
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(undefined);
  };

  const handleCancel = () => {
    if (persistedArticle) resetFromArticle(persistedArticle);
    else reset();
    setEditingField(undefined);
    setSavedMessage('');
    setAudioGenerationMessage('');
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPublicView) return;
    setSavedMessage('');
    const entry = await getValidForm();
    if (!entry) return;

    try {
      if (isNewArticle) {
        const savedArticle = await createArticleMutation.mutateAsync(entry);
        reset(entry);
        setEditingField(undefined);
        setSavedMessage(getSavedMessage());
        void navigate(`/workspace/articles/${encodeURIComponent(savedArticle.articleId)}`, { replace: true });
        return;
      }

      await updateArticleMutation.mutateAsync(entry);
      reset(entry);
      setEditingField(undefined);
      setSavedMessage(getSavedMessage());
    } catch {
      // The mutation state drives the visible error message.
    }
  };

  const handleGenerateAudio = async () => {
    if (isPublicView || isNewArticle || !hasArticleId || form.isDirty) return;
    setAudioGenerationMessage('');

    try {
      const response = await generateArticleAudioMutation.mutateAsync();
      setAudioGenerationMessage(response.status === 'ready' ? 'Audio is already available for the saved article content.' : 'Audio generation has been queued.');
    } catch {
      setAudioGenerationMessage('Audio generation could not be queued.');
    }
  };

  const formController: ArticleEntryFormController = {
    values: draft,
    errors: form.errors,
    editingField,
    isDirty: form.isDirty,
    isSaving: activeMutation.isPending || (!isNewArticle && articleQuery.isLoading),
    savedMessage,
    cancel: handleCancel,
    blurField: handleFieldBlur,
    editField: handleEditField,
    updateField
  };

  if (!isAuthReady || (!isNewArticle && articleQuery.isLoading)) return <ArticleDetailsPageSkeleton />;

  const content = (
    <div className="mx-auto h-full max-w-[1560px] overflow-y-auto lg:grid lg:grid-cols-[1fr_18rem] lg:overflow-hidden xl:grid-cols-[17rem_1fr_18rem]">
      <ArticlesSectionsPane sections={sections} />
      <ArticleContent
        form={isPublicView ? undefined : formController}
        isEditable={!isPublicView}
        isLoading={!isNewArticle && articleQuery.isLoading}
        article={article}
        isGeneratingAudio={generateArticleAudioMutation.isPending}
        audioGenerationMessage={audioGenerationMessage}
        onGenerateAudio={handleGenerateAudio}
      />
      <ArticleMetadataPane form={isPublicView ? undefined : formController} isEditable={!isPublicView} article={article} />
    </div>
  );

  return (
    <WorkspacePageWrapper>
      {!isPublicView ? (
        <form className="h-full min-h-0" onSubmit={handleSave}>
          {content}
        </form>
      ) : (
        content
      )}
    </WorkspacePageWrapper>
  );
};
