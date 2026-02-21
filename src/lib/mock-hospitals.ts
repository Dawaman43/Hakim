// Mock Hospital & Clinic Data for Hakim - 2000+ Ethiopian Healthcare Facilities

export interface MockHospital {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  emergencyContactNumber: string;
  isActive: boolean;
  type: 'GOVERNMENT' | 'PRIVATE' | 'NGO';
  facilityType: 'HOSPITAL' | 'HEALTH_CENTER' | 'CLINIC' | 'HEALTH_POST' | 'SPECIALIZED_CENTER' | 'PHARMACY' | 'LABORATORY';
  departments: { name: string; avgTime: number; capacity: number }[];
}

// Region coordinates for generating facility locations
const regionCenters: Record<string, { lat: number; lng: number }> = {
  'Addis Ababa': { lat: 9.0320, lng: 38.7469 },
  'Oromia': { lat: 8.5435, lng: 39.2695 },
  'Amhara': { lat: 11.5985, lng: 37.3907 },
  'Tigray': { lat: 14.0363, lng: 38.3085 },
  'SNNPR': { lat: 7.0557, lng: 38.4834 },
  'Afar': { lat: 11.7908, lng: 41.0091 },
  'Somali': { lat: 6.8570, lng: 44.2542 },
  'Benishangul-Gumuz': { lat: 10.4657, lng: 34.5408 },
  'Gambela': { lat: 8.2479, lng: 34.5931 },
  'Harari': { lat: 9.3107, lng: 42.1272 },
  'Dire Dawa': { lat: 9.6008, lng: 41.8555 },
  'Sidama': { lat: 6.7450, lng: 38.4867 },
  'South West Ethiopia': { lat: 7.0089, lng: 36.5667 },
};

// Hospital name patterns
const hospitalPrefixes = ['', 'Regional', 'Zonal', 'District', 'Primary', 'General', 'Referral', 'Specialized', 'Teaching'];
const hospitalSuffixes = ['Hospital', 'Medical Center', 'Medical College'];

// Health Center name patterns
const healthCenterPrefixes = ['', 'Urban', 'Rural', 'Primary', 'Community'];
const healthCenterSuffixes = ['Health Center', 'Health Centre'];

// Clinic name patterns
const clinicPrefixes = ['', 'Private', 'Family', 'Modern', 'City', 'Town', 'Village', 'Holy', 'Grace', 'Hope', 'Life', 'Mercy', 'Saint', 'Blessed'];
const clinicSuffixes = ['Clinic', 'Medical Clinic', 'Health Clinic', 'Poly Clinic', 'Medical Services'];

// Health Post name patterns
const healthPostPrefixes = ['', 'Rural', 'Community', 'Village', 'Kebele'];
const healthPostSuffixes = ['Health Post', 'Health Station'];

// Specialized Center name patterns
const specializedPrefixes = ['Eye', 'Dental', 'Maternal', 'Child', 'Mental', 'Cardiac', 'Cancer', 'Diabetes', 'Renal', 'Orthopedic', 'Women', 'Men', 'Skin'];
const specializedSuffixes = ['Specialized Center', 'Specialist Hospital', 'Center of Excellence', 'Institute'];

// Pharmacy name patterns
const pharmacyPrefixes = ['', 'City', 'Central', 'Community', 'Family', 'Express', 'Quick', 'Health', 'Life', 'Care', 'Medi', 'Pharma', 'Unity', 'Grace', 'Saint', 'Holy', 'Al-Amin', 'Blessed'];
const pharmacySuffixes = ['Pharmacy', 'Drug Store', 'Medical Store', 'Chemist', 'Health Shop', 'Medicine Center'];

// Laboratory name patterns
const laboratoryPrefixes = ['', 'Modern', 'Advanced', 'City', 'Central', 'Premier', 'Express', 'Quick', 'Medical', 'Clinical', 'Diagnostic', 'Health', 'Precision', 'Royal', 'Alpha', 'Beta'];
const laboratorySuffixes = ['Laboratory', 'Medical Laboratory', 'Diagnostic Center', 'Pathology Lab', 'Clinical Lab', 'Medical Diagnostics'];

// NGO/Faith-based patterns
const ngoPrefixes = ['Catholic', 'Orthodox', 'Protestant', 'Mission', 'Charity', 'Community', 'Islamic', 'Red Cross', 'NGO'];

