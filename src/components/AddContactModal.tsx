'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ContactFormData } from '@/types'
import { X } from 'lucide-react'

interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
  onContactAdded: () => void
}

export default function AddContactModal({ isOpen, onClose, onContactAdded }: AddContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar dados
      if (!formData.name.trim() || !formData.phone.trim()) {
        throw new Error('Nome e telefone são obrigatórios')
      }

      // Limpar e formatar telefone
      const cleanPhone = formData.phone.replace(/\D/g, '')
      if (cleanPhone.length < 10) {
        throw new Error('Telefone deve ter pelo menos 10 dígitos')
      }

      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: formData.name.trim(),
          phone: cleanPhone,
          status: 'pending'
        })

      if (insertError) throw insertError

      // Limpar formulário e fechar modal
      setFormData({ name: '', phone: '' })
      onContactAdded()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar contato')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    
    // Formatar telefone brasileiro
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value
      } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`
      } else if (value.length <= 11) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
      }
    }
    
    setFormData(prev => ({ ...prev, phone: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Adicionar Contato</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome do contato"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
