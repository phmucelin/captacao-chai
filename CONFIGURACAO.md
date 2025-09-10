# Configuração do Sistema de Captação WhatsApp

## 🚀 Passos para Configuração

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá para o editor SQL no painel do Supabase
4. Execute o código SQL do arquivo `supabase-schema.sql`
5. Copie a URL do projeto e a chave anônima

### 2. Configurar Variáveis de Ambiente

No arquivo `.env.local`, substitua os valores placeholder:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_real_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_real_do_supabase
```

### 3. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `captacao-chai`
4. Configure as variáveis de ambiente na Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Faça o deploy

### 4. Testar o Sistema

1. Acesse sua aplicação na Vercel
2. Vá para "Mensagem Padrão" e configure sua mensagem
3. Adicione alguns contatos ou importe o arquivo `exemplo-contatos.csv`
4. Teste o envio de mensagens

## 📋 Funcionalidades Implementadas

✅ **Dashboard de Contatos**
- Lista todos os contatos com status
- Filtros por status (Pendente, Enviado, Erro)
- Interface limpa e responsiva

✅ **Importação CSV**
- Upload de arquivos CSV
- Preview dos dados antes da importação
- Validação automática de dados

✅ **Adição Individual**
- Formulário para adicionar contatos
- Validação de telefone brasileiro
- Formatação automática

✅ **Mensagem Padrão**
- Editor de mensagens personalizáveis
- Suporte a variáveis ({NOME})
- Preview da mensagem
- Exemplos de uso

✅ **Integração WhatsApp**
- Links diretos para WhatsApp Web
- Substituição automática de variáveis
- Controle de status dos envios

✅ **Design e UX**
- Interface minimalista e acessível
- Responsivo para mobile e desktop
- Feedback visual para todas as ações
- Loading states e mensagens de erro

## 🎯 Como Usar

### Configurar Mensagem Padrão
1. Acesse "Mensagem Padrão"
2. Digite sua mensagem usando `{NOME}` para personalizar
3. Use o botão "Preview" para testar
4. Salve a mensagem

### Adicionar Contatos
**Individual:**
1. Clique em "Adicionar Contato"
2. Preencha nome e telefone
3. Clique em "Adicionar"

**CSV:**
1. Clique em "Importar CSV"
2. Selecione arquivo com colunas: nome, telefone
3. Verifique o preview
4. Clique em "Importar"

### Enviar Mensagens
1. Na dashboard, clique em "Enviar" ao lado do contato
2. O WhatsApp Web abrirá com a mensagem personalizada
3. O status será atualizado automaticamente

## 📊 Formato do CSV

```csv
nome,telefone
João Silva,11999999999
Maria Santos,11888888888
```

## 🔧 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados PostgreSQL
- **Lucide React** - Ícones
- **Papa Parse** - Processamento de CSV

## 📱 Recursos de Acessibilidade

- Contraste adequado de cores
- Navegação por teclado
- Labels descritivos
- Estados de loading e erro
- Interface responsiva

## 🚀 Próximos Passos

Após o deploy, você pode:
1. Personalizar a mensagem padrão
2. Importar sua lista de contatos
3. Começar a enviar mensagens
4. Acompanhar o status dos envios

O sistema está pronto para uso em produção!
