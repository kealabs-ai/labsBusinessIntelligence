#!/usr/bin/env python3
"""
Gerador de PDF simples usando apenas HTML
"""

import markdown
from pathlib import Path

def create_pdf_html():
    """Cria HTML otimizado para impressão em PDF"""
    
    md_file = Path("MANUAL_USUARIO.md")
    html_file = Path("Manual_KEA_Labs_Business_Intelligence.html")
    
    if not md_file.exists():
        print(f"Arquivo {md_file} nao encontrado!")
        return False
    
    try:
        # Ler markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Converter para HTML
        html_content = markdown.markdown(
            md_content, 
            extensions=['tables', 'toc', 'codehilite']
        )
        
        # Template HTML otimizado para PDF
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Manual KEA Labs Business Intelligence</title>
            <style>
                @media print {{
                    @page {{
                        size: A4;
                        margin: 2cm;
                    }}
                    body {{
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }}
                }}
                
                body {{
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    font-size: 12px;
                }}
                
                .header {{
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 15px;
                    page-break-inside: avoid;
                }}
                
                .header h1 {{
                    margin: 0;
                    font-size: 2.5em;
                    font-weight: bold;
                }}
                
                .header p {{
                    margin: 10px 0;
                    font-size: 1.2em;
                }}
                
                h1 {{
                    color: #667eea;
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 10px;
                    page-break-before: always;
                    font-size: 1.8em;
                }}
                
                h1:first-of-type {{
                    page-break-before: avoid;
                }}
                
                h2 {{
                    color: #764ba2;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 8px;
                    margin-top: 30px;
                    font-size: 1.4em;
                }}
                
                h3 {{
                    color: #555;
                    margin-top: 25px;
                    font-size: 1.2em;
                }}
                
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                    page-break-inside: avoid;
                }}
                
                th, td {{
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }}
                
                th {{
                    background-color: #f8f9fa;
                    font-weight: bold;
                    color: #333;
                }}
                
                tr:nth-child(even) {{
                    background-color: #f9f9f9;
                }}
                
                code {{
                    background-color: #f4f4f4;
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }}
                
                blockquote {{
                    border-left: 4px solid #667eea;
                    margin: 20px 0;
                    padding-left: 20px;
                    color: #666;
                    font-style: italic;
                }}
                
                ul, ol {{
                    margin: 15px 0;
                    padding-left: 25px;
                }}
                
                li {{
                    margin: 8px 0;
                }}
                
                .footer {{
                    text-align: center;
                    margin-top: 50px;
                    padding: 25px;
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    border: 2px solid #e9ecef;
                    page-break-inside: avoid;
                }}
                
                .footer p {{
                    margin: 5px 0;
                    color: #666;
                }}
                
                .page-break {{
                    page-break-before: always;
                }}
                
                /* Melhor quebra de página */
                h1, h2, h3 {{
                    page-break-after: avoid;
                }}
                
                p, li {{
                    page-break-inside: avoid;
                    orphans: 2;
                    widows: 2;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KEA Labs Business Intelligence</h1>
                <p><strong>Manual de Utilização Completo</strong></p>
                <p>Sistema de Gestão Empresarial</p>
                <p>Versão 2.0 - 2024</p>
            </div>
            
            {html_content}
            
            <div class="footer">
                <p><strong>© 2024 KEA Labs - Business Intelligence System</strong></p>
                <p>Todos os direitos reservados</p>
                <p>Para suporte: suporte@kealabs.com | (11) 9999-9999</p>
            </div>
        </body>
        </html>
        """
        
        # Salvar HTML
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        print(f"HTML gerado com sucesso: {html_file}")
        print(f"Tamanho: {html_file.stat().st_size / 1024:.1f} KB")
        print()
        print("Para gerar PDF:")
        print("1. Abra o arquivo HTML no navegador")
        print("2. Pressione Ctrl+P (Imprimir)")
        print("3. Selecione 'Salvar como PDF'")
        print("4. Configure:")
        print("   - Tamanho: A4")
        print("   - Margens: Padrao")
        print("   - Graficos de fundo: Ativado")
        print("5. Clique em 'Salvar'")
        
        return True
        
    except Exception as e:
        print(f"Erro ao gerar HTML: {e}")
        return False

if __name__ == "__main__":
    print("Gerador de HTML para PDF")
    print("=" * 40)
    
    success = create_pdf_html()
    if success:
        print("\nHTML criado com sucesso!")
        print("Abra o arquivo HTML no navegador e imprima como PDF")
    else:
        print("\nFalha ao gerar HTML")