"""Make the 3 AImigo clean plates: remove the title text from inside the
panel's dotted border. The cyan frame, the dots and the logo that overlaps
the frame stay untouched.

- landscape: the S1E6 YouTube thumbnail (1280x720) -> template/plate.png;
  also removes three stray white ticks the generator left under the text.
- square: the S1E7 square cover (1254x1254, the owner's original export) ->
  template/sq/plate.png at 1400x1400; also removes the red/cyan splashes
  inside the panel (they sit on the title's second line) and restores the two
  border dots that the «р» descender of «сентябрь» covered.

The panel interior is a flat dark violet with a faint vertical gradient, so
each row is refilled with the median of its text-free margins (left and
right of the text), interpolated across the row. Near the bottom corners the
margins hit border dots; those rows reuse the last clean row.
Usage: python3 clean_plate.py landscape s1e6.jpg plate.png
       python3 clean_plate.py square s1e7-square.png sq/plate.png"""
import statistics
import sys
from PIL import Image, ImageDraw, ImageFilter
from imgfill import dilate, push_pull_fill

LAYOUTS = {
    # interior inside the dots (X0, Y0, X1, Y1, corner radius) and text-free margins
    "landscape": dict(box=(237, 228, 1042, 326, 10), left=range(242, 272), right=range(1010, 1038)),
    "square": dict(box=(231, 390, 1022, 530, 22), left=range(233, 248), right=range(1009, 1018)),
}
SQUARE_SIZE = 1400

layout, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
spec = LAYOUTS[layout]
rgb = Image.open(src).convert("RGB")
W, H = rgb.size
X0, Y0, X1, Y1, R = spec["box"]
LEFT, RIGHT = spec["left"], spec["right"]
dark = lambda p: (p[0] * 3 + p[1] * 6 + p[2]) / 10 < 30

px = rgb.load()
fill = rgb.copy()
fp = fill.load()
prev = None
for y in range(Y0, Y1 + 1):
    def med(xs):
        ps = [px[x, y] for x in xs]
        if layout == "square":
            ps = [p for p in ps if dark(p)]
            if len(ps) < len(xs) // 2:
                return None
        return tuple(round(statistics.median(p[c] for p in ps)) for c in range(3))
    l, r = med(LEFT), med(RIGHT)
    if l is None or r is None:
        l, r = prev
    prev = (l, r)
    for x in range(X0, X1 + 1):
        t = (x - X0) / (X1 - X0)
        fp[x, y] = tuple(round(l[c] * (1 - t) + r[c] * t) for c in range(3))
# Grain like the rest of the panel instead of a dead-flat field.
fill = fill.filter(ImageFilter.GaussianBlur(1.2))
hole = Image.new("L", (W, H), 0)
ImageDraw.Draw(hole).rounded_rectangle((X0, Y0, X1, Y1), R, fill=255)
out_img = Image.composite(fill, rgb, hole)

if layout == "landscape":
    # Stray ticks between the dots and the cyan frame (y 328).
    ticks = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(ticks)
    for x0, x1 in ((447, 454), (752, 759), (845, 852)):
        d.rectangle((x0, 326, x1, 330), fill=255)
    out_img = push_pull_fill(out_img, dilate(ticks, 1))
else:
    # The descender covered the dots at x 760 and 771 of the bottom row
    # (period ~10.8 px): copy the two dots two periods to the left.
    out_img.paste(out_img.crop((731, 528, 754, 544)), (753, 528))
    out_img = out_img.resize((SQUARE_SIZE, SQUARE_SIZE), Image.LANCZOS)
out_img.save(out)
print(out, out_img.size)
