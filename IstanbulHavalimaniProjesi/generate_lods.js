import { Document, NodeIO } from '@gltf-transform/core';
import { simplify } from '@gltf-transform/functions';
import fs from 'fs';
import path from 'path';

const io = new NodeIO();
// io.registerExtensions([Meshoptimizer]); satırı KALDIRILDI.

// 5 adet LOD dosyası oluşturmak için kullanılacak basitleştirme oranları
const LOD_CONFIG = [
    { level: 1, ratio: 0.05, name: 'LOD1.glb' },
    { level: 2, ratio: 0.15, name: 'LOD2.glb' },
    { level: 3, ratio: 0.35, name: 'LOD3.glb' },
    { level: 4, ratio: 0.60, name: 'LOD4.glb' },
    { level: 5, ratio: 1.0, name: 'LOD5.glb' }
].reverse();

async function generateLods(inputPath, outputDir) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Girdi dosyası bulunamadı: ${inputPath}`);
    }

    const document = await io.read(inputPath);
    console.log(`GLB başarıyla okundu. İşlem dizini: ${outputDir}`);

    const promises = LOD_CONFIG.map(async (config) => {
        const docCopy = await io.read(inputPath);

        if (config.ratio < 1.0) {
            await docCopy.transform(
                simplify({ // simplify kullanılıyor
                    ratio: config.ratio,
                })
            );
        }

        const outputPath = path.join(outputDir, config.name);
        await io.write(outputPath, docCopy);
        console.log(`Başarıyla oluşturuldu: ${config.name} (oran: ${config.ratio})`);
    });

    await Promise.all(promises);
    console.log('Tüm LOD dosyaları başarıyla oluşturuldu.');
}

const [, , inputGlb, outputFolder] = process.argv;

if (!inputGlb || !outputFolder) {
    console.error('Kullanım: node generate_lods.js <girdi_glb_yolu> <çıktı_dizini_yolu>');
    process.exit(1);
}

generateLods(inputGlb, outputFolder).catch(err => {
    console.error('Hata oluştu:', err);
    process.exit(1);
});