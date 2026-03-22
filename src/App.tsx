import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Link as LinkIcon, Search, Pin, ChevronDown, ChevronUp } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  categories: string[];
  isPinned: boolean;
}

export default function App() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategories, setEditCategories] = useState<string[]>([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem('my-links');
    const savedCategories = localStorage.getItem('my-categories');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('my-links', JSON.stringify(links));
    localStorage.setItem('my-categories', JSON.stringify(categories));
  }, [links, categories]);

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title,
      url: url.startsWith('http') ? url : `https://${url}`,
      description,
      categories: selectedCategories,
      isPinned: false,
    };

    setLinks([...links, newLink]);
    setTitle('');
    setUrl('');
    setDescription('');
    setSelectedCategories([]);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const togglePin = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, isPinned: !link.isPinned } : link
      )
    );
  };

  const startEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditDescription(link.description || '');
    setEditCategories(link.categories || []);
  };

  const saveEdit = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id
          ? { ...link, title: editTitle, url: editUrl, description: editDescription, categories: editCategories }
          : link
      )
    );
    setEditingId(null);
  };

  const filteredLinks = links
    .filter(
      (link) =>
        (link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
         link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         link.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (selectedCategoryFilter ? link.categories.includes(selectedCategoryFilter) : true)
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">LinkOrganizer</h1>
        <p className="text-zinc-400">Organize suas ferramentas e sites favoritos.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <form onSubmit={addLink} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nome do Site"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="URL (ex: google.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategories.includes(cat) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition"
          >
            <Plus size={20} /> Adicionar
          </button>
        </form>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-12">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center justify-between text-lg font-semibold mb-4">
            Filtrar por Categoria
            {isFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isFilterOpen && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategoryFilter === null ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat === selectedCategoryFilter ? null : cat)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-12">
          <button onClick={() => setIsManageOpen(!isManageOpen)} className="w-full flex items-center justify-between text-lg font-semibold mb-4">
            Gerenciar Categorias
            {isManageOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isManageOpen && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-full text-sm">
                    {cat}
                    <button onClick={() => {
                      setCategories(prev => prev.filter(c => c !== cat));
                      if (selectedCategoryFilter === cat) setSelectedCategoryFilter(null);
                    }} className="text-zinc-500 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (newCategory && !categories.includes(newCategory)) {
                      setCategories([...categories, newCategory]);
                      setNewCategory('');
                    }
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl px-4 py-2 transition"
                >
                  Criar
                </button>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className={`bg-zinc-900 border p-5 rounded-2xl flex flex-col justify-between transition group ${
                link.isPinned ? 'border-indigo-500' : 'border-zinc-800'
              }`}
            >
              {editingId === link.id ? (
                <div className="space-y-3">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1" />
                  <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1" />
                  <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1" />
                  <div className="flex flex-wrap gap-1">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEditCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                        className={`px-2 py-0.5 rounded text-xs ${editCategories.includes(cat) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => saveEdit(link.id)} className="bg-indigo-600 w-full rounded-lg py-1">Salvar</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${link.isPinned ? 'bg-indigo-900 text-indigo-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      <LinkIcon size={20} />
                    </div>
                    <h3 className="font-medium truncate">{link.title}</h3>
                  </div>
                  {link.description && <p className="text-sm text-zinc-400 mb-4 truncate">{link.description}</p>}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {link.categories.map(cat => (
                      <span key={cat} className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs">{cat}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Visitar <ExternalLink size={14} />
                    </a>
                    <div className="flex gap-1">
                      <button onClick={() => togglePin(link.id)} className={`p-2 rounded-lg transition ${link.isPinned ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        <Pin size={18} />
                      </button>
                      <button onClick={() => startEdit(link)} className="text-zinc-500 hover:text-zinc-300 p-2 rounded-lg transition">Editar</button>
                      <button onClick={() => deleteLink(link.id)} className="text-zinc-500 hover:text-red-400 p-2 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