// Department types by facility size
const hospitalDepartments = [
  { name: 'General Medicine', avgTime: 15, capacity: 150 },
  { name: 'Pediatrics', avgTime: 20, capacity: 100 },
  { name: 'Emergency', avgTime: 30, capacity: 50 },
  { name: 'Obstetrics & Gynecology', avgTime: 25, capacity: 80 },
  { name: 'Surgery', avgTime: 30, capacity: 60 },
  { name: 'Orthopedics', avgTime: 25, capacity: 70 },
  { name: 'Ophthalmology', avgTime: 15, capacity: 100 },
  { name: 'ENT', avgTime: 15, capacity: 80 },
  { name: 'Dermatology', avgTime: 10, capacity: 120 },
  { name: 'Cardiology', avgTime: 25, capacity: 50 },
  { name: 'Neurology', avgTime: 25, capacity: 40 },
  { name: 'Psychiatry', avgTime: 30, capacity: 60 },
  { name: 'Dental', avgTime: 20, capacity: 80 },
  { name: 'Laboratory', avgTime: 10, capacity: 200 },
  { name: 'Radiology', avgTime: 15, capacity: 100 },
  { name: 'Pharmacy', avgTime: 5, capacity: 300 },
];

const healthCenterDepartments = [
  { name: 'General Medicine', avgTime: 15, capacity: 80 },
  { name: 'Pediatrics', avgTime: 20, capacity: 50 },
  { name: 'Maternal Health', avgTime: 20, capacity: 40 },
  { name: 'Family Planning', avgTime: 10, capacity: 60 },
  { name: 'Vaccination', avgTime: 10, capacity: 100 },
  { name: 'Laboratory', avgTime: 10, capacity: 80 },
  { name: 'Pharmacy', avgTime: 5, capacity: 150 },
];

const clinicDepartments = [
  { name: 'General Medicine', avgTime: 15, capacity: 50 },
  { name: 'Pediatrics', avgTime: 15, capacity: 30 },
  { name: 'Minor Procedures', avgTime: 20, capacity: 20 },
  { name: 'Pharmacy', avgTime: 5, capacity: 80 },
];

const healthPostDepartments = [
  { name: 'General Medicine', avgTime: 15, capacity: 30 },
  { name: 'Maternal Health', avgTime: 20, capacity: 20 },
  { name: 'Vaccination', avgTime: 10, capacity: 40 },
  { name: 'Family Planning', avgTime: 10, capacity: 30 },
];

const specializedDepartments = [
  { name: 'Specialist Consultation', avgTime: 30, capacity: 40 },
  { name: 'Diagnostic Services', avgTime: 20, capacity: 60 },
  { name: 'Laboratory', avgTime: 15, capacity: 80 },
  { name: 'Pharmacy', avgTime: 5, capacity: 100 },
];

const pharmacyDepartments = [
  { name: 'Prescription Services', avgTime: 5, capacity: 200 },
  { name: 'Over-the-Counter', avgTime: 3, capacity: 300 },
  { name: 'Consultation', avgTime: 10, capacity: 80 },
  { name: 'Health Products', avgTime: 3, capacity: 150 },
];

const laboratoryDepartments = [
  { name: 'Blood Tests', avgTime: 10, capacity: 100 },
  { name: 'Urine Analysis', avgTime: 8, capacity: 120 },
  { name: 'X-Ray Services', avgTime: 15, capacity: 80 },
  { name: 'Ultrasound', avgTime: 20, capacity: 60 },
  { name: 'Pathology', avgTime: 20, capacity: 50 },
];

