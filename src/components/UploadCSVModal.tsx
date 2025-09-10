'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CSVContact } from '@/types'
import { X, FileText } from 'lucide-react'
import Papa from 'papaparse'

interface UploadCSVModalProps {
  isOpen: boolean
  onClose: () => void
  onContactsAdded: () => void
}

interface CSVRow {
  nome: string
  telefone: string
}

export default function UploadCSVModal({ isOpen, onClose, onContactsAdded }: UploadCSVModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<CSVContact[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setPreview([])
      
      // Fazer preview do arquivo
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          const data = results.data as CSVRow[]
          const validContacts: CSVContact[] = []
          
          data.forEach((row) => {
            if (row.nome && row.telefone) {
              validContacts.push({
                name: row.nome.toString().trim(),
                phone: row.telefone.toString().replace(/\D/g, '')
              })
            }
          })
          
          setPreview(validContacts.slice(0, 5)) // Mostrar apenas os primeiros 5
        },
        error: (error) => {
          setError('Erro ao processar arquivo CSV: ' + error.message)
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as CSVRow[]
          const contacts: CSVContact[] = []
          
          data.forEach((row) => {
            if (row.nome && row.telefone) {
              const phone = row.telefone.toString().replace(/\D/g, '')
              if (phone.length >= 10) {
                contacts.push({
                  name: row.nome.toString().trim(),
                  phone: phone
                })
              }
            }
          })

          if (contacts.length === 0) {
            throw new Error('Nenhum contato válido encontrado no arquivo')
          }

          // Inserir contatos no banco
          const { error: insertError } = await supabase
            .from('contacts')
            .insert(
              contacts.map(contact => ({
                name: contact.name,
                phone: contact.phone,
                status: 'pending'
              }))
            )

          if (insertError) throw insertError

          // Limpar e fechar
          setFile(null)
          setPreview([])
          onContactsAdded()
          onClose()
        },
        error: (error) => {
          setError('Erro ao processar arquivo CSV: ' + error.message)
          setLoading(false)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar contatos')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Importar CSV</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo CSV
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="csv-file"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Selecionar arquivo</span>
                    <input
                      id="csv-file"
                      name="csv-file"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">ou arraste aqui</p>
                </div>
                <p className="text-xs text-gray-500">CSV com colunas: nome, telefone</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          {preview.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (primeiros 5 contatos):</h4>
              <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                {preview.map((contact, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {contact.name} - {contact.phone}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={loading || !file}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Importando...' : 'Importar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
