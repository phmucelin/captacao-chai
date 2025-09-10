import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Captação WhatsApp',
  description: 'Sistema de captação de clientes via WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-semibold text-gray-900">
                  Captação WhatsApp
                </h1>
                <nav className="flex space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/message" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Mensagem Padrão
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