// Ethiopian cities/towns by region (comprehensive list)
const citiesByRegion: Record<string, string[]> = {
  'Addis Ababa': [
    'Addis Ababa', 'Bole', 'Kazanchis', 'Merkato', 'Piazza', 'Kolfe', 'Nifas Silk', 
    'Gulele', 'Arada', 'Addis Ketema', 'Lideta', 'Kirkos', 'Yeka', 'Bole Bulbula',
    'Summit', 'CMC', 'Hayat', 'Ayat', 'Kotebe', 'Akaki Kality', 'Saris', 'Sar Bet',
    'Gefersa', 'Sendafa', 'Menagesha', 'Burayu', 'Gelan', 'Dukem', 'Bishoftu'
  ],
  'Oromia': [
    'Adama', 'Jimma', 'Bishoftu', 'Nekemte', 'Ambo', 'Waliso', 'Shashamane', 'Bale Robe',
    'Asella', 'Gimbi', 'Nejo', 'Dembi Dollo', 'Gore', 'Metu', 'Bedele', 'Ghimbi',
    'Shambu', 'Fiche', 'Debre Libanos', 'Fitche', 'Burayu', 'Sululta', 'Holeta', 'Sebeta',
    'Sendafa', 'Ziway', 'Batu', 'Butajira', 'Walanchiti', 'Mieso', 'Gewane',
    'Awash', 'Wonji', 'Melka Jebdu', 'Deder', 'Babile', 'Fedis', 'Gursum', 'Moyale',
    'Mega', 'Yabelo', 'Agere Maryam', 'Dodola', 'Kibre Mengist', 'Negele Boran',
    'Adola', 'Wadera', 'Ginir', 'Goba', 'Dinsho', 'Bekoji', 'Asasa', 'Tijo', 'Tiya',
    'Chefe Donsa', 'Bolo', 'Aleltu', 'Derba', 'Chancho', 'Sheno', 'Barak', 'Gohatsion',
    'Ginchi', 'Bako', 'Ijaji', 'Agaro', 'Limu Genet', 'Seka', 'Serbo', 'Asendabo',
    'Limmu', 'Chora', 'Gutto', 'Mendi', 'Nejo', 'Begi', 'Kondala', 'Gawo Dale',
    'Haru', 'Dale Sedi', 'Anfillo', 'Gidami', 'Yubdo', 'Boji Dirmaji', 'Gimbi',
    'Haro Limmu', 'Lalo Kile', 'Yemalogi Welel', 'Sedi Lala', 'Guto Gida', 'Sasiga',
    'Diga', 'Gudeya Bila', 'Wayu Tuka', 'Wama Hagalo', 'Sibu Sire', 'Boneya Boshe',
    'Danno', 'Amuru', 'Jarte Jardega', 'Abe Dongoro', 'Guduru', 'Horo Guduru',
    'Kuyu', 'Wara Jarso', 'Degem', 'Hidabu Abote', 'Muger', 'Bereh', 'Sululta',
    'Bararri', 'Kimbibit', 'Wuchale', 'Mudhi', 'Kotu', 'Gololcha', 'Gaserana',
    'Dawe Kachen', 'Guradamole', 'Meyu Muluke', 'Legehida', 'Dawe Harewa'
  ],
  'Amhara': [
    'Bahir Dar', 'Gondar', 'Dessie', 'Debre Markos', 'Debre Tabor', 'Kombolcha',
    'Woldia', 'Finote Selam', 'Debre Birhan', 'Kemise', 'Wegdi', 'Lalibela', 'Sekota',
    'Mekane Selam', 'Azezo', 'Metema', 'Humera', 'Shire', 'Adwa', 'Aksum', 'Adigrat',
    'Wukro', 'Korem', 'Alamata', 'Maichew', 'Kobo', 'Hara Gebeya', 'Wegel Tena',
    'Debre Sina', 'Shewa Robit', 'Ataye', 'Senebet', 'Motta', 'Bichena', 'Dejen',
    'Mankush', 'Chagni', 'Dangila', 'Injibara', 'Addis Zemen', 'Guba', 'Mota', 'Bure',
    'Guh', 'Wembera', 'Bulen', 'Mandura', 'Gelago', 'Dabat', 'Debarq', 'Embaba',
    'Tikil Dingay', 'Gorgora', 'Mitra', 'Koladiba', 'Merawi', 'Durbete', 'Werota',
    'Guba Lafto', 'Habarfo', 'Kutaber', 'Tenta', 'Legambo', 'Mekdela', 'Dessie Zuria',
    'Kalu', 'Werebabo', 'Jama', 'Woreillu', 'Delenat', 'Gazgibla', 'Dehana',
    'Debre Estifanos', 'Meket', 'Gidan', 'Lasta', 'Gubalafto', 'Bugna', 'Dahana',
    'Abergelle', 'Sehala', 'Zikuala', 'Saharti', 'Medebay Zana', 'Laelay Adiyabo',
    'Tahtay Adiyabo', 'Tselemti', 'Tselema', 'Wolkayt', 'Kafta Humera', 'Tahitay Koraro'
  ],
  'Tigray': [
    'Mekelle', 'Adigrat', 'Aksum', 'Adwa', 'Shire', 'Humera', 'Alamata', 'Wukro',
    'Korem', 'Maichew', 'Abiy Addi', 'Adi Remets', 'Maychew', 'Edaga Arbi', 'Zalambessa',
    'Adi Quala', 'Senkata', 'Freweyni', 'Hawzen', 'Kwiha', 'Maykinetal', 'Rama',
    'Sheraro', 'Rawyan', 'Hagere Selam', 'May Tsebri', 'Seleklika', 'Edaga Hamus',
    'Adi Gudom', 'Frewoyni', 'Bizet', 'Zalanbessa', 'Rama', 'Ksad Emni', 'Addi Hageray',
    'Sebeya', 'Debrekerbe', 'Hade Alga', 'Gijet', 'Meareb', 'Enticho', 'Edaga Arbi'
  ],
  'SNNPR': [
    'Hawassa', 'Sodo', 'Arba Minch', 'Dila', 'Hosaena', 'Bonga', 'Mizan Teferi', 'Butajira',
    'Wolkite', 'Areka', 'Boditi', 'Yirga Alem', 'Aleta Wendo', 'Sawla', 'Chencha',
    'Gidole', 'Dilla', 'Yirgalem', 'Agere Selam', 'Hagere Selam', 'Durame', 'Hadero',
    'Alaba Kulito', 'Humbo', 'Jinka', 'Key Afer', 'Omorate', 'Konso', 'Karakore',
    'Malka Amana', 'Wolaita Sodo', 'Tepi', 'Wush Wush', 'Gimbo', 'Bebeji', 'Bachuma',
    'Wenago', 'Dilla Zuria', 'Bule', 'Gedeo', 'Wonago', 'Kochere', 'Yirgachefe',
    'Gedeb', 'Bursa', 'Gumure', 'Sedika', 'Wera', 'Gumer', 'Ezha', 'Cheha',
    'Enemor', 'Goro', 'Abeshge', 'Kebena', 'Analemo', 'Gero', 'Masha', 'Andit',
    'Yetnora', 'Sodo Zuriya', 'Damot Gale', 'Damot Woide', 'Damot Sore', 'Soro',
    'Gibe', 'Ofa', 'Kindo Koyisha', 'Boloso Sore', 'Boloso Bombe', 'Kucha',
    'Gainto', 'Humbo', 'Zala', 'Ubude', 'Gununo', 'Boditi', 'Guma', 'Bedesh',
    'Amaro', 'Burji', 'Konso', 'Ale', 'Gamo Gofa', 'Basketo', 'Dawro', 'Malie'
  ],
  'Afar': [
    'Semera', 'Asaita', 'Afdera', 'Logiya', 'Mille', 'Gewane', 'Eli Dar',
    'Abala', 'Dupti', 'Kalifou', 'Aysaita', 'Chifra', 'Dubti', 'Haramaya', 'Ewa',
    'Awash', 'Boli', 'Kone', 'Sifra', 'Adale', 'Amibara', 'Gelalo', 'Dalifage',
    'Erebti', 'Magale', 'Yalo', 'Teru', 'Aura', 'Adar', 'Barga', 'Efrate',
    'Elidar', 'Kori', 'Moale', 'Tendaho', 'Uddu', 'Alaylou', 'Adaitu', 'Gali Fan'
  ],
  'Somali': [
    'Jijiga', 'Gode', 'Kebri Dehar', 'Warder', 'Dollo', 'Fiiq', 'Degehabur',
    'Shilavo', 'Korahe', 'Gashamo', 'Hartisheik', 'Teferi Ber', 'Denan', 'Imi',
    'Mieso', 'Awbere', 'Shinile', 'Erer', 'Isa', 'Dembel', 'Gursum', 'Kebri Beyah',
    'Mustahil', 'Ferfer', 'Gunagado', 'Aware', 'Boh', 'Danot', 'Birkot', 'Shekosh',
    'Danan', 'Birkod', 'Lebelay', 'Higloley', 'Bargel', 'Yucub', 'Lagahida',
    'Hamanle', 'Damale', 'Gumar', 'Dehun', 'Beled', 'Awbere', 'Tulli',
    'Dagahbur', 'Shilabo', 'Mokakis', 'Warnan', 'Fik', 'Segeg', 'Dagahmedo'
  ],
  'Benishangul-Gumuz': [
    'Assosa', 'Metekel', 'Kamashi', 'Pawi', 'Bambasi', 'Menge', 'Shirkole',
    'Yaso', 'Belo Jiganfoy', 'Guba', 'Wenbera', 'Bulan', 'Dangur', 'Kurmuk',
    'Homosha', 'Oda Buldigilu', 'Agelo Meti', 'Mandi', 'Giz Meret', 'Sedal',
    'Komesha', 'Dangur', 'Guba', 'Mankush', 'Gilgel Beles', 'Begi', 'Tongo'
  ],
  'Gambela': [
    'Gambela', 'Itang', 'Dimma', 'Pinyudo', 'Lare', 'Jor', 'Jikawo',
    'Abobo', 'Gog', 'Dima', 'Akobo', 'Matar', 'Tirgol', 'Pinyudo', 'Wantawa',
    'Tepi', 'Jikawo', 'Lare', 'Nuer', 'Anuak', 'Majang'
  ],
  'Harari': [
    'Harar', 'Harar Jugol', 'Hamaressa', 'Kersa', 'Alemaya', 'Haramaya',
    'Jijiga', 'Babile', 'Dire Dawa', 'Fik', 'Gursum', 'Harar'
  ],
  'Dire Dawa': [
    'Dire Dawa', 'Melka Jebdu', 'Hargele', 'Adada', 'Kula',
    'Bishan Bahe', 'Hurso', 'Legehida', 'Mieso', 'Borde', 'Biyo Awale'
  ],
  'Sidama': [
    'Hawassa', 'Yirgalem', 'Aleta Wendo', 'Wendo Genet', 'Bensa', 'Bura',
    'Chire', 'Dale', 'Dara', 'Gorche', 'Hula', 'Loko', 'Malga', 'Shebedino',
    'Wensho', 'Bokaso', 'Kokosa', 'Deneba', 'Bona', 'Arbegona', 'Chuko'
  ],
  'South West Ethiopia': [
    'Bonga', 'Tepi', 'Mizan Teferi', 'Wush Wush', 'Gimbo', 'Guraferda',
    'Decha', 'Chena', 'Gewata', 'Sayilem', 'Masha', 'Gesha', 'Yeki',
    'Sheka', 'Menjiwo', 'Gogi', 'Seka', 'Gechi', 'Wobako', 'Gida'
  ],
};

