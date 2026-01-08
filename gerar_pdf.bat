@echo off
echo ========================================
echo    Gerador de PDF - Manual KEA Labs
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo 📦 Instale Python em: https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
pip install markdown weasyprint

echo.
echo 🔄 Gerando PDF...
echo.

REM Tentar com WeasyPrint primeiro
python generate_pdf_weasy.py

REM Se falhar, tentar com pdfkit
if errorlevel 1 (
    echo.
    echo ⚠️  WeasyPrint falhou, tentando pdfkit...
    pip install pdfkit
    python generate_pdf.py
)

echo.
echo ✅ Processo concluído!
echo 📄 Verifique o arquivo: Manual_KEA_Labs_Business_Intelligence.pdf
echo.
pause