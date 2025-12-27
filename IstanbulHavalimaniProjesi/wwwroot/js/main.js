// =================================================================
// 1. YAPILANDIRMA VE SABİTLER
// =================================================================

// --- GÖRÜNTÜLENECEK MODELİ SEÇİN ---
// 'wwwroot/local_models/' altında bulunan ve görüntülemek istediğiniz
// modelin klasör adını buraya yazın.
const activeModelFolder = 'lodlu_binamiz'; // <-- MODEL KLASÖR ADINIZ
// ------------------------------------

// Cesium ION Erişim Token'ınız
Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

// Cesium Görüntüleyicisini (Viewer) oluşturuyoruz.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    infoBox: false
});

viewer.scene.debugShowFramesPerSecond = true;

// Modelin harita üzerinde konumlandırılacağı ortak ayarlar.
const modelSettings = {
    longitude: 28.73815319464649,
    latitude: 41.25898319566813,
    height: 300,
    headingDegrees: 90.0,
    pitchDegrees: 0.0,
    rollDegrees: 0.0,
    modelScale: 20.0
};

// =================================================================
// 2. ARAYÜZ ELEMANLARI (DOM SEÇİMLERİ) - KALDIRILDI
// =================================================================

// const convertBtn = document.getElementById('convertBtn'); // KALDIRILDI
// const fileInput = document.getElementById('fileInput');   // KALDIRILDI
// const statusText = document.getElementById('statusText'); // Sadece console.log kullanacağız.

// =================================================================
// 3. ANA FONKSİYONLAR
// =================================================================

/**
 * Sayfa açıldığında YAPILANDIRMA alanında belirtilen yerel modeli yükleyip konumlandırır.
 */
async function loadAndPositionLocalTileset() {
    if (!activeModelFolder) {
        console.warn("Görüntülenecek bir model seçilmedi. Lütfen main.js dosyasındaki 'activeModelFolder' değişkenini güncelleyin.");
        return;
    }

    try {
        const modelPath = `local_models/${activeModelFolder}/tileset.json`;
        console.log(`Yerel model yükleniyor: ${modelPath}`);

        const tileset = await Cesium.Cesium3DTileset.fromUrl(modelPath);
        viewer.scene.primitives.add(tileset);

        await tileset.readyPromise;
        console.log("Yerel model tamamen hazır.");

        // Modeli 'modelSettings' objesindeki değerlere göre konumlandır.
        const { longitude, latitude, height, headingDegrees, pitchDegrees, rollDegrees, modelScale } = modelSettings;
        const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
        const heading = Cesium.Math.toRadians(headingDegrees);
        const pitch = Cesium.Math.toRadians(pitchDegrees);
        const roll = Cesium.Math.toRadians(rollDegrees);
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

        const positionAndRotationMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);
        const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(modelScale, modelScale, modelScale));
        const modelMatrix = Cesium.Matrix4.multiply(positionAndRotationMatrix, scaleMatrix, new Cesium.Matrix4());

        tileset.root.transform = modelMatrix;
        console.log("Yerel model başarıyla konumlandırıldı.");

        // LOD Hata Ayıklama Ayarları
        tileset.debugShowGeometricError = true;
        tileset.debugShowBoundingVolume = true;

        // Modeli ortala
        viewer.flyTo(tileset, {
            duration: 3,
            offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-45.0), 500.0)
        });

    } catch (error) {
        console.error(`Yerel model (${activeModelFolder}) yüklenirken bir hata oluştu:`, error);
        alert(`'${activeModelFolder}' modeli yüklenirken bir hata oluştu. Konsolu kontrol edin.`);
    }
}

// 4. OLAY DİNLEYİCİLERİ VE UYGULAMA BAŞLANGICI KALDIRILDI

// Sayfa ilk açıldığında seçili olan yerel modeli yükle.
loadAndPositionLocalTileset();