// Generate random phone number
const generatePhone = (): string => {
  const prefixes = ['0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0921', '0922', '0923', '0924', '0925'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${suffix}`;
};

// Generate departments based on facility type
const generateDepartments = (facilityType: MockHospital['facilityType']): MockHospital['departments'] => {
  switch (facilityType) {
    case 'HOSPITAL':
      const hospitalCount = 8 + Math.floor(Math.random() * 8); // 8-16 departments
      return [...hospitalDepartments].sort(() => Math.random() - 0.5).slice(0, hospitalCount);
    case 'HEALTH_CENTER':
      const hcCount = 4 + Math.floor(Math.random() * 3); // 4-7 departments
      return [...healthCenterDepartments].sort(() => Math.random() - 0.5).slice(0, hcCount);
    case 'CLINIC':
      const clinicCount = 2 + Math.floor(Math.random() * 2); // 2-4 departments
      return [...clinicDepartments].sort(() => Math.random() - 0.5).slice(0, clinicCount);
    case 'HEALTH_POST':
      return [...healthPostDepartments].slice(0, 2 + Math.floor(Math.random() * 2));
    case 'SPECIALIZED_CENTER':
      return [...specializedDepartments];
    case 'PHARMACY':
      const pharmacyCount = 2 + Math.floor(Math.random() * 3); // 2-4 departments
      return [...pharmacyDepartments].sort(() => Math.random() - 0.5).slice(0, pharmacyCount);
    case 'LABORATORY':
      const labCount = 3 + Math.floor(Math.random() * 3); // 3-5 departments
      return [...laboratoryDepartments].sort(() => Math.random() - 0.5).slice(0, labCount);
    default:
      return [...clinicDepartments].slice(0, 2);
  }
};

// Generate facility name
const generateFacilityName = (
  facilityType: MockHospital['facilityType'],
  city: string,
  type: 'GOVERNMENT' | 'PRIVATE' | 'NGO',
  index: number
): string => {
  let prefix: string;
  let suffix: string;
  
  switch (facilityType) {
    case 'HOSPITAL':
      if (type === 'GOVERNMENT') {
        prefix = hospitalPrefixes[Math.floor(Math.random() * hospitalPrefixes.length)];
        suffix = hospitalSuffixes[Math.floor(Math.random() * hospitalSuffixes.length)];
        return `${city} ${prefix} ${suffix}`.replace(/\s+/g, ' ').trim();
      } else if (type === 'NGO') {
        prefix = ngoPrefixes[Math.floor(Math.random() * ngoPrefixes.length)];
        suffix = hospitalSuffixes[Math.floor(Math.random() * hospitalSuffixes.length)];
        return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
      } else {
        prefix = clinicPrefixes[Math.floor(Math.random() * clinicPrefixes.length)];
        suffix = hospitalSuffixes[Math.floor(Math.random() * hospitalSuffixes.length)];
        return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
      }
    
    case 'HEALTH_CENTER':
      prefix = healthCenterPrefixes[Math.floor(Math.random() * healthCenterPrefixes.length)];
      suffix = healthCenterSuffixes[Math.floor(Math.random() * healthCenterSuffixes.length)];
      return `${city} ${prefix} ${suffix}`.replace(/\s+/g, ' ').trim();
    
    case 'CLINIC':
      if (type === 'PRIVATE') {
        prefix = clinicPrefixes[Math.floor(Math.random() * clinicPrefixes.length)];
        suffix = clinicSuffixes[Math.floor(Math.random() * clinicSuffixes.length)];
        return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
      } else if (type === 'NGO') {
        prefix = ngoPrefixes[Math.floor(Math.random() * ngoPrefixes.length)];
        return `${prefix} Clinic, ${city}`.replace(/\s+/g, ' ').trim();
      } else {
        return `${city} ${type.toLowerCase()} Clinic`;
      }
    
    case 'HEALTH_POST':
      prefix = healthPostPrefixes[Math.floor(Math.random() * healthPostPrefixes.length)];
      suffix = healthPostSuffixes[Math.floor(Math.random() * healthPostSuffixes.length)];
      return `${city} ${prefix} ${suffix}`.replace(/\s+/g, ' ').trim();
    
    case 'SPECIALIZED_CENTER':
      prefix = specializedPrefixes[Math.floor(Math.random() * specializedPrefixes.length)];
      suffix = specializedSuffixes[Math.floor(Math.random() * specializedSuffixes.length)];
      return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
    
    case 'PHARMACY':
      prefix = pharmacyPrefixes[Math.floor(Math.random() * pharmacyPrefixes.length)];
      suffix = pharmacySuffixes[Math.floor(Math.random() * pharmacySuffixes.length)];
      return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
    
    case 'LABORATORY':
      prefix = laboratoryPrefixes[Math.floor(Math.random() * laboratoryPrefixes.length)];
      suffix = laboratorySuffixes[Math.floor(Math.random() * laboratorySuffixes.length)];
      return `${prefix} ${suffix}, ${city}`.replace(/\s+/g, ' ').trim();
    
    default:
      return `${city} Medical Facility`;
  }
};

// Generate facilities for a region
const generateRegionFacilities = (
  region: string,
  counts: { hospitals: number; healthCenters: number; clinics: number; healthPosts: number; specialized: number; pharmacies: number; laboratories: number },
  startIndex: number
): MockHospital[] => {
  const facilities: MockHospital[] = [];
  const center = regionCenters[region];
  const cities = citiesByRegion[region] || [region];
  let globalIndex = startIndex;
  
  const generateFacility = (
    facilityType: MockHospital['facilityType'],
    cityIndex: number
  ): MockHospital => {
    const city = cities[cityIndex % cities.length];
    
    // Determine type based on facility type
    let type: 'GOVERNMENT' | 'PRIVATE' | 'NGO';
    if (facilityType === 'HEALTH_CENTER' || facilityType === 'HEALTH_POST') {
      type = 'GOVERNMENT'; // These are typically government-run
    } else if (facilityType === 'CLINIC') {
      type = Math.random() < 0.7 ? 'PRIVATE' : 'NGO';
    } else if (facilityType === 'SPECIALIZED_CENTER') {
      type = Math.random() < 0.5 ? 'PRIVATE' : 'GOVERNMENT';
    } else if (facilityType === 'PHARMACY') {
      type = Math.random() < 0.85 ? 'PRIVATE' : 'NGO'; // Most pharmacies are private
    } else if (facilityType === 'LABORATORY') {
      type = Math.random() < 0.7 ? 'PRIVATE' : 'GOVERNMENT';
    } else {
      type = Math.random() < 0.6 ? 'GOVERNMENT' : Math.random() < 0.7 ? 'PRIVATE' : 'NGO';
    }
    
    // Generate random offset from region center
    const latOffset = (Math.random() - 0.5) * 2;
    const lngOffset = (Math.random() - 0.5) * 2;
    
    const name = generateFacilityName(facilityType, city, type, globalIndex);
    
    globalIndex++;
    
    return {
      id: `facility-${globalIndex}`,
      name,
      region,
      city,
      address: `${city}, ${region}, Ethiopia`,
      latitude: center.lat + latOffset,
      longitude: center.lng + lngOffset,
      emergencyContactNumber: generatePhone(),
      isActive: Math.random() > 0.03, // 97% active
      type,
      facilityType,
      departments: generateDepartments(facilityType),
    };
  };
  
  // Generate hospitals
  for (let i = 0; i < counts.hospitals; i++) {
    facilities.push(generateFacility('HOSPITAL', i));
  }
  
  // Generate health centers
  for (let i = 0; i < counts.healthCenters; i++) {
    facilities.push(generateFacility('HEALTH_CENTER', i));
  }
  
  // Generate clinics
  for (let i = 0; i < counts.clinics; i++) {
    facilities.push(generateFacility('CLINIC', i));
  }
  
  // Generate health posts
  for (let i = 0; i < counts.healthPosts; i++) {
    facilities.push(generateFacility('HEALTH_POST', i));
  }
  
  // Generate specialized centers
  for (let i = 0; i < counts.specialized; i++) {
    facilities.push(generateFacility('SPECIALIZED_CENTER', i));
  }
  
  // Generate pharmacies
  for (let i = 0; i < counts.pharmacies; i++) {
    facilities.push(generateFacility('PHARMACY', i));
  }
  
  // Generate laboratories
  for (let i = 0; i < counts.laboratories; i++) {
    facilities.push(generateFacility('LABORATORY', i));
  }
  
  return facilities;
};

// Generate all 2000+ healthcare facilities
export const generateMockHospitals = (): MockHospital[] => {
  const facilities: MockHospital[] = [];
  let index = 0;
  
  // Distribution of healthcare facilities by region (total ~2000+ facilities)
  // Format: { hospitals, healthCenters, clinics, healthPosts, specialized, pharmacies, laboratories }
  const distribution: Record<string, { hospitals: number; healthCenters: number; clinics: number; healthPosts: number; specialized: number; pharmacies: number; laboratories: number }> = {
    'Addis Ababa': { hospitals: 50, healthCenters: 45, clinics: 120, healthPosts: 20, specialized: 25, pharmacies: 200, laboratories: 40 }, // 500 total
    'Oromia': { hospitals: 80, healthCenters: 100, clinics: 150, healthPosts: 120, specialized: 20, pharmacies: 180, laboratories: 35 }, // 685 total
    'Amhara': { hospitals: 65, healthCenters: 85, clinics: 120, healthPosts: 100, specialized: 15, pharmacies: 150, laboratories: 30 }, // 565 total
    'SNNPR': { hospitals: 45, healthCenters: 65, clinics: 90, healthPosts: 85, specialized: 10, pharmacies: 120, laboratories: 25 }, // 440 total
    'Tigray': { hospitals: 30, healthCenters: 40, clinics: 45, healthPosts: 50, specialized: 8, pharmacies: 70, laboratories: 15 }, // 258 total
    'Somali': { hospitals: 20, healthCenters: 35, clinics: 40, healthPosts: 45, specialized: 5, pharmacies: 50, laboratories: 10 }, // 205 total
    'Afar': { hospitals: 15, healthCenters: 25, clinics: 25, healthPosts: 35, specialized: 4, pharmacies: 40, laboratories: 8 }, // 152 total
    'Benishangul-Gumuz': { hospitals: 15, healthCenters: 20, clinics: 25, healthPosts: 30, specialized: 3, pharmacies: 35, laboratories: 8 }, // 136 total
    'Gambela': { hospitals: 10, healthCenters: 15, clinics: 20, healthPosts: 20, specialized: 2, pharmacies: 25, laboratories: 5 }, // 97 total
    'Harari': { hospitals: 10, healthCenters: 10, clinics: 15, healthPosts: 10, specialized: 3, pharmacies: 30, laboratories: 6 }, // 84 total
    'Dire Dawa': { hospitals: 12, healthCenters: 12, clinics: 20, healthPosts: 12, specialized: 4, pharmacies: 35, laboratories: 8 }, // 103 total
    'Sidama': { hospitals: 20, healthCenters: 25, clinics: 35, healthPosts: 30, specialized: 6, pharmacies: 60, laboratories: 12 }, // 188 total
    'South West Ethiopia': { hospitals: 15, healthCenters: 20, clinics: 25, healthPosts: 25, specialized: 3, pharmacies: 45, laboratories: 10 }, // 143 total
  };
  
  Object.entries(distribution).forEach(([region, counts]) => {
    const regionFacilities = generateRegionFacilities(region, counts, index);
    facilities.push(...regionFacilities);
    index += Object.values(counts).reduce((a, b) => a + b, 0);
  });
  
  return facilities;
};

// Pre-generated facilities list
export const MOCK_HOSPITALS: MockHospital[] = generateMockHospitals();

// Helper function to get facilities by city
export const getFacilitiesByCity = (city: string): MockHospital[] => {
  return MOCK_HOSPITALS.filter(f => 
    f.city.toLowerCase() === city.toLowerCase()
  );
};

// Helper function to get facilities by type
export const getFacilitiesByType = (facilityType: MockHospital['facilityType']): MockHospital[] => {
  return MOCK_HOSPITALS.filter(f => f.facilityType === facilityType);
};

// Helper function to get facilities by region
export const getFacilitiesByRegion = (region: string): MockHospital[] => {
  return MOCK_HOSPITALS.filter(f => f.region === region);
};

// Helper function to get all hospitals only
export const getHospitalsOnly = (): MockHospital[] => {
  return MOCK_HOSPITALS.filter(f => f.facilityType === 'HOSPITAL');
};

// Helper function to get all clinics only
export const getClinicsOnly = (): MockHospital[] => {
  return MOCK_HOSPITALS.filter(f => f.facilityType === 'CLINIC');
};

// Stats
export const getFacilityStats = () => {
  const stats = {
    total: MOCK_HOSPITALS.length,
    byType: {
      hospitals: MOCK_HOSPITALS.filter(f => f.facilityType === 'HOSPITAL').length,
      healthCenters: MOCK_HOSPITALS.filter(f => f.facilityType === 'HEALTH_CENTER').length,
      clinics: MOCK_HOSPITALS.filter(f => f.facilityType === 'CLINIC').length,
      healthPosts: MOCK_HOSPITALS.filter(f => f.facilityType === 'HEALTH_POST').length,
      specialized: MOCK_HOSPITALS.filter(f => f.facilityType === 'SPECIALIZED_CENTER').length,
      pharmacies: MOCK_HOSPITALS.filter(f => f.facilityType === 'PHARMACY').length,
      laboratories: MOCK_HOSPITALS.filter(f => f.facilityType === 'LABORATORY').length,
    },
    byRegion: {} as Record<string, number>,
    byOwnership: {
      government: MOCK_HOSPITALS.filter(f => f.type === 'GOVERNMENT').length,
      private: MOCK_HOSPITALS.filter(f => f.type === 'PRIVATE').length,
      ngo: MOCK_HOSPITALS.filter(f => f.type === 'NGO').length,
    },
  };
  
  Object.keys(regionCenters).forEach(region => {
    stats.byRegion[region] = MOCK_HOSPITALS.filter(f => f.region === region).length;
  });
  
  return stats;
};
