---
date: Jul 14 10:45
---

# Kenapa Aku Pakai NixOS?

Halo semuanya! Sebagai tulisan pertama di blog ini, aku mencoba untuk membahas hal-hal yang ringan saja karena aku tidak tau bagaimana cara menulis yang bagus. Nah, di sini aku mau bercerita tentang kenapa aku memakai **NixOS** ketimbang distro Linux yang lain.

Awal perjalananku di dunia Linux dimulai dari **Linux Mint**. Yah, seperti biasanya, aku melakukan banyak _distro hopping_. Setelah mencoba beberapa distro, akhirnya aku menggunakan **Arch Linux**.

Mungkin Arch Linux memang distro yang cukup enak bagiku, tapi ada satu kekurangannya, yaitu sifatnya yang _bleeding edge_. Sebenarnya mungkin saja aku melakukan _rollback_ ketika ada masalah, tapi aku terlalu malas untuk mengotak-atik Arch Linux-ku.

Suatu ketika, saat sedang _scrolling_ Facebook, aku menemukan sebuah postingan di grup Linux Indonesia. Postingan tersebut membahas NixOS dan beberapa hal menarik tentang cara kerja distro tersebut.

Dari postingan tersebut, aku penasaran dan ingin mencobanya. Berdasarkan deskripsi dari distro tersebut, NixOS mengatakan sebagai distro yang:

- _Reproducible_
- _Declarative_
- _Reliable_

Sebuah konsep deklaratif... Aku yang sebelumnya tidak pernah mencoba konsep ini langsung saja meng-_install_ dan memasangnya.

Setelah _install_, tentunya ketika awal pertama pakai terasa biasa saja. Tapi ketika aku ingin meng-_install_, aku mencoba mencari-cari bagaimana cara _install_ sebuah _packages_, dan ternyata itu semua bisa dilakukan hanya dengan 1 file di `configuration.nix`.

```nix
environment.systemPackages = with pkgs; [
  git
  neovim
  wget
];
```

Aku ketika pertama kali pakai sangat terpukau karena merasa:

> _"Wah bisa lihat packages_ apa saja yang di-_install_, mau tambah tinggal ketik, mau hapus tinggal hapus".

Nah di titik itu aku malah makin suka sama Nix. Cuman pas aku mau coba semacam _dotfiles_, kebanyakan menggunakan _flakes_. Aku sama sekali tidak mengerti _flakes_ ini, aku _install_ kok malah rusak ya, dan untungnya bisa _rollback_ karena fitur bawaan NixOS, sistemku berjalan kembali.

Tapi karena sewaktu awal itu aku masih sangat kebingungan dan akhirnya aku memutuskan menghapus NixOS dan kembali ke Arch Linux. Hehe.

Setelah beberapa bulan menggunakan Arch Linux. Aku memutuskan untuk kembali menggunakan NixOS karena Arch Linux ku ada sedikit _trouble_ dan aku malas sekali untuk memperbaikinya.

Dan dari titik itu hingga sekarang, aku mulai menggunakan NixOS dan terus memperdalaminya. Nah, _flakes_ ini benar-benar _powerful_. Aku suka menggunakannya karena:

1. Aku bisa membuat konfigurasi sistemku menjadi modular
2. Lebih mudah untuk di-_maintain_.
3. Aku juga bisa melihat dan mengatur konfigurasi sistemku dengan lebih jelas.

Bahkan kalau aku mau ke laptop lain bisa loh! Enggak akan ada tuh yang bilang, _"it works on my machine"_.

Sekarang juga aku mulai menggunakan NixOS sebagai _workstation_ utamaku. Untuk saat ini. Hehe.

---

<!-- EN -->

# Why I Use NixOS?

Hello everyone! For this first blog post, I’m keeping things light since I don’t really know how to write well. So, here I want to share why I use **NixOS** instead of other Linux distributions.

My journey in the Linux world started with **Linux Mint**. As usual, I did a lot of _distro hopping_. After trying several distros, I finally ended up using **Arch Linux**.

Arch Linux was actually quite a nice distro for me, but it had one drawback, which is its _bleeding edge_ nature. I could have actually done a rollback when there were problems, but I was too lazy to tinker with my Arch Linux.

One day, while _scrolling_ Facebook, I found a post in an Indonesian Linux group. The post discussed NixOS and some interesting things about how the distro works.

From that post, I got curious and wanted to try it out. Based on its description, NixOS is described as a distro that is:

- _Reproducible_
- _Declarative_
- _Reliable_

A declarative concept... Having never tried this concept before, I just went ahead and installed it.
`

After installing, using it for the first time felt pretty normal. But when I wanted to install things, I tried looking up how to install packages, and it turns out it could all be done in just 1 file at `configuration.nix`.

```nix
environment.systemPackages = with pkgs; [
  git
  neovim
  wget
];
```

When I first used it, I was completely mesmerized because I felt:

> _"Wow, I can see exactly what packages are installed, if I want to add I just type it, if I want to remove I just delete it"._

At that point, I actually liked Nix even more. However, when I wanted to try something like dotfiles, most of them were using flakes. I completely did not understand these flakes, I installed it and it broke, and fortunately I could rollback because of NixOS's built-in feature, my system ran again.

But because I was still very confused back then, I eventually decided to uninstall NixOS and went back to Arch Linux. Hehe.

After a few months of using Arch Linux, I decided to go back to NixOS because my Arch Linux had a bit of trouble and I was incredibly lazy to fix it.

And from that point until now, I started using NixOS and kept diving deeper into it. It turns out, flakes are really _powerful_. I like using it because:

1. I can make my system configuration modular
2. It's easier to _maintain_.
3. I can also view and manage my system configuration more clearly.

Even if I want to move to another laptop, I can! There will be no more saying, _"it works on my machine"_.

Now I've also started using NixOS as my main workstation. For now at least. Hehe.
