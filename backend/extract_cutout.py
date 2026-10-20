from PIL import Image, ImageFilter
from collections import deque

img = Image.open('../src/images/about.jpg')
w, h = img.size
rgb = img.tobytes()

is_bg = bytearray(w * h)

for i in range(w * h):
    idx = i * 3
    r = rgb[idx]
    g = rgb[idx+1]
    b = rgb[idx+2]
    # Neutral grey check with slightly wider tolerance for JPEG artifacts
    if abs(r - g) <= 10 and abs(g - b) <= 10 and abs(r - b) <= 10:
        if 125 <= r <= 228:
            is_bg[i] = 1

# BFS from borders
visited = bytearray(w * h)
queue = deque()

def push(x, y):
    idx = y * w + x
    if is_bg[idx] and not visited[idx]:
        visited[idx] = 1
        queue.append((x, y))

for x in range(w):
    push(x, 0)
    push(x, h - 1)
for y in range(h):
    push(0, y)
    push(w - 1, y)

while queue:
    x, y = queue.popleft()
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h:
            nidx = ny * w + nx
            if is_bg[nidx] and not visited[nidx]:
                visited[nidx] = 1
                queue.append((nx, ny))

alpha_bytes = bytearray(w * h)
for i in range(w * h):
    alpha_bytes[i] = 0 if visited[i] else 255

alpha = Image.frombytes('L', (w, h), bytes(alpha_bytes))
# Soft blur on edge
alpha_smooth = alpha.filter(ImageFilter.GaussianBlur(radius=1.0))

rgba = img.convert('RGBA')
rgba.putalpha(alpha_smooth)
rgba.save('../src/images/about.png', 'PNG')
rgba.save('../src/images/about.webp', 'WEBP', quality=95)
print('Pristine transparent cutout saved to about.png and about.webp!')
