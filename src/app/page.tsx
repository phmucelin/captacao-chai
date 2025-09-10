'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/types'
import { Plus, Upload, Send, CheckCircle, XCircle, Clock } from 'lucide-react'
import AddContactModal from '@/components/AddContactModal'
import UploadCSVModal from '@/components/UploadCSVModal'

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (contact: Contact) => {
    try {
      // Buscar mensagem padrão
      const { data: messageData, error: messageError } = await supabase
        .from('default_message')
        .select('message')
        .single()

      if (messageError && messageError.code !== 'PGRST116') {
        throw messageError
      }

      let message = messageData?.message || 'Olá! Como posso ajudá-lo?'
      
      // Substituir variáveis na mensagem
      message = message.replace(/{NOME}/g, contact.name)
      
      // Criar link do WhatsApp
      const phone = contact.phone.replace(/\D/g, '') // Remove caracteres não numéricos
      const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank')
      
      // Atualizar status para 'sent'
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', contact.id)

      if (updateError) throw updateError

      // Atualizar estado local
      setContacts(prev => 
        prev.map(c => 
          c.id === contact.id 
            ? { ...c, status: 'sent' as const, updated_at: new Date().toISOString() }
            : c
        )
      )
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Atualizar status para 'error'
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ 
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', contact.id)

      if (!updateError) {
        setContacts(prev => 
          prev.map(c => 
            c.id === contact.id 
              ? { ...c, status: 'error' as const, updated_at: new Date().toISOString() }
              : c
          )
        )
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado'
      case 'error':
        return 'Erro'
      default:
        return 'Pendente'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Contato
          </button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contato</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando um contato ou importando um arquivo CSV.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(contact.status)}
                      <span className="text-sm text-gray-500">{getStatusText(contact.status)}</span>
                    </div>
                    <button
                      onClick={() => handleSendMessage(contact)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Enviar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onContactAdded={fetchContacts}
      />

      <UploadCSVModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onContactsAdded={fetchContacts}
      />
    </div>
  )
}
