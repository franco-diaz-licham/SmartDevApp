import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { Path, PathValue } from 'react-hook-form';
import type { ArticleEntryModel, PublicArticleDetailModel } from '../types/article.types';
import { defaultArticleEntryFormValues, articleEntryFormSchema, type ArticleEntryFormErrors } from '../types/articleEntryForm.schema';

export type EditableArticleEntryField = 'title' | 'summary' | 'bodyMarkdown' | 'slug' | 'category' | 'tags';

export interface ArticleEntryFormController {
  values: ArticleEntryModel;
  errors: ArticleEntryFormErrors;
  editingField?: EditableArticleEntryField;
  isDirty: boolean;
  isSaving: boolean;
  savedMessage?: string;
  cancel: () => void;
  blurField: () => void;
  editField: (field: EditableArticleEntryField) => void;
  updateField: <TField extends keyof ArticleEntryModel>(field: TField, value: ArticleEntryModel[TField]) => void;
}

type ArticleEntryTouchedFields = Partial<Record<keyof ArticleEntryModel, boolean>>;

/**
 * Keeps validation quiet until a field has been touched, then shows all errors
 * after the user attempts to save.
 */
const getVisibleArticleEntryFormErrors = (validationErrors: ArticleEntryFormErrors, touchedFields: ArticleEntryTouchedFields, hasSubmitted: boolean): ArticleEntryFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<ArticleEntryFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof ArticleEntryModel;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

/**
 * Converts a persisted article detail into the editable form shape used by the
 * owner-facing article editor.
 */
const getArticleEntryFormValues = (article: PublicArticleDetailModel): ArticleEntryModel => ({
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  category: article.category.displayName,
  tags: article.tags.map((tag) => tag.displayName).join(', '),
  bodyMarkdown: article.bodyMarkdown,
  status: article.status,
  visibility: article.visibility
});

/**
 * Builds a previewable article detail from unsaved form values so the article page
 * can render a new article before it exists in the API.
 */
const getDraftArticle = (draft: ArticleEntryModel): PublicArticleDetailModel => ({
  id: '',
  slug: draft.slug,
  title: draft.title || 'Untitled article',
  summary: draft.summary || 'Click to add a summary.',
  category: {
    slug: draft.category.trim().toLowerCase().replace(/\s+/g, '-'),
    displayName: draft.category || 'Uncategorised'
  },
  tags: draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
      displayName: tag
    })),
  updatedAt: null,
  publishedAt: new Date(),
  bodyMarkdown: draft.bodyMarkdown || 'Click to start writing.',
  status: draft.status,
  visibility: draft.visibility,
  relatedProjects: []
});

/**
 * Manages the owner article editor state with react-hook-form while exposing a
 * small domain-specific API for inline editable article fields.
 *
 * @param initialValues - Optional values used to seed the editor when creating
 * or editing an article.
 * @returns Draft article state, visible validation errors, validation helpers, and
 * field update/reset commands for the article editor UI.
 */
export const useArticleEntryForm = (initialValues: ArticleEntryModel = defaultArticleEntryFormValues) => {
  const {
    control,
    formState: { errors: formErrors, isDirty, isSubmitted, isValid, touchedFields },
    handleSubmit,
    reset: resetForm,
    setValue
  } = useForm<ArticleEntryModel>({
    defaultValues: initialValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(articleEntryFormSchema)
  });

  const draft = useWatch({ control, defaultValue: initialValues }) as ArticleEntryModel;

  const validationErrors = useMemo(
    () =>
      Object.entries(formErrors).reduce<ArticleEntryFormErrors>((errors, [field, error]) => {
        const formField = field as keyof ArticleEntryModel;
        if (error?.message) errors[formField] = error.message;
        return errors;
      }, {}),
    [formErrors]
  );

  const errors = useMemo(() => getVisibleArticleEntryFormErrors(validationErrors, touchedFields as ArticleEntryTouchedFields, isSubmitted), [isSubmitted, touchedFields, validationErrors]);

  const draftArticle = useMemo(() => getDraftArticle(draft), [draft]);

  const reset = useCallback(
    (values: ArticleEntryModel = defaultArticleEntryFormValues) => {
      resetForm(values);
    },
    [resetForm]
  );

  const getValidForm = useCallback(async (): Promise<ArticleEntryModel | null> => {
    let validForm: ArticleEntryModel | null = null;

    await handleSubmit((values) => {
      validForm = values;
    })();

    return validForm;
  }, [handleSubmit]);

  const resetFromArticle = useCallback(
    (article: PublicArticleDetailModel) => {
      reset(getArticleEntryFormValues(article));
    },
    [reset]
  );

  const updateField = <TField extends keyof ArticleEntryModel>(field: TField, value: ArticleEntryModel[TField]) => {
    setValue(field as Path<ArticleEntryModel>, value as PathValue<ArticleEntryModel, Path<ArticleEntryModel>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    draft,
    draftArticle,
    errors,
    isDirty,
    isValid,
    getValidForm,
    reset,
    resetFromArticle,
    updateField
  };
};
