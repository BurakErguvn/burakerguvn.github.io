// Prebuild: GitHub avatarını indirip public/avatar.jpg'ye yazar (self-host).
// Ağ hatasında mevcut dosyayı korur, build'i durdurmaz.
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const USER = "burakerguvn";
const SIZE = 512;
const URL = `https://github.com/${USER}.png?s=${SIZE}`;
const OUT = path.join(process.cwd(), "public", "avatar.jpg");

async function main() {
  try {
    const res = await fetch(URL, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!existsSync(path.dirname(OUT))) {
      await mkdir(path.dirname(OUT), { recursive: true });
    }
    await writeFile(OUT, buf);
    console.log(`[fetch-avatar] ${USER} avatar saved -> ${OUT} (${buf.length} bytes)`);
  } catch (err) {
    if (existsSync(OUT)) {
      console.warn(`[fetch-avatar] fetch failed, keeping existing avatar: ${err.message}`);
    } else {
      console.warn(`[fetch-avatar] fetch failed and no existing avatar: ${err.message}`);
      // yer tutucu 1x1 PNG yaz ki build kırılmasın
      await writeFile(
        OUT,
        Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
          "base64"
        )
      );
    }
  }
}

main();
