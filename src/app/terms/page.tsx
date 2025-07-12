'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="full" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Điều khoản dịch vụ</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Ngày cập nhật:</strong> 15 tháng 1, 2024
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giới thiệu</h2>
              <p className="text-gray-700 mb-4">
                Chào mừng bạn đến với Cabala ("chúng tôi", "của chúng tôi", hoặc "Cabala"). 
                Những điều khoản dịch vụ này ("Điều khoản") điều chỉnh việc sử dụng trang web, 
                ứng dụng di động và các dịch vụ khác được cung cấp bởi Cabala.
              </p>
              <p className="text-gray-700">
                Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ 
                và bị ràng buộc bởi những Điều khoản này. Nếu bạn không đồng ý với bất kỳ 
                phần nào của những điều khoản này, thì bạn không được phép sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tài khoản người dùng</h2>
              <p className="text-gray-700 mb-4">
                Để truy cập một số tính năng của dịch vụ, bạn có thể được yêu cầu tạo tài khoản. 
                Bạn có trách nhiệm:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cung cấp thông tin chính xác và đầy đủ khi tạo tài khoản</li>
                <li>Duy trì và kịp thời cập nhật thông tin tài khoản</li>
                <li>Bảo mật thông tin đăng nhập của bạn</li>
                <li>Chịu tr책nhiệm về tất cả các hoạt động diễn ra trong tài khoản của bạn</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sử dụng dịch vụ</h2>
              <p className="text-gray-700 mb-4">
                Bạn được phép sử dụng dịch vụ của chúng tôi cho mục đích học tập cá nhân. 
                Bạn đồng ý không:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào</li>
                <li>Tải lên hoặc truyền tải bất kỳ nội dung có hại, phỉ báng hoặc bất hợp pháp</li>
                <li>Cố gắng có quyền truy cập trái phép vào hệ thống hoặc mạng</li>
                <li>Sao chép, phân phối hoặc tái sản xuất nội dung mà không có sự cho phép</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Thanh toán và hoàn tiền</h2>
              <p className="text-gray-700 mb-4">
                Một số dịch vụ của chúng tôi có thể yêu cầu thanh toán. Bằng cách mua hàng, 
                bạn đồng ý cung cấp thông tin thanh toán chính xác và đầy đủ.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Chính sách hoàn tiền:</strong> Bạn có thể yêu cầu hoàn tiền trong 
                vòng 7 ngày kể từ ngày mua hàng nếu chưa hoàn thành quá 20% nội dung khóa học.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Quyền sở hữu trí tuệ</h2>
              <p className="text-gray-700 mb-4">
                Tất cả nội dung có trên dịch vụ của chúng tôi, bao gồm văn bản, hình ảnh, 
                video, âm thanh và các tài liệu khác, đều thuộc sở hữu của Cabala hoặc 
                các bên cấp phép của chúng tôi.
              </p>
              <p className="text-gray-700">
                Bạn được cấp quyền hạn chế, không độc quyền, không thể chuyển nhượng để 
                truy cập và sử dụng nội dung chỉ cho mục đích học tập cá nhân.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Chấm dứt</h2>
              <p className="text-gray-700 mb-4">
                Chúng tôi có thể chấm dứt hoặc đình chỉ quyền truy cập của bạn ngay lập tức, 
                không cần thông báo trước, vì bất kỳ lý do gì, bao gồm cả việc vi phạm 
                những Điều khoản này.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Liên hệ</h2>
              <p className="text-gray-700">
                Nếu bạn có bất kỳ câu hỏi nào về những Điều khoản này, vui lòng liên hệ 
                với chúng tôi qua email: <a href="mailto:support@cabala.edu.vn" className="text-blue-600 hover:text-blue-800">support@cabala.edu.vn</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 