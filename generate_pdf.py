#!/usr/bin/env python3
"""
Script para gerar PDF do Manual de Utilização
Requer: pip install markdown pdfkit weasyprint
"""

import markdown
import pdfkit
from pathlib import Path
import os

def markdown_to_pdf():
    """Converte o manual markdown para PDF"""
    
    # Caminhos dos arquivos
    md_file = Path("MANUAL_USUARIO.md")
    html_file = Path("manual_temp.html")
    pdf_file = Path("Manual_KEA_Labs_Business_Intelligence.pdf")
    
    # Verificar se o arquivo markdown existe
    if not md_file.exists():
        print(f"❌ Arquivo {md_file} não encontrado!")
        return False
    
    try:
        # Ler o arquivo markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Converter markdown para HTML
        html_content = markdown.markdown(
            md_content, 
            extensions=['tables', 'toc', 'codehilite']
        )
        
        # Template HTML com CSS
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Manual KEA Labs Business Intelligence</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                h1 {{
                    color: #667eea;
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 10px;
                }}
                h2 {{
                    color: #764ba2;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }}
                h3 {{
                    color: #555;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 15px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }}
                th {{
                    background-color: #f8f9fa;
                    font-weight: bold;
                }}
                code {{
                    background-color: #f4f4f4;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }}
                blockquote {{
                    border-left: 4px solid #667eea;
                    margin: 0;
                    padding-left: 20px;
                    color: #666;
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 40px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    font-size: 0.9em;
                    color: #666;
                }}
                @page {{
                    margin: 2cm;
                    @bottom-right {{
                        content: "Página " counter(page);
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KEA Labs Business Intelligence</h1>
                <p>Manual de Utilização Completo</p>
                <p>Versão 2.0 - 2024</p>
            </div>
            {html_content}
            <div class="footer">
                <p>© 2024 KEA Labs - Business Intelligence System</p>
                <p>Todos os direitos reservados</p>
            </div>
        </body>
        </html>
        """
        
        # Salvar HTML temporário
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        # Configurações do PDF
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        # Gerar PDF
        print("🔄 Gerando PDF...")
        pdfkit.from_file(str(html_file), str(pdf_file), options=options)
        
        # Limpar arquivo temporário
        html_file.unlink()
        
        print(f"✅ PDF gerado com sucesso: {pdf_file}")
        print(f"📄 Tamanho: {pdf_file.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao gerar PDF: {e}")
        # Limpar arquivo temporário se existir
        if html_file.exists():
            html_file.unlink()
        return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    try:
        import markdown
        import pdfkit
        return True
    except ImportError as e:
        print(f"❌ Dependência não encontrada: {e}")
        print("📦 Instale as dependências:")
        print("   pip install markdown pdfkit")
        print("   Também instale wkhtmltopdf:")
        print("   - Windows: https://wkhtmltopdf.org/downloads.html")
        print("   - Linux: sudo apt-get install wkhtmltopdf")
        print("   - macOS: brew install wkhtmltopdf")
        return False

if __name__ == "__main__":
    print("🚀 Gerador de PDF - Manual KEA Labs")
    print("=" * 40)
    
    if check_dependencies():
        success = markdown_to_pdf()
        if success:
            print("\n🎉 Manual em PDF criado com sucesso!")
        else:
            print("\n💥 Falha ao gerar PDF")
    else:
        print("\n⚠️  Instale as dependências primeiro")