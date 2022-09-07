<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/PanJiaChen/vue-element-admin" rel="nofollow">
    <img src="https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/releases">
    <img src="https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/vue-element-admin/discuss">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="gitter">
  </a>
  <a href="https://panjiachen.github.io/vue-element-admin-site/donate">
    <img src="https://img.shields.io/badge/%24-donate-ff69b4.svg" alt="donate">
  </a>
</p>

Turkish | [English](./README.eng.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Spanish](./README.es.md)

<p align="center">
  <b>SPONSORLAR</b>
</p>
<table align="center" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td align="center" valign="middle">
       <a href="https://www.vform666.com/" title="variantForm" target="_blank" style="padding-right: 20px;">
        <img height="200px" style="padding-right: 20px;" src="https://s3.bmp.ovh/imgs/2022/04/11/3379c1c1cf2e3228.png" title="variantForm">
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Giriş

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) yönetici arayüzleri için üretime hazır bir ön uç çözümdür. dayandığı [vue](https://github.com/vuejs/vue) ve UI Toolkit'i kullanır [element-ui](https://github.com/ElemeFE/element).

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) vue'nun en yeni geliştirme yığınını temel alır ve yerleşik bir i18n çözümüne, kurumsal uygulamalar için tipik şablonlara ve birçok harika özelliğe sahiptir. Büyük ve karmaşık Tek Sayfalı Uygulamalar oluşturmanıza yardımcı olur. İhtiyaçlarınız ne olursa olsun, bu projenin size yardımcı olacağına inanıyorum.

