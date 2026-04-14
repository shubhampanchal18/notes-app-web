import React, { useState, useEffect, useMemo } from 'react';
import './Notes.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const COLORS = ['#4f7cff', '#ff9f43', '#2dd4bf', '#f97316', '#7c3aed', '#fb7185'];

const Notes = ({ onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editColor, setEditColor] = useState(COLORS[0]);
  const [editPinned, setEditPinned] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotes(response.data.notes);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/notes`,
        {
          title,
          content,
          tags: tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
          color,
          pinned
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes([response.data.note, ...notes]);
      setTitle('');
      setContent('');
      setTags('');
      setPinned(false);
      setColor(COLORS[0]);
      setSuccess('Note added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note) => {
    setEditNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags || '');
    setEditColor(note.color || COLORS[0]);
    setEditPinned(!!note.pinned);
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditNoteId(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
    setEditPinned(false);
  };

  const saveEdit = async (noteId) => {
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/notes/${noteId}`,
        {
          title: editTitle,
          content: editContent,
          tags: editTags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
          color: editColor,
          pinned: editPinned
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes(notes.map((note) => (note.id === noteId ? response.data.note : note)));
      setEditNoteId(null);
      setSuccess('Note updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
await axios.delete(`${API_BASE_URL}/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setNotes(notes.filter((note) => note.id !== noteId));
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return a.pinned ? -1 : 1;
    });
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return sortedNotes.filter((note) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        (note.tags || '').toLowerCase().includes(term);
      const matchesTag = selectedTag ? (note.tags || '').split(',').map((tag) => tag.trim()).includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [sortedNotes, searchTerm, selectedTag]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach((note) => {
      (note.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)
        .forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [notes]);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <div>
          <h1>📝 My Notes</h1>
          <p>Welcome, {user?.username}! Organize your ideas with tags, colors, and inline editing.</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="notes-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search notes by title, content, or tag"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="tag-filter"
        >
          <option value="">All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="notes-content">
        <div className="add-note-section">
          <div className="section-header">
            <h2>Add New Note</h2>
            <div className="tag-pill-list">
              <span className="pill">Tips:</span>
              <span className="pill">Enter tags separated by commas.</span>
              <span className="pill">Use pinned notes for priority.</span>
            </div>
          </div>

          {(error || success) && (
            <p className={error ? 'error' : 'success'}>{error || success}</p>
          )}

          <form onSubmit={handleAddNote} className="note-form">
            <div className="form-grid">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                {COLORS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              required
            ></textarea>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                Pin note
              </label>
            </div>
            <button type="submit" disabled={loading} className="primary">
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </form>
        </div>

        <div className="notes-list-section">
          <div className="section-header">
            <h2>Your Notes ({filteredNotes.length})</h2>
            <span className="meta-text">Sorted by pinned, updated time</span>
          </div>
          {fetchLoading ? (
            <p>Loading notes...</p>
          ) : filteredNotes.length === 0 ? (
            <p className="no-notes">No matching notes found.</p>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-card"
                  style={{ background: note.color }}
                >
                  {editNoteId === note.id ? (
                    <>
                      <input
                        className="note-title-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="note-content-input"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="5"
                      />
                      <input
                        className="note-tags-input"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="Tags, comma separated"
                      />
                      <div className="note-card-bottom">
                        <div>
                          <label className="checkbox-label small">
                            <input
                              type="checkbox"
                              checked={editPinned}
                              onChange={(e) => setEditPinned(e.target.checked)}
                            />
                            Pinned
                          </label>
                        </div>
                        <div className="edit-controls">
                          <button className="secondary" onClick={cancelEdit}>
                            Cancel
                          </button>
                          <button className="primary" onClick={() => saveEdit(note.id)}>
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="note-card-header">
                        <h3>{note.title}</h3>
                        {note.pinned && <span className="pill note-pill">Pinned</span>}
                      </div>
                      <p>{note.content}</p>
                      <div className="note-tags">
                        {(note.tags || '')
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter((tag) => tag)
                          .map((tag) => (
                            <span key={tag} className="pill note-tag">
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="note-footer">
                        <small>
                          Updated {new Date(note.updatedAt).toLocaleDateString()} • Created{' '}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </small>
                        <div className="button-group">
                          <button className="secondary" onClick={() => startEdit(note)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
