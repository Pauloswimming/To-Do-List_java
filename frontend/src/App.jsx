import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

// URL do Backend Java
const API_URL = 'http://localhost:8080/api/tarefas';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const tituloRef = useRef(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error('Erro ao conectar');
      const dados = await resposta.json();
      setTarefas(dados);
      setErro(null);
    } catch (err) {
      setErro('Não foi possível conectar ao backend. Verifique se o Java está rodando na porta 8080.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const criarTarefa = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setSubmitting(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo.trim(), descricao: descricao.trim() })
      });
      setTitulo('');
      setDescricao('');
      setErro(null);
      carregarTarefas();
      tituloRef.current?.focus();
    } catch (err) {
      setErro('Erro ao salvar tarefa.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const alternarConclusao = async (tarefa) => {
    try {
      await fetch(`${API_URL}/${tarefa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tarefa, concluida: !tarefa.concluida })
      });
      carregarTarefas();
    } catch (err) {
      setErro('Erro ao atualizar tarefa.');
      console.error(err);
    }
  };

  const excluirTarefa = async (id) => {
    if (!confirm('Excluir esta tarefa?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      carregarTarefas();
    } catch (err) {
      setErro('Erro ao excluir.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-6">
      {/* Painel central com cartão */}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Minhas Tarefas
          </h1>
          <p className="mt-2 text-sm text-gray-500">Rápido, limpo e direto ao ponto — gerencie seu dia.</p>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
            <AlertCircle size={18} />
            <div className="text-sm">{erro}</div>
            <button onClick={carregarTarefas} className="ml-auto text-sm text-indigo-600 hover:underline flex items-center gap-2">
              <RefreshCw size={16} /> Recarregar
            </button>
          </div>
        )}

        {/* Formulário dentro de um cartão com glass effect */}
        <form onSubmit={criarTarefa} className="glass shadow-soft-lg p-5 rounded-xl mb-5 border border-white/60">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Nova tarefa</label>
          <input
            ref={tituloRef}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
            placeholder="Título da tarefa..."
            aria-label="Título da tarefa"
            required
          />

          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4 text-sm text-gray-700"
            placeholder="Descrição (opcional)"
            aria-label="Descrição da tarefa"
          />

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 btn-fab bg-indigo-600 text-white font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />} Adicionar
            </button>

            <button type="button" onClick={() => { setTitulo(''); setDescricao(''); tituloRef.current?.focus(); }} className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
              Limpar
            </button>
          </div>
        </form>

        {/* Lista de tarefas */}
        <div className="space-y-3">
          {loading ? (
            // skeletons
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow-sm flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full border border-gray-200 skeleton" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 mb-2 rounded skeleton" />
                    <div className="h-3 w-1/2 rounded skeleton" />
                  </div>
                </div>
              ))}
            </>
          ) : tarefas.length === 0 ? (
            <EmptyState onRefresh={carregarTarefas} />
          ) : (
            tarefas.map((tarefa) => (
              <div key={tarefa.id} className={`p-4 bg-white rounded-lg shadow-sm flex items-center justify-between transition-shadow hover:shadow-lg ${tarefa.concluida ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => alternarConclusao(tarefa)} aria-label={tarefa.concluida ? 'Marcar como não concluída' : 'Marcar como concluída'} className={`p-2 rounded-full border ${tarefa.concluida ? 'border-green-400 text-green-500' : 'border-gray-200 text-gray-400 hover:text-indigo-500'}`}>
                    {tarefa.concluida ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <div>
                    <div className={`font-semibold ${tarefa.concluida ? 'line-through text-gray-500' : 'text-gray-800'}`}>{tarefa.titulo}</div>
                    {tarefa.descricao && <div className="text-sm text-gray-500 mt-1">{tarefa.descricao}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => excluirTarefa(tarefa.id)} className="p-2 rounded-md text-red-400 hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer pequeno */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Dica: use nomes curtos e objetivos — facilita a leitura rápida.
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="p-8 rounded-xl bg-white/80 border border-gray-100 shadow-sm text-center">
      <svg width="96" height="64" viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
        <rect x="6" y="10" width="84" height="44" rx="6" fill="#EEF2FF" />
        <circle cx="24" cy="32" r="6" fill="#C7D2FE" />
        <rect x="36" y="26" width="42" height="4" rx="2" fill="#C7D2FE" />
        <rect x="36" y="34" width="28" height="4" rx="2" fill="#C7D2FE" />
      </svg>

      <h3 className="font-semibold text-gray-800">Nenhuma tarefa encontrada</h3>
      <p className="mt-2 text-sm text-gray-500">Adicione sua primeira tarefa usando o formulário acima.</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={onRefresh} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">
          <RefreshCw size={16} /> Recarregar
        </button>
      </div>
    </div>
  );
}
