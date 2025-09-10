export interface Contact {
  id: string
  name: string
  phone: string
  status: 'pending' | 'sent' | 'error'
  created_at: string
  updated_at: string
}

export interface DefaultMessage {
  id: string
  message: string
  created_at: string
  updated_at: string
}

export interface CSVContact {
  name: string
  phone: string
}

export interface ContactFormData {
  name: string
  phone: string
}
