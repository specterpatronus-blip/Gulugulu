import os
import re

directories = ['c:/Users/Luis/Documentos/TEMPORAL LUISMI/GULUGULU/Gulugulu-main/Gulugulu-main/templates', 'c:/Users/Luis/Documentos/TEMPORAL LUISMI/GULUGULU/Gulugulu-main/Gulugulu-main/templates/juegos']

skip_files = ['index.html', 'results.html', 'minijuegos.html']

for directory in directories:
    for filename in os.listdir(directory):
        if filename.endswith(".html") and filename not in skip_files:
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            
            # Check if script is included
            if 'fullscreen.js' not in content:
                # Add script just before </head>
                content = content.replace('</head>', '    <script src="/static/js/fullscreen.js"></script>\n</head>')
                modified = True
            
            # Check if hide-mobile is in styles
            if '.hide-mobile' not in content and '</style>' in content:
                style_addition = """
        @media (max-width: 768px) {
            .hide-mobile {
                display: none;
            }
        }
"""
                content = content.replace('</style>', style_addition + '</style>')
                modified = True
            
            # Now let's try to find the header and replace it
            if 'toggleFullScreen()' not in content:
                # Most files have:
                # <header class="header">
                #   <a href="/" class="logo">...</a>
                #   <a href="..." class="header-link">...</a>
                # </header>
                header_match = re.search(r'<header class="header">(.*?)</header>', content, re.DOTALL)
                if header_match:
                    inner_html = header_match.group(1)
                    
                    # Usually looks like:
                    # <a href="/" class="logo">...</a>
                    # <a href="/minijuegos" class="header-link">...</a>
                    
                    # Split into logo and other links
                    links = re.findall(r'<a.*?class="header-link".*?>.*?</a>', inner_html, re.DOTALL)
                    if links:
                        # Replace the old links with wrapped flex div
                        links_html = '\n'.join(links)
                        
                        fullscreen_btn = """
        <div style="display: flex; gap: 12px; align-items: center;">
            <button onclick="toggleFullScreen()" class="header-link" style="cursor: pointer; font-family: inherit; background: rgba(255, 255, 255, 0.4); border: 1px solid rgba(0, 0, 0, 0.05);">
                <span class="material-symbols-outlined" id="fullscreenIcon"
                    style="font-size:18px;font-variation-settings:'FILL' 0,'wght' 400">fullscreen</span>
                <span id="fullscreenText" class="hide-mobile">Pantalla Completa</span>
            </button>
"""
                        new_links_html = fullscreen_btn + links_html + "\n        </div>"
                        
                        # Remove the old links from inner_html
                        new_inner_html = inner_html
                        for link in links:
                            new_inner_html = new_inner_html.replace(link, '')
                            
                        # Add the new wrapper
                        new_inner_html = new_inner_html.rstrip() + "\n" + new_links_html + "\n    "
                        
                        content = content.replace(inner_html, new_inner_html)
                        modified = True
                        
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filename}")
