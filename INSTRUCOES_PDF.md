# Como Gerar o PDF do Manual

## 🚀 Opção 1: Windows (Mais Fácil)

1. **Execute o arquivo batch:**
   ```
   gerar_pdf.bat
   ```
   - Duplo clique no arquivo `gerar_pdf.bat`
   - O script instalará as dependências automaticamente
   - O PDF será gerado na mesma pasta

## 🐧 Opção 2: Linux/Mac

1. **Execute o script shell:**
   ```bash
   ./gerar_pdf.sh
   ```
   - Torne o script executável: `chmod +x gerar_pdf.sh`
   - Execute: `./gerar_pdf.sh`

## 🐍 Opção 3: Manual com Python

### Instalar Dependências
```bash
pip install markdown weasyprint
```

### Gerar PDF
```bash
python generate_pdf_weasy.py
```

## 📋 Dependências Necessárias

### Python Packages
- `markdown` - Conversão MD para HTML
- `weasyprint` - Geração de PDF (recomendado)
- `pdfkit` - Alternativa para PDF

### Sistema (para pdfkit)
- **Windows**: Baixar wkhtmltopdf de https://wkhtmltopdf.org/downloads.html
- **Ubuntu/Debian**: `sudo apt-get install wkhtmltopdf`
- **macOS**: `brew install wkhtmltopdf`

## 🎯 Resultado

Após a execução bem-sucedida, você terá:
- **Arquivo**: `Manual_KEA_Labs_Business_Intelligence.pdf`
- **Formato**: A4, com índice e formatação profissional
- **Conteúdo**: Manual completo com todas as seções

## ⚠️ Solução de Problemas

### Erro: "Python não encontrado"
- Instale Python 3.7+ de https://python.org
- Certifique-se de marcar "Add to PATH" na instalação

### Erro: "WeasyPrint falhou"
- O script tentará usar pdfkit automaticamente
- Instale wkhtmltopdf conforme instruções acima

### Erro: "Permission denied"
- Linux/Mac: `chmod +x gerar_pdf.sh`
- Windows: Execute como administrador

## 📄 Arquivos Gerados

- `Manual_KEA_Labs_Business_Intelligence.pdf` - Manual principal
- `manual_temp.html` - Arquivo temporário (removido automaticamente)