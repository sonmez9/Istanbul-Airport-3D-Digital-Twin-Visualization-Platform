// Web uygulamasý oluþturmak için bir 'builder' nesnesi yaratýlýr.
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Maksimum istek gövdesi boyutunu 500 MB'a ayarla (500 * 1024 * 1024)
    // 3D modelleriniz daha büyükse bu deðeri artýrabilirsiniz.
    serverOptions.Limits.MaxRequestBodySize = 524288000;
});
// Bu bölüme servis eklemeleri yapýlabilir (örneðin MVC, Razor Pages, veritabaný vb.).
// Projeniz þu an için çok basit olduðundan bu kýsýmda ek bir ayar yapmamýza gerek yok.
builder.Services.AddControllersWithViews(); // Eðer ileride Controller kullanacaksanýz bu satýr kalabilir.
// 'builder' kullanýlarak uygulama ('app') nesnesi oluþturulur.
var app = builder.Build();

// Geliþtirme ortamýnda olup olmadýðýmýzý kontrol eden standart bir ayar.
// Hata ayýklamayý kolaylaþtýrýr.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Gelen HTTP isteklerini HTTPS'e yönlendirir. Güvenlik için önemlidir.
app.UseHttpsRedirection();

// ----- EN ÖNEMLÝ KISIM -----
// Bu satýr, projenizdeki 'wwwroot' klasörünün içindeki dosyalarýn (HTML, CSS, JS, resimler, 3D modeller vb.)
// web tarayýcýsý tarafýndan eriþilebilir olmasýný saðlar.
// Modelinizin 404 hatasý almasýnýn sebebi muhtemelen bu satýrýn eksik olmasýdýr.
// ----- GÜNCELLENMÝÞ KISIM -----

// StaticFileOptions nesnesi oluþturarak özel ayarlar tanýmlýyoruz.
var staticFileOptions = new StaticFileOptions
{
    // Ýçerik tiplerini (MIME types) yönetmek için bir saðlayýcý ekliyoruz.
    ContentTypeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider
    {
        // '.glb' uzantýsý için 'model/gltf-binary' MIME tipini eþleþtiriyoruz.
        // Bu, sunucunun .glb dosyalarýný doðru bir þekilde tanýmasýný ve sunmasýný saðlar.
        Mappings =
        {
            [".glb"] = "model/gltf-binary",
            // YENÝ EKLEME: 3D Tiles B3DM formatý için doðru MIME tipi.
            [".b3dm"] = "application/octet-stream", 
            // Veya Cesium'un önerdiði daha spesifik MIME tipi:
            // [".b3dm"] = "application/vnd.cesium.b3dm" 
            // Güvenlik için ilkini (application/octet-stream) kullanalým.

            [".json"] = "application/json", // tileset.json için gerekebilir (genellikle varsayýlan olarak eklenir)
            
            // Eðer isterseniz, I3DM için de ekleyebilirsiniz:
            // [".i3dm"] = "application/octet-stream" 
            
            // glTF dosyalarýnýn diðer parçalarý için de eklenebilir
            // [".bin"] = "application/octet-stream"
        }
    }
};

// Statik dosyalarý, yukarýda oluþturduðumuz özel seçeneklerle birlikte sunmasýný söylüyoruz.
app.UseStaticFiles(staticFileOptions);
// Yönlendirme (routing) mekanizmasýný aktif eder.
app.UseRouting();

// Yetkilendirme (authorization) mekanizmasýný aktif eder.
app.UseAuthorization();
// Varsayýlan olarak bir ana sayfa (index.html) sunmak için bu ayarý yapabiliriz.
// Bu ayar, tarayýcýdan gelen istekleri wwwroot içindeki index.html dosyasýna yönlendirir.
app.MapControllers();
app.MapFallbackToFile("index.html");

// Uygulamayý çalýþtýrýr.
app.Run();