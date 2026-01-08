#!/usr/bin/env python3
"""
Gerador de PDF Alternativo usando WeasyPrint
Mais confiável que pdfkit em alguns sistemas
"""

from weasyprint import HTML, CSS
from pathlib import Path
import markdown

def generate_pdf_weasyprint():
    """Gera PDF usando WeasyPrint"""
    
    md_file = Path("MANUAL_USUARIO.md")
    pdf_file = Path("Manual_KEA_Labs_Business_Intelligence.pdf")
    
    if not md_file.exists():
        print(f"❌ Arquivo {md_file} não encontrado!")
        return False
    
    try:
        # Ler markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Converter para HTML
        html_content = markdown.markdown(
            md_content, 
            extensions=['tables', 'toc', 'codehilite', 'fenced_code']
        )
        
        # CSS para o PDF
        css_content = """
        @page {
            size: A4;
            margin: 2cm;
            @bottom-right {
                content: "Página " counter(page);
                font-size: 10px;
                color: #666;
            }
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 11px;
        }
        
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            page-break-before: always;
        }
        
        h1:first-of-type {
            page-break-before: avoid;
        }
        
        h2 {
            color: #764ba2;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-top: 25px;
        }
        
        h3 {
            color: #555;
            margin-top: 20px;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
            font-size: 10px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 10px;
            font-size: 9px;
            color: #666;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin: 5px 0;
        }
        """
        
        # HTML completo
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Manual KEA Labs Business Intelligence</title>
        </head>
        <body>
            <div class="header">
                <h1>KEA Labs Business Intelligence</h1>
                <p><strong>Manual de Utilização Completo</strong></p>
                <p>Versão 2.0 - 2024</p>
            </div>
            {html_content}
            <div class="footer">
                <p><strong>© 2024 KEA Labs - Business Intelligence System</strong></p>
                <p>Todos os direitos reservados</p>
            </div>
        </body>
        </html>
        """
        
        # Gerar PDF
        print("🔄 Gerando PDF com WeasyPrint...")
        HTML(string=full_html).write_pdf(
            str(pdf_file),
            stylesheets=[CSS(string=css_content)]
        )
        
        print(f"✅ PDF gerado com sucesso: {pdf_file}")
        print(f"📄 Tamanho: {pdf_file.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao gerar PDF: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Gerador de PDF - WeasyPrint")
    print("=" * 40)
    
    try:
        from weasyprint import HTML, CSS
        import markdown
        
        success = generate_pdf_weasyprint()
        if success:
            print("\n🎉 Manual em PDF criado com sucesso!")
        else:
            print("\n💥 Falha ao gerar PDF")
            
    except ImportError:
        print("❌ WeasyPrint não instalado!")
        print("📦 Instale com: pip install weasyprint markdown")