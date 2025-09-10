'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Save, MessageSquare, Info } from 'lucide-react'

export default function MessagePage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const nomeVar = '{NOME}'

  useEffect(() => {
    fetchDefaultMessage()
  }, [])

  const fetchDefaultMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('default_message')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setMessage(data?.message || `Olá ${nomeVar}! Como posso ajudá-lo hoje?`)
    } catch (error) {
      console.error('Erro ao buscar mensagem padrão:', error)
      setError('Erro ao carregar mensagem padrão')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      if (!message.trim()) {
        throw new Error('A mensagem não pode estar vazia')
      }

      // Verificar se já existe uma mensagem padrão
      const { data: existingMessage } = await supabase
        .from('default_message')
        .select('id')
        .single()

      if (existingMessage) {
        // Atualizar mensagem existente
        const { error: updateError } = await supabase
          .from('default_message')
          .update({ 
            message: message.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMessage.id)

        if (updateError) throw updateError
      } else {
        // Criar nova mensagem
        const { error: insertError } = await supabase
          .from('default_message')
          .insert({
            message: message.trim()
          })

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar mensagem')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    const previewMessage = message.replace(/{NOME}/g, 'João Silva')
    alert(`Preview da mensagem:\n\n${previewMessage}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mensagem Padrão</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Como usar variáveis:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use <code className="bg-blue-100 px-1 rounded">{nomeVar}</code> para inserir o nome do contato</li>
              <li>As variáveis serão substituídas automaticamente ao enviar mensagens</li>
              <li>Exemplo: &quot;Olá {nomeVar}! Como posso ajudá-lo?&quot; → &quot;Olá João! Como posso ajudá-lo?&quot;</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite sua mensagem padrão aqui..."
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {message.length} caracteres
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-sm text-green-700">Mensagem salva com sucesso!</div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Mensagem'}
          </button>
        </div>
      </form>

      <div className="bg-gray-50 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Exemplos de mensagens:</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="bg-white p-3 rounded border">
            <strong>Vendas:</strong> &quot;Olá {nomeVar}! Vi que você tem interesse em nossos produtos. Gostaria de agendar uma conversa?&quot;
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Suporte:</strong> &quot;Oi {nomeVar}! Como posso ajudá-lo hoje? Estou aqui para esclarecer suas dúvidas.&quot;
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Follow-up:</strong> &quot;Olá {nomeVar}! Passando para saber se você ainda tem interesse em nossa proposta.&quot;
          </div>
        </div>
      </div>
    </div>
  )
}
