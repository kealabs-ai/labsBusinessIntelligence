#!/bin/bash

echo "========================================"
echo "   Gerador de PDF - Manual KEA Labs"
echo "========================================"
echo

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado!"
    echo "📦 Instale Python3 primeiro"
    exit 1
fi

echo "✅ Python3 encontrado"
echo

# Instalar dependências
echo "📦 Instalando dependências..."
pip3 install markdown weasyprint

echo
echo "🔄 Gerando PDF..."
echo

# Tentar com WeasyPrint primeiro
python3 generate_pdf_weasy.py

# Se falhar, tentar com pdfkit
if [ $? -ne 0 ]; then
    echo
    echo "⚠️  WeasyPrint falhou, tentando pdfkit..."
    pip3 install pdfkit
    
    # Verificar se wkhtmltopdf está instalado
    if ! command -v wkhtmltopdf &> /dev/null; then
        echo "❌ wkhtmltopdf não encontrado!"
        echo "📦 Instale com:"
        echo "   Ubuntu/Debian: sudo apt-get install wkhtmltopdf"
        echo "   macOS: brew install wkhtmltopdf"
        exit 1
    fi
    
    python3 generate_pdf.py
fi

echo
echo "✅ Processo concluído!"
echo "📄 Verifique o arquivo: Manual_KEA_Labs_Business_Intelligence.pdf"
echo