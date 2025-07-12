'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="full" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Chính sách bảo mật</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Ngày cập nhật:</strong> 15 tháng 1, 2024
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giới thiệu</h2>
              <p className="text-gray-700 mb-4">
                Cabala cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. 
                Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, 
                và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Thông tin chúng tôi thu thập</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Thông tin cá nhân</h3>
              <p className="text-gray-700 mb-4">
                Chúng tôi thu thập thông tin bạn cung cấp trực tiếp, bao gồm:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Tên, địa chỉ email, số điện thoại</li>
                <li>Thông tin thanh toán</li>
                <li>Ảnh đại diện và thông tin hồ sơ</li>
                <li>Nội dung bạn tạo hoặc chia sẻ</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Thông tin tự động</h3>
              <p className="text-gray-700 mb-4">
                Chúng tôi tự động thu thập một số thông tin khi bạn sử dụng dịch vụ:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Địa chỉ IP và thông tin thiết bị</li>
                <li>Thông tin trình duyệt và hệ điều hành</li>
                <li>Dữ liệu về cách bạn tương tác với dịch vụ</li>
                <li>Cookies và công nghệ tracking tương tự</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
              <p className="text-gray-700 mb-4">
                Chúng tôi sử dụng thông tin của bạn để:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cung cấp và cải thiện dịch vụ</li>
                <li>Xử lý giao dịch và thanh toán</li>
                <li>Gửi thông báo quan trọng về tài khoản</li>
                <li>Cung cấp hỗ trợ khách hàng</li>
                <li>Cá nhân hóa trải nghiệm học tập</li>
                <li>Phân tích và cải thiện hiệu suất</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Chia sẻ thông tin</h2>
              <p className="text-gray-700 mb-4">
                Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi có thể chia sẻ 
                thông tin trong những trường hợp sau:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Với sự đồng ý của bạn</li>
                <li>Với các nhà cung cấp dịch vụ đáng tin cậy</li>
                <li>Để tuân thủ pháp luật hoặc bảo vệ quyền lợi</li>
                <li>Trong trường hợp sáp nhập hoặc mua lại</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Bảo mật thông tin</h2>
              <p className="text-gray-700 mb-4">
                Chúng tôi thực hiện các biện pháp bảo mật kỹ thuật và tổ chức để 
                bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát hoặc sử dụng sai mục đích.
              </p>
              <p className="text-gray-700 mb-4">
                Các biện pháp bảo mật bao gồm:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Mã hóa dữ liệu khi truyền tải</li>
                <li>Kiểm soát truy cập nghiêm ngặt</li>
                <li>Giám sát bảo mật 24/7</li>
                <li>Cập nhật bảo mật thường xuyên</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Quyền của bạn</h2>
              <p className="text-gray-700 mb-4">
                Bạn có các quyền sau đối với thông tin cá nhân của mình:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Truy cập và xem thông tin cá nhân</li>
                <li>Sửa đổi thông tin không chính xác</li>
                <li>Xóa tài khoản và dữ liệu</li>
                <li>Hạn chế xử lý thông tin</li>
                <li>Chuyển đổi dữ liệu sang nền tảng khác</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng. 
                Bạn có thể quản lý cookies thông qua cài đặt trình duyệt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Liên hệ</h2>
              <p className="text-gray-700">
                Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@cabala.edu.vn<br />
                  <strong>Địa chỉ:</strong> Tầng 10, Tòa nhà ABC, Quận 1, TP.HCM<br />
                  <strong>Điện thoại:</strong> 1900 1234
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 