"""Tiny PIL-only helpers: push-pull hole filling and mask utilities."""
from PIL import Image, ImageChops, ImageFilter, ImageMath


def binarize(mask, threshold=20):
    return mask.point(lambda v: 255 if v > threshold else 0)


def dilate(mask, px):
    return mask.filter(ImageFilter.MaxFilter(px * 2 + 1)) if px > 0 else mask


def erode(mask, px):
    return mask.filter(ImageFilter.MinFilter(px * 2 + 1)) if px > 0 else mask


def push_pull_fill(rgb, hole, exclude=None, extra_sources=None):
    """Fill `hole` (L, 255 = unknown) with a smooth field grown from its border.

    Float pyramid: each level box-downsamples premultiplied colour and weight
    separately (no 8-bit premultiply rounding at sparse coarse levels), and the
    coarse field shows through wherever a finer level has little weight.
    """
    known = ImageChops.invert(hole)
    source = known if exclude is None else ImageChops.subtract(known, exclude)
    if extra_sources is not None:
        source = ImageChops.lighter(source, extra_sources)
    w = source.convert("F")
    chans = [ImageMath.lambda_eval(lambda a: a["c"] * a["w"] / 255.0, c=c.convert("F"), w=w)
             for c in rgb.convert("RGB").split()]
    levels = [(chans, w)]
    while min(levels[-1][1].size) > 2:
        cs, ww = levels[-1]
        size = (max(1, ww.size[0] // 2), max(1, ww.size[1] // 2))
        levels.append(([c.resize(size, Image.BOX) for c in cs], ww.resize(size, Image.BOX)))

    def colour(cs, ww):
        return [ImageMath.lambda_eval(lambda a: a["c"] * 255.0 / (a["w"] + 1e-6), c=c, w=ww)
                for c in cs]

    cur = colour(*levels[-1])
    for cs, ww in reversed(levels[:-1]):
        up = [c.resize(ww.size, Image.BILINEAR) for c in cur]
        own = colour(cs, ww)
        # weight 255 -> own colour, 0 -> coarse colour
        cur = [ImageMath.lambda_eval(
            lambda a: a["o"] * a["w"] / 255.0 + a["u"] * (1 - a["w"] / 255.0), o=o, u=u, w=ww)
            for o, u in zip(own, up)]
    out = Image.merge("RGB", [c.convert("L") for c in cur])
    return Image.composite(rgb.convert("RGB"), out, known)


def add_grain(img, mask, amount=6, seed=7):
    """Deterministic luminance grain inside `mask` so fills don't look plastic."""
    import random

    rnd = random.Random(seed)
    noise = Image.new("L", img.size)
    noise.putdata([128 + rnd.randint(-amount, amount) for _ in range(img.size[0] * img.size[1])])
    noise = noise.filter(ImageFilter.GaussianBlur(0.6))
    grain = Image.merge("RGB", (noise, noise, noise))
    mid = Image.new("RGB", img.size, (128,) * 3)
    pos = ImageChops.subtract(grain, mid)  # max(noise - 128, 0)
    neg = ImageChops.subtract(mid, grain)  # max(128 - noise, 0)
    grained = ImageChops.subtract(ImageChops.add(img, pos), neg)
    return Image.composite(grained, img, mask)
