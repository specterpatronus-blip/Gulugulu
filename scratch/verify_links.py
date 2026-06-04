import urllib.request
import urllib.error
import sys

def test_url(url):
    print(f"Testing URL: {url} ... ", end="")
    try:
        response = urllib.request.urlopen(url)
        status = response.getcode()
        if status == 200:
            print("OK (200)")
            return True
        else:
            print(f"FAILED (Status: {status})")
            return False
    except urllib.error.HTTPError as e:
        print(f"FAILED (HTTPError: {e.code})")
        return False
    except Exception as e:
        print(f"FAILED (Error: {str(e)})")
        return False

if __name__ == "__main__":
    base_url = "http://localhost:5000"
    urls = [
        f"{base_url}/",
        f"{base_url}/minijuegos",
        f"{base_url}/juego/1/1",
        f"{base_url}/juego/2/1",
        f"{base_url}/juego/3/1",
        f"{base_url}/juego/4/1",
        f"{base_url}/juego/5/1",
    ]
    
    success = True
    for url in urls:
        if not test_url(url):
            success = False
            
    if not success:
        sys.exit(1)
    print("All endpoint tests passed!")
