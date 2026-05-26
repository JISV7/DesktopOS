import React, { useState, useEffect } from 'react';
import { WindowInstance } from '../types/os';
import { Plus, Trash2, FileText } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

const Notes: React.FC<{ window: WindowInstance }> = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('desktopos-notes');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'Welcome', content: 'Type your notes here...', lastModified: Date.now() }];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id);

  useEffect(() => {
    localStorage.setItem('desktopos-notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Note',
      content: '',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id || '');
    }
  };

  const updateNote = (content: string) => {
    setNotes(notes.map(n => {
      if (n.id === activeNoteId) {
        const title = content.split('\n')[0].substring(0, 30) || 'Untitled';
        return { ...n, content, title, lastModified: Date.now() };
      }
      return n;
    }));
  };

  return (
    <div className="h-full bg-os-bg flex select-none text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-black/20">
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-bold text-sm opacity-50 uppercase tracking-widest">Notes</h2>
          <button 
            onClick={addNote}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={twMerge(
                "p-4 cursor-default border-b border-white/5 transition-colors group",
                activeNoteId === note.id ? "bg-os-accent/20" : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={14} className="text-os-accent shrink-0" />
                  <span className="font-medium truncate text-sm">{note.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteNote(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-[11px] opacity-40 truncate">
                {new Date(note.lastModified).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-white/[0.02]">
        {activeNote ? (
          <textarea
            value={activeNote.content}
            onChange={(e) => updateNote(e.target.value)}
            className="flex-1 bg-transparent p-8 outline-none resize-none font-sans text-lg leading-relaxed placeholder:opacity-20"
            placeholder="Start typing..."
            spellCheck={false}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-20 text-sm">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
