<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
	<a href="https://github.com/vuejs/vue">
		<img src="https://img.shields.io/badge/vue-2.5.10-brightgreen.svg" alt="vue">
	</a>
	<a href="https://github.com/ElemeFE/element">
		<img src="https://img.shields.io/badge/element--ui-2.0.8-brightgreen.svg" alt="element-ui">
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
</p>

Tiếng việt | [English](./README.md) | [简体中文](./README.zh-CN.md)

## Giới thiệu

`vue-element-admin` là một sản phẩm cho giao diện quản lí. Dựa trên [Vue.js](https://github.com/vuejs/vue) và sử dụng UI Toolkit -- [element](https://github.com/ElemeFE/element). `vue-element-admin` dựa trên bản mới nhất của vue, xây dụng với giải pháp i18n, là mẫu cơ bản cho các ứng dụng doanh nghiệp, với nhiều chức năng ưu việt. Nó giúp bạn xây dựng một Single-Page Applications lớn và phức tạp. Tôi tin rằng nó là tất cả bạn cần, dự án này sẽ giúp bạn.

- [Bản xem trước](http://panjiachen.github.io/vue-element-admin)

- [Tài liệu hướng dẫn](https://panjiachen.github.io/vue-element-admin-site/#/)

- [wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Tài trợ](https://panjiachen.github.io/vue-element-admin-site/#/donate)

**vue-element-admin là các thành phần giao diện để tích hợp và phát triển các giao diện cho giải pháp quản lí, nó không phải là giao diện quản lí.**

 - Giao diện quản lí nên sử dụng: [vueAdmin-template](https://github.com/PanJiaChen/vueAdmin-template)  
 - Desktop: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

**Chú ý:  Dự án này sử dụng phiên bản element-ui@2.0.0+, vậy nó tương thích với phiên bản tối thiểu là vue@2.5.0**

## Chuẩn bị

Bạn cần cài sẵn [node](http://nodejs.org/) and [git](https://git-scm.com/) ở máy tính. Dự án phát triển dựa trên [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://vi.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/)、[vue-router](https://router.vuejs.org/) và [element-ui](https://github.com/ElemeFE/element). Tất cả dữ liệu được dùng trong dự án này là dữ liệu ảo sử dụng bằng [Mock.js](https://github.com/nuysoft/Mock). Sẽ rất tốt nếu bạn đã có sẵn những thứ này.

 **Dự án này không phải là một giao diện cụ thể mà là một giải pháp giao diện tích hợp.**

 **Dự án này không hỗ trợ những trình duyệt cũ (ví dụ như IE). Hãy bổ sung chúng nếu bạn cần.**

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Tính năng
```
- Đăng nhập / Đăng xuất - Login / Logout
- Xác thực quyền truy cập - Permission authentication
- Xây dựng trên nhiều môi trường - Multi-environment build
- Sidebar động (hỗ trợ đa cấp) - Dynamic sidebar (supports multi-level routing)
- Breadcrumb động - Dynamic breadcrumb
- Dịch thuật với I18n
- Khả năng hiệu chỉnh giao diện - Customizable theme
- Hiện thị dạng Tags (hỗ trợ chức năng chuột phải) - Tags-view(Tab page Support right-click operation)
- Trình soạn thảo văn bản
- Trình doạn thảo Mardown
- Trình doạn thảo JSON
- Toàn màn hình
- Kéo & Thả sắp xếp
- Svg Sprite
- Bảng điều khiển - Dashboard
- Dữ liệu tạm với Mock - Mock data
- Các loại Biểu đồ - Echarts
- Clipboard
- Các trang lỗi 401/404
- Lịch sử lỗi
- Xuất file excel
- Xuất file zip
- Front-end visualization excel
- Ví dụ về Bảng
- Ví dụ về bảng dữ liệu động
- Ví dụ về Kéo & Thả sắp xếp
- Chỉnh sửa ngay tại chỗ trong Bảng
- Ví dụ Form
- Hai bước đăng nhập
- SplitPane
- Dropzone
- Sticky
- CountTo
- Chuyển Markdown sang html
```

## Bắt đầu

```bash
# clone dự án bằng
git clone https://github.com/PanJiaChen/vue-element-admin.git

# cài đặt npm
npm install

# chạy
npm run dev
```

Nó sẽ tự mở ở trình duyệt với địa chỉ http://localhost:9527.

## Xuất bản
```bash
# xuất bản để kiểm thử
npm run build:sit

# xuất bản sản phẩm
npm run build:prod
```

## Nâng cao
```bash
# --xuất bản sản phẩm kèm theo báo cáo
npm run build:prod --report

# --xuất bản sản phẩm ở máy cục bộ với bản xem trước
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

Tham khảo [Tài liệu](https://panjiachen.github.io/vue-element-admin-site/#/deploy) để hiểu thêm

## Lịch sử thay đổi
Chi tiết thay đổi cho mỗi lần phát hành [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## Bản xem thử
[Preview](http://panjiachen.github.io/vue-element-admin)

## Tài trợ
Nếu dự này hữu ích với bạn, hãy ủng hộ nhà phát triển với một ly trái cây nhé :tropical_drink:

![Tài trợ](https://wpimg.wallstcn.com/bd273f0d-83a0-4ef2-92e1-9ac8ed3746b9.png)

[Paypal của tôi](https://www.paypal.me/panfree23)

## Giấy phép sử dụng

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2017-present PanJiaChen
