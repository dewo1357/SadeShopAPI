const dummyProjects = [
  {
    id: 1,
    name: 'E-commerce App',
    stack: ['React', 'Node.js'],
    link: 'https://github.com/example/ecommerce'
  },
  {
    id: 2,
    name: 'Portfolio Website',
    stack: ['React', 'TailwindCSS'],
    link: 'https://github.com/example/portfolio'
  }
]

const dummyBlogs = [
  {
    id: 1,
    title: 'Belajar React dari Nol',
    description: 'Ini konten dummy blog 1'
  },
  {
    id: 2,
    title: 'Kenapa Hapi.js Lebih Rapi',
    description: 'Ini konten dummy blog 2'
  }
]

const dummyExperiences = [
  {
    title: 'Instruktur Bahasa Pemrograman',
    company: 'Sumatera Computer Centre',
    date: 'Okt 2023 – Sekarang',
    tasks: [
      'Mengajar Python, C++, Java',
      'Analisis Data (Pandas, Numpy, Matplotlib, Seaborn)',
      'Membimbing penggunaan Django Framework (Web Application)'
    ]
  },
  {
    title: 'Business Analyst',
    company: 'Pempek Kesya',
    date: 'Mei 2022 – Agustus 2023',
    tasks: [
      'Mengelola operasional tim outlet',
      'Input & ekstrak 300 data transaksi per hari',
      'Implementasi database (MySQL API + Python + Excel)',
      'Analisis tren & pola data untuk strategi perusahaan',
      'Dashboard Looker Studio (auto update dari MySQL)'
    ]
  },
  {
    title: 'Staff Administrasi',
    company: 'Kopi Dolok',
    date: 'Nov 2020 – Maret 2022',
    tasks: [
      'Input data keuangan harian 3 outlet',
      'Perencanaan stok bahan baku bulanan',
      'Kontrol konsistensi data gudang & sistem',
      'Stok opname + laporan keuangan bulanan'
    ]
  }
]

module.exports = {
  dummyBlogs,
  dummyProjects,
  dummyExperiences
}