- [Ön izleme](https://panjiachen.github.io/vue-element-admin)

- [Belgeler](https://panjiachen.github.io/vue-element-admin-site/)

- [Gitter](https://gitter.im/vue-element-admin/discuss)

- [Bağış](https://panjiachen.github.io/vue-element-admin-site/donate/)

- [Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Gitee](https://panjiachen.gitee.io/vue-element-admin/) 国内用户可访问该地址在线预览

- Temel şablon şunları kullanmanızı önerir:: [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
- Masaüstü: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- Typescript: [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))
- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

**`v4.1.0+` sürümünden sonra, varsayılan ana dal i18n'yi desteklemeyecektir. Lütfen [i18n Branch](https://github.com/PanJiaChen/vue-element-admin/tree/i18n) kullanın, ana güncellemeye ayak uyduracaktır**

**Geçerli sürüm, 'vue-cli' üzerine kurulu 'v4.0+'dır. Bir sorun bulursanız lütfen [sorunu](https://github.com/PanJiaChen/vue-element-admin/issues/new) sorun. Eski sürümü kullanmak istiyorsanız dalı [tag/3.11.0](https://github.com/PanJiaChen/vue-element-admin/tree/tag/3.11.0) olarak değiştirebilirsiniz, değil 'vue-cli'ye güvenin**

**Bu proje, düşük sürüm tarayıcıları desteklemez (ör. IE). Lütfen polyfill'i kendiniz ekleyin.**

## Hazırlık

Öncelikle node.js'i yüklemeniz gerekiyor [node](https://nodejs.org/) ve [git](https://git-scm.com/) locally. Proje [ES2015+] üstü çalışmaktadır (https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) ve [element-ui](https://github.com/ElemeFE/element), tüm istek verileri kullanılarak simüle edilir [Mock.js](https://github.com/nuysoft/Mock).
Bu bilgiyi önceden anlamak ve öğrenmek, bu projenin kullanılmasına büyük ölçüde yardımcı olacaktır.

[![CodeSandbox'da düzenle](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/PanJiaChen/vue-element-admin/tree/CodeSandbox)

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Sponsorlar

Sponsor olun ve logonuzu sitenize bir bağlantı ile GitHub'daki README'ye alın. [[Sponsor ol]](https://www.patreon.com/panjiachen)

### Akveo
<a href="https://store.akveo.com/products/vue-java-admin-dashboard-spring?utm_campaign=akveo_store-Vue-Vue_demo%2Fgithub&utm_source=vue_admin&utm_medium=referral&utm_content=github_banner"><img width="500px" src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin-site/master/docs/.vuepress/public/images/vue-java-banner.png" /></a><p>SWB0RAZPZR1M kupon kodunu kullanarak 39$'a %20 indirimle Vue admin için Java arka ucunu edinin
</p>

### Düz Mantık

<a href="https://flatlogic.com/admin-dashboards?from=vue-element-admin"><img width="150px" src="https://wpimg.wallstcn.com/9c0b719b-5551-4c1e-b776-63994632d94a.png" /></a><p>Vue, React ve Angular ile yapılan Admin Dashboard Şablonları.</p>

## Özellikler

```
- Giriş / Çıkış

- İzin Doğrulama
  - Sayfa izni
  - Direktif izni
  - İzin yapılandırma sayfası
  - İki adımlı giriş

- Çok ortamlı yapı
  - Geliştirmek (geliştirmek)
  - oturmak
  - Aşama Testi (aşama)
  - Üretim (ürün)

- Küresel Özellikler
  - I18n
  - Çoklu dinamik temalar
  - Dinamik kenar çubuğu (çok seviyeli yönlendirmeyi destekler)
  - Dinamik kırıntı
  - Etiketler görünümü (Sekme sayfası Sağ tıklama işlemini destekler)
  - Svg Sprite
  - Sahte veriler
  - Ekran dolu
  - Duyarlı Kenar Çubuğu

- Editör
  - Zengin metin editörü
  - İşaretleme Düzenleyicisi
  - JSON Düzenleyici

- Excel
  - Excel'i Dışa Aktar
  - Excel'i Yükle
  - Görselleştirme Exceli
  - Zip'i dışa aktar

- Masa
  - Dinamik Tablo
  - Sürükle ve Bırak Tablosu
  - Satır İçi Düzenleme Tablosu

- Hatalı sayfa
  - 401
  - 404

- Bileşenler
  - Avatar Yükleme
  - Başa dönüş
  - Sürükle İletişim Kutusu
  - Sürükle Seç
  - Kanban'ı sürükleyin
  - Listeyi Sürükle
  - BölmeBölmesi
  - Boşaltma noktası
  - Yapışkan
  - Saymak

- Gelişmiş Örnek
- Hata Günlüğü
- Gösterge Paneli
- Kılavuz Sayfası
- Echart'lar
- Pano
- html'ye işaretleme
```

## Başlarken

```bash
# projeyi klonla
git clone https://github.com/PanJiaChen/vue-element-admin.git

# proje dizinine girin
cd vue-element-admin

# bağımlılık yükle
npm install

# çalıştırmak
npm run dev
```

Bu otomatik olarak açılacaktır http://localhost:9527

## Projeyi build etmek

```bash
# test ortamı için derleme
npm run build:stage

# üretim ortamı için inşa
npm run build:prod
```

## Gelişmiş

```bash
# yayın ortamı efektini önizleyin
npm run preview

# yayın ortamı etkisi + statik kaynak analizini önizleyin
npm run preview -- --report

# kod formatı kontrolü
npm run lint

# kod formatı kontrolü ve otomatik düzeltme
npm run lint -- --fix
```

Daha fazla bilgi için bkz. [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html)

Detailed changes for each release are documented in the [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## Değişiklik günlüğü

Her sürüm için ayrıntılı değişiklikler [sürüm notlarında](https://github.com/PanJiaChen/vue-element-admin/releases). belgelenmiştir.

## Çevrimiçi Demo

[Önizleme](https://panjiachen.github.io/vue-element-admin)

## Bağış

Bu projeyi faydalı bulursanız, yazara bir bardak meyve suyu :tropik içecek satın alabilirsiniz:

![bağış](https://wpimg.wallstcn.com/bd273f0d-83a0-4ef2-92e1-9ac8ed3746b9.png)

[Paypal](https://www.paypal.me/panfree23)

[Bana kahve satın al](https://www.buymeacoffee.com/Pan)

## Tarayıcı Destekleri

Modern tarayıcılar ve Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## Lisans

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2017-present PanJiaChen
