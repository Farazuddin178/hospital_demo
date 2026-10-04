# Generates every logo asset the site uses from one source image.
#
#   powershell -ExecutionPolicy Bypass -File scripts/make-logo-assets.ps1
#
# Input:   assets/brand/oxygen-logo-source.jpg  (the official logo, white background)
# Outputs: public/logo.png        header/footer logo, transparent outside the shield
#          src/app/icon.png       192x192 browser icon (Next.js file convention)
#          src/app/apple-icon.png 180x180 home-screen icon, white background
#          src/app/favicon.ico    16/32/48 multi-size favicon
#
# Windows-only (uses System.Drawing). Re-run it whenever the logo changes.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class LogoTool
{
    // Treat anything this close to white as background when locating the shield.
    const int BgThreshold = 236;

    static byte[] Read(Bitmap b, out int stride)
    {
        var d = b.LockBits(new Rectangle(0, 0, b.Width, b.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        stride = d.Stride;
        var buf = new byte[stride * b.Height];
        Marshal.Copy(d.Scan0, buf, 0, buf.Length);
        b.UnlockBits(d);
        return buf;
    }

    static Bitmap Write(byte[] buf, int w, int h, int stride)
    {
        var b = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        var d = b.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
        Marshal.Copy(buf, 0, d.Scan0, buf.Length);
        b.UnlockBits(d);
        return b;
    }

    // Crop to the shield, then make the white OUTSIDE the shield transparent.
    // The white INSIDE the shield stays opaque, so the logo still reads on dark.
    public static Bitmap Extract(string path)
    {
        Bitmap src;
        using (var raw = new Bitmap(path))
        {
            src = new Bitmap(raw.Width, raw.Height, PixelFormat.Format32bppArgb);
            using (var g = Graphics.FromImage(src)) g.DrawImage(raw, 0, 0, raw.Width, raw.Height);
        }

        int stride; var px = Read(src, out stride);
        int W = src.Width, H = src.Height;
        int minX = W, minY = H, maxX = 0, maxY = 0;
        for (int y = 0; y < H; y++) for (int x = 0; x < W; x++)
        {
            int i = y * stride + x * 4;
            if (px[i] < BgThreshold || px[i + 1] < BgThreshold || px[i + 2] < BgThreshold)
            { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
        }
        const int m = 4;
        minX = Math.Max(0, minX - m); minY = Math.Max(0, minY - m);
        maxX = Math.Min(W - 1, maxX + m); maxY = Math.Min(H - 1, maxY + m);
        int cw = maxX - minX + 1, ch = maxY - minY + 1;

        var c = new byte[cw * ch * 4];
        for (int y = 0; y < ch; y++)
            Buffer.BlockCopy(px, (y + minY) * stride + minX * 4, c, y * cw * 4, cw * 4);
        src.Dispose();

        // Flood fill the near-white region connected to the image border: that is "outside".
        var outside = new bool[cw * ch];
        var q = new Queue<int>();
        Func<int, bool> nearWhite = k => c[k * 4] >= 225 && c[k * 4 + 1] >= 225 && c[k * 4 + 2] >= 225;
        for (int x = 0; x < cw; x++) { foreach (int y in new[] { 0, ch - 1 }) { int k = y * cw + x; if (!outside[k] && nearWhite(k)) { outside[k] = true; q.Enqueue(k); } } }
        for (int y = 0; y < ch; y++) { foreach (int x in new[] { 0, cw - 1 }) { int k = y * cw + x; if (!outside[k] && nearWhite(k)) { outside[k] = true; q.Enqueue(k); } } }
        while (q.Count > 0)
        {
            int k = q.Dequeue(); int x = k % cw, y = k / cw;
            int[] n = { x > 0 ? k - 1 : -1, x < cw - 1 ? k + 1 : -1, y > 0 ? k - cw : -1, y < ch - 1 ? k + cw : -1 };
            foreach (int j in n) if (j >= 0 && !outside[j] && nearWhite(j)) { outside[j] = true; q.Enqueue(j); }
        }

        // Outside -> fully transparent. The anti-aliased rim right next to it gets
        // "colour to alpha" against white, so the edge stays smooth on any background
        // instead of leaving a pale halo.
        var rim = new bool[cw * ch];
        for (int y = 0; y < ch; y++) for (int x = 0; x < cw; x++)
        {
            int k = y * cw + x; if (outside[k]) continue;
            for (int dy = -2; dy <= 2 && !rim[k]; dy++) for (int dx = -2; dx <= 2; dx++)
            {
                int xx = x + dx, yy = y + dy;
                if (xx >= 0 && yy >= 0 && xx < cw && yy < ch && outside[yy * cw + xx]) { rim[k] = true; break; }
            }
        }
        for (int k = 0; k < cw * ch; k++)
        {
            int i = k * 4;
            if (outside[k]) { c[i] = c[i + 1] = c[i + 2] = c[i + 3] = 0; continue; }
            if (!rim[k]) continue;
            int b = c[i], g = c[i + 1], r = c[i + 2];
            double a = Math.Max(255 - r, Math.Max(255 - g, 255 - b)) / 255.0;
            if (a <= 0.01) { c[i] = c[i + 1] = c[i + 2] = c[i + 3] = 0; continue; }
            Func<int, byte> un = v => (byte)Math.Max(0, Math.Min(255, Math.Round((v - 255 * (1 - a)) / a)));
            c[i] = un(b); c[i + 1] = un(g); c[i + 2] = un(r); c[i + 3] = (byte)Math.Round(a * 255);
        }
        return Write(c, cw, ch, cw * 4);
    }

    // High-quality downscale. Halves first so big reductions don't alias.
    public static Bitmap Resize(Bitmap img, int w, int h)
    {
        Bitmap cur = img; bool own = false;
        while (cur.Width / 2 >= w * 2 && cur.Height / 2 >= h * 2)
        {
            var next = Draw(cur, cur.Width / 2, cur.Height / 2);
            if (own) cur.Dispose(); cur = next; own = true;
        }
        var result = Draw(cur, w, h);
        if (own) cur.Dispose();
        return result;
    }

    static Bitmap Draw(Bitmap img, int w, int h)
    {
        var dst = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (var g = Graphics.FromImage(dst))
        using (var attrs = new ImageAttributes())
        {
            g.CompositingMode = CompositingMode.SourceCopy;
            g.CompositingQuality = CompositingQuality.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.SmoothingMode = SmoothingMode.HighQuality;
            attrs.SetWrapMode(WrapMode.TileFlipXY); // stops dark fringes at the edges
            g.DrawImage(img, new Rectangle(0, 0, w, h), 0, 0, img.Width, img.Height, GraphicsUnit.Pixel, attrs);
        }
        return dst;
    }

    // Fit the logo into a square with padding, on a transparent or solid background.
    public static Bitmap Square(Bitmap logo, int size, double pad, Color? bg)
    {
        int box = (int)Math.Round(size * (1 - 2 * pad));
        double s = Math.Min((double)box / logo.Width, (double)box / logo.Height);
        int w = Math.Max(1, (int)Math.Round(logo.Width * s)), h = Math.Max(1, (int)Math.Round(logo.Height * s));
        using (var scaled = Resize(logo, w, h))
        {
            var dst = new Bitmap(size, size, PixelFormat.Format32bppArgb);
            using (var g = Graphics.FromImage(dst))
            {
                g.Clear(bg ?? Color.Transparent);
                g.CompositingMode = CompositingMode.SourceOver;
                g.DrawImage(scaled, (size - w) / 2, (size - h) / 2, w, h);
            }
            return dst;
        }
    }

    public static void SavePng(Bitmap b, string path) { b.Save(path, ImageFormat.Png); }

    // ICO files may embed PNG images directly (supported since Windows Vista / all
    // current browsers), which keeps full alpha at every size.
    public static void SaveIco(Bitmap logo, int[] sizes, string path)
    {
        var pngs = new List<byte[]>();
        foreach (int s in sizes)
            using (var sq = Square(logo, s, 0.02, null))
            using (var ms = new MemoryStream()) { sq.Save(ms, ImageFormat.Png); pngs.Add(ms.ToArray()); }

        using (var fs = new FileStream(path, FileMode.Create))
        using (var w = new BinaryWriter(fs))
        {
            w.Write((ushort)0); w.Write((ushort)1); w.Write((ushort)sizes.Length);
            int offset = 6 + 16 * sizes.Length;
            for (int i = 0; i < sizes.Length; i++)
            {
                w.Write((byte)(sizes[i] >= 256 ? 0 : sizes[i]));
                w.Write((byte)(sizes[i] >= 256 ? 0 : sizes[i]));
                w.Write((byte)0); w.Write((byte)0);
                w.Write((ushort)1); w.Write((ushort)32);
                w.Write(pngs[i].Length); w.Write(offset);
                offset += pngs[i].Length;
            }
            foreach (var p in pngs) w.Write(p);
        }
    }
}
"@

$source = Join-Path $root "assets/brand/oxygen-logo-source.jpg"
$logo = [LogoTool]::Extract($source)
"shield extracted: $($logo.Width) x $($logo.Height)"

# Header/footer logo. Displayed ~44px tall, so 176px covers 4x screens.
$h = 176
$w = [int][Math]::Round($logo.Width * $h / $logo.Height)
$header = [LogoTool]::Resize($logo, $w, $h)
[LogoTool]::SavePng($header, (Join-Path $root "public/logo.png")); $header.Dispose()
"public/logo.png        $w x $h"

# Larger copy for the social share card. Kept outside /public: it is only read
# at build time by src/app/opengraph-image.tsx, never served on its own.
$ogH = 352
$ogW = [int][Math]::Round($logo.Width * $ogH / $logo.Height)
$og = [LogoTool]::Resize($logo, $ogW, $ogH)
[LogoTool]::SavePng($og, (Join-Path $root "assets/brand/logo-og.png")); $og.Dispose()
"assets/brand/logo-og.png $ogW x $ogH"

$icon = [LogoTool]::Square($logo, 192, 0.03, $null)
[LogoTool]::SavePng($icon, (Join-Path $root "src/app/icon.png")); $icon.Dispose()
"src/app/icon.png       192 x 192"

# iOS fills transparency with black and rounds the corners itself, so this one
# gets a white background and more breathing room.
$apple = [LogoTool]::Square($logo, 180, 0.10, [System.Drawing.Color]::White)
[LogoTool]::SavePng($apple, (Join-Path $root "src/app/apple-icon.png")); $apple.Dispose()
"src/app/apple-icon.png 180 x 180"

[LogoTool]::SaveIco($logo, @(16, 32, 48), (Join-Path $root "src/app/favicon.ico"))
"src/app/favicon.ico    16/32/48"

$logo.Dispose()
