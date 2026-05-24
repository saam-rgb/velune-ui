import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchArticles = createAsyncThunk('articles/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/articles', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to load articles');
  }
});

export const fetchArticle = createAsyncThunk('articles/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/articles/${slug}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Article not found');
  }
});

export const fetchRelated = createAsyncThunk('articles/fetchRelated', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/articles/${slug}/related`);
    return { slug, articles: data };
  } catch {
    return rejectWithValue('Failed to load related articles');
  }
});

export const createArticle = createAsyncThunk('articles/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/articles', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create article');
  }
});

export const updateArticle = createAsyncThunk('articles/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/articles/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update article');
  }
});

export const deleteArticle = createAsyncThunk('articles/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/articles/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete article');
  }
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    list: [],
    total: 0,
    page: 1,
    totalPages: 1,
    current: null,
    related: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null; },
    clearError(state)   { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.pending,  s => { s.loading = true; s.error = null; })
      .addCase(fetchArticles.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.articles;
        s.total = payload.total;
        s.page = payload.page;
        s.totalPages = payload.totalPages;
      })
      .addCase(fetchArticles.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchArticle.pending,  s => { s.loading = true; s.error = null; })
      .addCase(fetchArticle.fulfilled, (s, { payload }) => { s.loading = false; s.current = payload; })
      .addCase(fetchArticle.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchRelated.fulfilled, (s, { payload }) => {
        s.related[payload.slug] = payload.articles;
      })

      .addCase(createArticle.fulfilled, (s, { payload }) => {
        // Prepend the new article if it's published so lists stay valid without a full re-fetch
        if (payload.status === 'PUBLISHED') {
          s.list = [payload, ...s.list];
          s.total += 1;
        }
      })
      .addCase(updateArticle.fulfilled, (s, { payload }) => {
        s.list = s.list.map(a => a.id === payload.id ? payload : a);
        if (s.current?.id === payload.id) s.current = payload;
      })
      .addCase(deleteArticle.fulfilled, (s, { payload }) => {
        s.list = s.list.filter(a => a.id !== payload);
      });
  },
});

export const { clearCurrent, clearError } = articlesSlice.actions;

export const selectArticles      = s => s.articles.list;
export const selectArticlesMeta  = s => ({ total: s.articles.total, page: s.articles.page, totalPages: s.articles.totalPages });
export const selectCurrentArticle = s => s.articles.current;
export const selectRelated       = slug => s => s.articles.related[slug] || [];
export const selectArticlesLoading = s => s.articles.loading;

export default articlesSlice.reducer;
