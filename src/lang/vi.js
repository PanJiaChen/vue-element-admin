export default {
  route: {
    dashboard: 'Bảng điều khiển',
    introduction: 'Giới thiệu',
    documentation: 'Tài liệu',
    permission: 'Quyền truy cập',
    icons: 'Biểu tượng',
    components: 'Components',
    componentIndex: 'Giới thiệu',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'Trình soạn thảo JSON',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Ảnh đại diện',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: 'Thành phần',
    backToTop: 'Trở về trên',
    charts: 'Biểu đồ',
    keyboardChart: 'Biểu đồ cột',
    lineChart: 'Biểu đồ đường',
    mixChart: 'Biểu đồ Kết hợp',
    example: 'Ví dụ',
    Table: 'Bảng',
    dynamicTable: 'Lọc dữ liệu',
    dragTable: 'Kéo & Thả',
    inlineEditTable: 'Sửa tại chỗ',
    complexTable: 'Đầy đủ',
    tab: 'Tab',
    form: 'Form',
    createForm: 'Tạo Form',
    editForm: 'Sửa Form',
    errorPages: 'Các Trang lỗi',
    page401: '401',
    page404: '404',
    errorLog: 'Lịch sử lỗi',
    excel: 'Excel',
    exportExcel: 'Xuất Excel',
    selectExcel: 'Xuất Mục được chọn',
    uploadExcel: 'Tải Excel',
    exportZip: 'Xuất Zip',
    theme: 'Chủ đề',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n'
  },
  navbar: {
    logOut: 'Thoát',
    dashboard: 'Bảng điều khiển',
    github: 'Github',
    screenfull: 'Toàn màn hình',
    theme: 'Đổi Chủ đề'
  },
  login: {
    title: 'Form Đăng nhập',
    logIn: 'Đăng nhập',
    username: 'Tài khoản',
    password: 'Mật khẩu',
    any: 'Tuỳ ý',
    thirdparty: 'Hoặc kết nối với',
    thirdpartyTips: 'Chức năng không thể thực hiện ở local!!!'
  },
  documentation: {
    documentation: 'Tài liệu',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Quyền truy cập của bạn',
    switchRoles: 'Thay đổi quyền truy cập'
  },
  components: {
    documentation: 'Tài liệu',
    tinymceTips: 'Trình soạn thảo văn bản là một phần không thể thiếu của một hệ thống quản lí, nhưng đồng thời nó cũng là nơi xảy ra nhiều vấn đề. Trong quá trình lựa chọn, tôi cũng đã xem qua nhiều trình soạn thảo trên thị trường được nhiều người sử dụng và cuối cùng tôi quyết định chọn Tinymce. Nếu muốn tìm hiểu thêm bạn có thể xem tài liệu về giới thiệu và sự so sánh các trình soạn thảo ở',
    dropzoneTips: 'Vì sự cần thiết đặc biệt để tải hình ảnh lên qiniu thay vì sử dụng một bên thứ ba, tôi đã tạo nó. Nó là rất đơn giản, bạn có thể xem chi tiết ở @/components/Dropzone.',
    stickyTips: 'Cố định một phần tử được đặt trước ở phía trên trang khi cuộn trang.',
    backToTopTips1: 'Nút BackToTop sẽ xuất hiện khi cuộn trang đến một vị trí nhất định.',
    backToTopTips2: 'Bạn có thể thay đổi style của nút, hiện / ẩn, vị trí xuất hiện, vị trí ẩn. Bạn có thể thay đổi văn bản bằng cách chỉnh của element-ui el-tooltip ở bên ngoài.',
    imageUploadTips: 'Từ khi sử dụng vue@1 và nó có 1 vài thứ không tương thích với mockjs, tôi đã hiệu chỉnh nó. Nó vẫn tốt hơn nếu được sử dụng bản chính thức nếu bạn muốn.'
  },
  table: {
    dynamicTips1: 'Sắp xếp cố định theo trình tự các tuỳ chọn',
    dynamicTips2: 'Sắp xếp theo trình tự giá trị được chọn',
    dragTips1: 'Trình tự ban đầu',
    dragTips2: 'Trình tự sau khi Kéo & Thả',
    title: 'Tiêu đề',
    importance: 'Độ ưu tiên',
    type: 'Kiểu',
    remark: 'Ghi chú',
    search: 'Tìm kiếm',
    add: 'Tạo mới',
    export: 'Xuất',
    reviewer: 'Đánh giá',
    id: 'IDv',
    date: 'Ngày giờ',
    author: 'Tác giả',
    readings: 'Lượt xem',
    status: 'Trạng thái',
    actions: 'Chức năng',
    edit: 'Sửa',
    publish: 'Xuất bản',
    draft: 'Nháp',
    delete: 'Xoá',
    cancel: 'Huỷ',
    confirm: 'Xác nhận'
  },
  errorLog: {
    tips: 'Click vào biểu tượng BUG trên thanh tiêu đề để xem lịch sử lỗi.',
    description: 'Hiện tại hệ thống quản lí cơ bản chạy kiểu SPA, nó tăng trải nghiệm người dùng đồng thời cũng làm tăng khả năng lỗi của trang, chỉ cần một sợ xuất nhỏ cũng có thể dẫn đến lỗi toàn bộ. May mắn thay, Vue đã cũng cấp cách để xử lí các trường hợp ngoại lệ (exceptions), nơi mà các bạn có thể xử lí hoặc báo cáo.',
    documentation: 'Tài liệu chi tiết'
  },
  excel: {
    export: 'Xuất',
    selectedExport: 'Xuất mục được chọn',
    placeholder: 'Nhập tên file (mặc định excel-list)'
  },
  zip: {
    export: 'Xuất',
    placeholder: 'Nhập tên file (mặc định file)'
  },
  theme: {
    change: 'Đổi Chủ đề',
    documentation: 'Tài liệu của Chủ đề',
    tips: 'Tips: Chức năng này khác với `Đổi chủ đề` ở thanh tiêu đề. Mỗi nơi đều có giá trị khác nhau. Xem chi tiết bên dưới.'
  }
}
