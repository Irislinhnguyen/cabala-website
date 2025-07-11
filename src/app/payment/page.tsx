'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PaymentData {
  courseId: string;
  courseName: string;
  price: number;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const courseName = searchParams.get('courseName');
    const price = searchParams.get('price');

    if (courseId && courseName && price) {
      setPaymentData({
        courseId,
        courseName: decodeURIComponent(courseName),
        price: parseFloat(price),
      });
    }

    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentData || !uploadedFile) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('courseId', paymentData.courseId);
      formData.append('amount', paymentData.price.toString());
      formData.append('receipt', uploadedFile);
      
      const response = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStep(3);
      } else {
        alert('Có lỗi xảy ra: ' + result.error);
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('Có lỗi xảy ra khi gửi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-cabala-neutral flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cabala-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cabala-neutral">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4">
            <Link href={`/course/${paymentData.courseId}`}>
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-cabala-navy">Thanh toán khóa học</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-cabala-orange text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-cabala-orange' : 'bg-neutral-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-cabala-orange text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-cabala-orange' : 'bg-neutral-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-cabala-orange text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Xác nhận đăng ký</CardTitle>
                    <CardDescription>
                      Kiểm tra thông tin khóa học trước khi thanh toán
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-cabala-neutral/30 rounded-lg">
                      <h3 className="font-semibold text-cabala-navy mb-2">Khóa học đã chọn</h3>
                      <p className="text-lg">{paymentData.courseName}</p>
                      <p className="text-2xl font-bold text-cabala-orange mt-2">
                        {formatPrice(paymentData.price)}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-cabala-navy">Bạn sẽ nhận được:</h3>
                      <div className="space-y-2">
                        {[
                          'Truy cập trọn đời vào khóa học',
                          'Chứng chỉ hoàn thành có giá trị',
                          'Hỗ trợ trực tiếp từ giảng viên',
                          'Tham gia cộng đồng học tập',
                          'Tài liệu và bài tập thực hành'
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-cabala-orange hover:bg-cabala-orange-dark"
                      onClick={() => setStep(2)}
                    >
                      Tiếp tục thanh toán
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thanh toán qua chuyển khoản</CardTitle>
                    <CardDescription>
                      Chuyển khoản theo thông tin bên dưới và tải lên ảnh chụp biên lai
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bank Info */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">Thông tin chuyển khoản</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Ngân hàng:</span>
                          <span className="font-medium">VIB - Ngân hàng Quốc tế Việt Nam</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Số tài khoản:</span>
                          <span className="font-medium">0287040600051592</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Chủ tài khoản:</span>
                          <span className="font-medium">NGUYEN THUY LINH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Số tiền:</span>
                          <span className="font-medium text-cabala-orange">{formatPrice(paymentData.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Nội dung:</span>
                          <span className="font-medium">CABALA {paymentData.courseId}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="text-center p-6 bg-neutral-50 rounded-lg">
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h4m4 0V4m-4 4h2m2 0h4M4 16h2m2 0h2m8 0h2M4 20h2m2 0h8" />
                          </svg>
                          <p className="text-sm text-neutral-500">QR Code sẽ được hiển thị ở đây</p>
                          <p className="text-xs text-neutral-400 mt-1">Quét để chuyển khoản nhanh</p>
                        </div>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-cabala-navy">Tải lên biên lai chuyển khoản</h3>
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <svg className="w-12 h-12 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-neutral-600">
                            {uploadedFile ? uploadedFile.name : 'Nhấn để chọn ảnh biên lai'}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Quay lại
                      </Button>
                      <Button 
                        className="flex-1 bg-cabala-orange hover:bg-cabala-orange-dark"
                        onClick={handleSubmitPayment}
                        disabled={!uploadedFile || loading}
                      >
                        {loading ? 'Đang gửi...' : 'Gửi thanh toán'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-green-600">Thanh toán thành công!</CardTitle>
                    <CardDescription className="text-center">
                      Cảm ơn bạn đã đăng ký khóa học tại Cabala
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-cabala-navy">Đăng ký thành công!</h3>
                      <p className="text-neutral-600">
                        Biên lai thanh toán của bạn đã được gửi thành công. Chúng tôi sẽ xác nhận trong vòng 24 giờ.
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Bạn sẽ nhận được email xác nhận và link truy cập khóa học sau khi thanh toán được duyệt.
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Về Dashboard
                        </Button>
                      </Link>
                      <Link href="/" className="flex-1">
                        <Button className="w-full bg-cabala-orange hover:bg-cabala-orange-dark">
                          Trang chủ
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-cabala-navy">{paymentData.courseName}</h4>
                    <Badge variant="secondary" className="text-xs">Khóa học trực tuyến</Badge>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Giá khóa học:</span>
                      <span>{formatPrice(paymentData.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí xử lý:</span>
                      <span>Miễn phí</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-cabala-orange">{formatPrice(paymentData.price)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-500 mt-4">
                    Bằng cách tiếp tục, bạn đồng ý với{' '}
                    <Link href="/terms" className="text-cabala-orange hover:underline">
                      điều khoản dịch vụ
                    </Link>{' '}
                    của chúng tôi.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cabala-neutral flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cabala-orange border-t-transparent rounded-full"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}