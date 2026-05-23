import os
import sys
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_text_color(47, 107, 60) # primary color (#2F6B3C)
            self.set_font('CustomArial', 'B', 8)
            self.cell(0, 10, 'Toprağa Dönüş - Harezmi Eğitim Modeli Kılavuzu', border='B', ln=1, align='L')
            self.ln(5)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_text_color(107, 100, 88) # muted text (#6B6458)
            self.set_font('CustomArial', '', 8)
            self.cell(0, 10, f'Sayfa {self.page_no()}', align='C')

def create_guide_pdf():
    # Find a Turkish-compatible Unicode font on macOS
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/Library/Fonts/Supplemental/Times New Roman.ttf"
    ]
    
    font_path = None
    for path in font_paths:
        if os.path.exists(path):
            font_path = path
            break
            
    if not font_path:
        print("Uyarı: macOS Türkçe destekli sistem fontu bulunamadı. Standart font kullanılacak.")
        
    pdf = PDF()
    
    # Register Unicode font with Turkish characters support
    if font_path:
        pdf.add_font("CustomArial", "", font_path)
        # Check bold font as well
        bold_path = font_path.replace(".ttf", " Bd.ttf").replace("Arial.ttf", "Arial Bold.ttf")
        if os.path.exists(bold_path):
            pdf.add_font("CustomArial", "B", bold_path)
        else:
            pdf.add_font("CustomArial", "B", font_path) # Fallback to normal if bold not found
    else:
        pdf.add_font("CustomArial", "", "Helvetica")
        pdf.add_font("CustomArial", "B", "Helvetica-Bold")
        
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # ------------------ PAGE 1: COVER PAGE ------------------
    pdf.add_page()
    
    # Decorative Top Bar
    pdf.set_fill_color(47, 107, 60) # primary #2F6B3C
    pdf.rect(0, 0, 210, 25, 'F')
    
    pdf.ln(35)
    
    # Harezmi Logo Tag
    pdf.set_text_color(122, 78, 45) # secondary #7A4E2D
    pdf.set_font('CustomArial', 'B', 14)
    pdf.cell(0, 10, 'HAREZMI EGITIM MODELI PROJESI', ln=1, align='C')
    
    pdf.ln(10)
    
    # Title
    pdf.set_text_color(47, 107, 60) # primary
    pdf.set_font('CustomArial', 'B', 28)
    pdf.multi_cell(0, 12, 'TOPRAGA DÖNÜS\nEGITIM KILAVUZU', align='C')
    
    pdf.ln(15)
    
    # Subtitle
    pdf.set_text_color(75, 70, 61) # text-secondary #4B463D
    pdf.set_font('CustomArial', '', 12)
    pdf.multi_cell(0, 6, 'Sürdürülebilir Bir Gelecek Için Okullarda\nAtık Yönetimi, Geri Dönüsüm ve Kompost Uygulamaları Kılavuzu', align='C')
    
    pdf.ln(40)
    
    # Decorative middle line
    pdf.set_draw_color(47, 107, 60)
    pdf.set_line_width(1)
    pdf.line(50, 160, 160, 160)
    
    pdf.ln(45)
    
    # Project Info
    pdf.set_text_color(107, 100, 88) # text-muted
    pdf.set_font('CustomArial', 'B', 10)
    pdf.cell(0, 6, 'Toprağa Dönüş Proje Ekibi', ln=1, align='C')
    pdf.set_font('CustomArial', '', 9)
    pdf.cell(0, 6, '© 2026 - Türkiye Genelinde Çevre Odaklı Sürdürülebilir Eğitim', ln=1, align='C')
    
    # ------------------ PAGE 2: TABLE OF CONTENTS & INTRO ------------------
    pdf.add_page()
    
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 18)
    pdf.cell(0, 10, '1. Projenin Amacı ve Vizyonu', ln=1)
    pdf.ln(5)
    
    pdf.set_text_color(27, 26, 23) # text-primary
    pdf.set_font('CustomArial', '', 11)
    intro_text = (
        "Toprağa Dönüş projesi, Harezmi Eğitim Modeli çerçevesinde, öğrencilerimize çevre bilinci kazandırmayı "
        "ve okullarımızdaki organik/inorganik atıkları doğru yöneterek doğaya katkı sunmayı amaçlayan disiplinler arası "
        "bir çevre hareketidir. Proje kapsamında öğrenciler, sadece atık toplamayı değil; atıkların doğada çözünme "
        "süreçlerini, organik maddelerin kompost yöntemiyle yeniden toprağa dönüşünü ve geri dönüştürülebilir "
        "malzemelerin döngüsel ekonomiye katılımını bizzat deneyimlerler.\n\n"
        "Bu kılavuz, okullarımızdaki koordinatör öğretmenler ve çevre kulübü öğrencileri için adım adım bir yol haritası "
        "sunmaktadır."
    )
    pdf.multi_cell(0, 6, intro_text)
    
    pdf.ln(10)
    
    # Benefits Section
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 14)
    pdf.cell(0, 8, 'Eğitim Kılavuzunun Okullara Kazandırdıkları:', ln=1)
    pdf.ln(3)
    
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 11)
    benefits = [
        "Sıfır Atık Bilinci: Öğrencilerin günlük atık üretimini azaltma ve yönetme alışkanlığı kazanması.",
        "Kompost Deneyimi: Evsel meyve/sebze atıklarının organik gübreye dönüşme sürecini uygulamalı öğrenme.",
        "Disiplinler Arası STEM Yaklaşımı: Biyoloji, kimya, matematik ve teknolojiyi bir arada kullanarak çevre sorunlarına çözümler üretme.",
        "Sosyal Sorumluluk: Okul sınırlarını aşarak çevreye ve topluma yararlı sürdürülebilir bir model oluşturma."
    ]
    for b in benefits:
        pdf.multi_cell(0, 6, f"• {b}")
        pdf.ln(2)
        
    # ------------------ PAGE 3: RECYCLING GUIDE ------------------
    pdf.add_page()
    
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 18)
    pdf.cell(0, 10, '2. Atık Ayrıştırma ve Geri Dönüşüm', ln=1)
    pdf.ln(5)
    
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 11)
    recycling_intro = (
        "Okullarımızda geri dönüşümün başarılı olabilmesi için atıkların kaynağında, yani sınıflarda ve koridorlarda "
        "doğru kutulara atılması şarttır. Sitemizde yer alan Geri Dönüşüm Haritası (/map) ile okulunuza en yakın "
        "atık toplama istasyonlarını bulabilir ve atıklarınızı buralara ulaştırabilirsiniz."
    )
    pdf.multi_cell(0, 6, recycling_intro)
    pdf.ln(5)
    
    # Table Header
    pdf.set_fill_color(231, 242, 234) # primary.soft #E7F2EA
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 10)
    pdf.cell(45, 8, 'Atık Türü', border=1, fill=True)
    pdf.cell(50, 8, 'Kutu Rengi / Yer', border=1, fill=True)
    pdf.cell(95, 8, 'Örnekler & Dikkat Edilmesi Gerekenler', border=1, fill=True, ln=1)
    
    # Table Content
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 9)
    
    table_data = [
        ('Kağıt & Karton', 'Mavi Kutu (Koridorlar)', 'Defter, kitap, karton kutular. Yağlı ambalajlar ATILMAZ.'),
        ('Plastik', 'Sarı Kutu (Kantin/Bahçe)', 'PET şişeler, temiz plastik kaplar. No 1 ve 2 yaygın geri dönüştürülür.'),
        ('Cam', 'Yeşil Kumbara (Okul Bahçesi)', 'Cam şişeler ve kavanozlar. Kapakları metal veya plastiğe ayrılmalıdır.'),
        ('Metal', 'Gri Kutu', 'Metal kutular, konserve ambalajları. Temizlenerek atılmalıdır.'),
        ('Atık Pil', 'Kırmızı Pil Kutusu', 'Kullanılmış piller. Kimyasal sızıntı riski nedeniyle ayrı toplanmalıdır.'),
        ('Atık Yağ', 'Bahçe Toplama Bidonu', 'Kızartma yağları. Lavaboya dökülmesi su kaynaklarını kirletir.')
    ]
    
    for row in table_data:
        pdf.cell(45, 8, row[0], border=1)
        pdf.cell(50, 8, row[1], border=1)
        pdf.cell(95, 8, row[2], border=1, ln=1)
        
    # ------------------ PAGE 4: COMPOST GUIDE ------------------
    pdf.add_page()
    
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 18)
    pdf.cell(0, 10, '3. Adım Adım Kompost Yapımı', ln=1)
    pdf.ln(5)
    
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 11)
    compost_intro = (
        "Kompost, organik atıkların mikroorganizmalar tarafından oksijenli ortamda bozundurularak humus zengini "
        "toprak düzenleyiciye dönüştürülmesi işlemidir. Okulunuzda kompost yaparken karbon ve azot oranını dengelemek "
        "için web sitemizdeki Kompost Lab (/lab) modülünü kullanabilirsiniz."
    )
    pdf.multi_cell(0, 6, compost_intro)
    pdf.ln(5)
    
    # 1. Yeşil (Azot) ve Kahverengi (Karbon) Dengesi
    pdf.set_text_color(122, 78, 45) # secondary
    pdf.set_font('CustomArial', 'B', 12)
    pdf.cell(0, 8, '1. Karbon ve Azot Dengesi (C:N Oranı)', ln=1)
    
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 11)
    pdf.multi_cell(0, 6, "Kompostta sağlıklı ayrışma için ideali 2-3 ölçek kahverengi (karbon) malzemeye karşı 1 ölçek yeşil (azot) malzeme eklemektir.")
    pdf.ln(3)
    
    # Bullet points for green/brown
    pdf.set_font('CustomArial', 'B', 10)
    pdf.cell(95, 6, 'Yeşil (Azot Zengini) Atıklar:', ln=0)
    pdf.cell(95, 6, 'Kahverengi (Karbon Zengini) Atıklar:', ln=1)
    
    pdf.set_font('CustomArial', '', 10)
    green_items = ["- Sebze ve meyve kabukları", "- Kahve telvesi ve çay posası", "- Taze otlar, biçilmiş çim", "- Yumurta kabukları (kalsiyum için ezilmiş)"]
    brown_items = ["- Kuru yapraklar", "- Boyasız karton ve kağıt kırpıntıları", "- Ağaç talaşı ve kuru saman", "- Kurumuş dallar ve bitki sapları"]
    
    max_len = max(len(green_items), len(brown_items))
    for i in range(max_len):
        g = green_items[i] if i < len(green_items) else ""
        b = brown_items[i] if i < len(brown_items) else ""
        pdf.cell(95, 6, g, ln=0)
        pdf.cell(95, 6, b, ln=1)
        
    pdf.ln(5)
    
    # Warning box
    pdf.set_fill_color(253, 242, 242) # light red #FDF2F2
    pdf.set_draw_color(248, 180, 180) # border red
    pdf.set_text_color(180, 35, 24) # red status text
    pdf.set_font('CustomArial', 'B', 10)
    
    # Write warnings
    pdf.cell(0, 6, 'Önemli Uyarı: Komposta Asla Atılmaması Gerekenler', border='TLR', fill=True, ln=1)
    pdf.set_font('CustomArial', '', 9.5)
    pdf.multi_cell(0, 5, "Et, balık, tavuk, kemik, süt ve süt ürünleri (yoğurt, peynir), yağlı yiyecek artıkları, hastalıklı bitki yaprakları, kedi ve köpek dışkıları komposta atılmamalıdır. Kötü koku yapar, sinek çeker ve patojen yayma riski oluşturur.", border='BLR', fill=True)
    
    # ------------------ PAGE 5: PROBLEMS & STEPS ------------------
    pdf.add_page()
    
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 14)
    pdf.cell(0, 8, '2. Kurulum ve Bakım Aşamaları', ln=1)
    pdf.ln(3)
    
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', '', 11)
    steps = [
        "Hazırlık: Kompost kabının tabanına hava alması için 5-10 cm kalınlığında dal parçaları ve çırpı yerleştirin.",
        "Katmanlama: Dal parçalarının üzerine bir kat kahverengi malzeme, ardından bir kat yeşil malzeme ekleyin.",
        "Nemlendirme: Her katmandan sonra karışımı hafifçe nemlendirin (sıkılmış sünger kıvamında olmalıdır).",
        "Havalandırma: Haftada 1 ya da 2 kez karışımı bir kürekle aktararak havalandırın. Oksijen ayrışmayı hızlandırır."
    ]
    for idx, step in enumerate(steps, 1):
        pdf.multi_cell(0, 6, f"{idx}. {step}")
        pdf.ln(2.5)
        
    pdf.ln(5)
    
    # Problem Solving Table
    pdf.set_text_color(47, 107, 60)
    pdf.set_font('CustomArial', 'B', 12)
    pdf.cell(0, 8, '3. Sık Karşılaşılan Kompost Sorunları ve Çözümleri', ln=1)
    pdf.ln(2)
    
    pdf.set_fill_color(243, 239, 231) # background.subtle #F3EFE7
    pdf.set_text_color(27, 26, 23)
    pdf.set_font('CustomArial', 'B', 10)
    pdf.cell(45, 8, 'Belirti', border=1, fill=True)
    pdf.cell(45, 8, 'Olası Neden', border=1, fill=True)
    pdf.cell(100, 8, 'Çözüm Yöntemi', border=1, fill=True, ln=1)
    
    pdf.set_font('CustomArial', '', 9.5)
    troubles = [
        ('Kötü Koku (Çürük yumurta vb.)', 'Fazla nem, havasızlık', 'Kahverengi malzeme ekleyin, aktarıp havalandırın.'),
        ('Amonyak Kokusu', 'Fazla yeşil atık (azot)', 'Kuru yaprak, kağıt veya karton kırpıntısı ilave edin.'),
        ('Sinek ve Böceklenme', 'Açıkta kalan yiyecekler', 'Atıkların üzerini kuru yaprak veya toprakla örtün.'),
        ('Ayrışmama / Yavaşlama', 'Nemsizlik veya soğuk hava', 'Su serpin, kabı güneş alan/ılık bir yere taşıyın.')
    ]
    for t in troubles:
        pdf.cell(45, 8, t[0], border=1)
        pdf.cell(45, 8, t[1], border=1)
        pdf.cell(100, 8, t[2], border=1, ln=1)
        
    # Write PDF to public folder
    public_dir = "./public"
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
        
    output_path = os.path.join(public_dir, "Topraga_Donus_Egitim_Kilavuzu.pdf")
    pdf.output(output_path)
    print(f"Başarılı: PDF Kılavuzu oluşturuldu ve {output_path} adresine kaydedildi.")

if __name__ == "__main__":
    create_guide_pdf()
