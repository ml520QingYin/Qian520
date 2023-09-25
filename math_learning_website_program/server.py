import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("本地服务器正在运行，访问 http://localhost:" + str(PORT))
    httpd.serve_forever()
