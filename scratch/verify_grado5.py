import urllib.request
import sys

def check_url(url, expected_snippets):
    print(f"Checking URL: {url} ...")
    try:
        with urllib.request.urlopen(url) as response:
            html = response.read().decode('utf-8')
            status = response.status
            if status != 200:
                print(f"FAIL: Status code is {status}")
                return False
            
            for snippet in expected_snippets:
                if snippet not in html:
                    print(f"FAIL: Snippet '{snippet}' not found in HTML output!")
                    # Print a portion of HTML to debug
                    print("--- HTML Preview ---")
                    print(html[:1000])
                    print("--------------------")
                    return False
            print("PASS")
            return True
    except Exception as e:
        print(f"ERROR requesting {url}: {e}")
        return False

def main():
    base_url = "http://127.0.0.1:5000"
    
    # 1. Verify that GIconEngine is injected in HTML
    # 2. Verify that Vue templates call the dynamic engine methods
    tests = [
        (
            f"{base_url}/juego/5/3", 
            [
                '<script src="/static/js/game-icons.js"></script>',
                'GIconEngine.fromEmojiHtml(s.split(\' \')[0], { size: 20 })'
            ]
        ),
        (
            f"{base_url}/juego/5/6", 
            [
                '<script src="/static/js/game-icons.js"></script>',
                'GIconEngine.fromEmojiHtml(o.split(\' \').pop(), { size: 24 })'
            ]
        ),
        (
            f"{base_url}/juego/5/8", 
            [
                '<script src="/static/js/game-icons.js"></script>',
                "GIconEngine.html('check', { size: 20 })"
            ]
        ),
        (
            f"{base_url}/juego/5/10", 
            [
                '<script src="/static/js/game-icons.js"></script>',
                "GIconEngine.html('atom', { size: 20 })"
            ]
        )
    ]
    
    success = True
    for url, snippets in tests:
        if not check_url(url, snippets):
            success = False
            
    if success:
        print("\nALL URL VERIFICATIONS PASSED SUCCESSFULLY!")
        sys.exit(0)
    else:
        print("\nSOME VERIFICATIONS FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    main()
