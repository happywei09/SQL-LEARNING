# 📝 Bộ Prompt Hướng Dẫn AI Tạo Bài Tập SQL Server (CSV)

Dưới đây là các lựa chọn Prompt để bạn đính kèm cùng **Schema CSDL** và **Tài liệu bài học** gửi cho AI (ChatGPT, Gemini, Claude) để tạo dữ liệu luyện tập chuẩn xác nhất.

---

## 📌 LỰA CHỌN 1: Prompt Tạo Bài Tập Thực Hành SQL Cho Từng Chương Cụ Thể (Chuyên sâu)
> [!TIP]
> Hãy dùng prompt này khi bạn muốn tạo thật nhiều bài tập thực hành truy vấn chi tiết và chất lượng cho duy nhất **1 chương** nào đó.

```text
Chào AI, tôi đang xây dựng ứng dụng luyện tập SQL Server. Dưới đây là Schema cơ sở dữ liệu (QLDSV_HTC) của tôi:

1. KHOA (MAKHOA, TENKHOA, SODT)
2. LOP (MALOP, TENLOP, KHOAHOC, MAKHOA)
3. SINHVIEN (MASV, HO, TEN, PHAI, DIACHI, NGAYSINH, MALOP, DANGHOC, MATKHAU) - Phái (0: Nam, 1: Nữ)
4. MONHOC (MAMH, TENMH, SOTIET_LT, SOTIET_TH)
5. GIANGVIEN (MAGV, MAKHOA, HO, TEN, HOCVI, HOCHAM, CHUYENMON)
6. LOPTINCHI (MALTC, NIENKHOA, HOCKY, MAMH, NHOM, MAGV, MAKHOA, SOSVTOITHIEU, HUYLOP)
7. DANGKY (MALTC, MASV, DIEM_CC, DIEM_GK, DIEM_CK, HUYDANGKY)

Nhiệm vụ của bạn:
Dựa trên tài liệu bài học đính kèm, hãy tạo cho tôi danh sách bài tập SQL Server thực hành chuyên sâu cho:
- CHƯƠNG SỐ: [ĐIỀN SỐ CHƯƠNG VÀO ĐÂY, VÍ DỤ: 4]
- TÊN CHƯƠNG: [ĐIỀN TÊN CHƯƠNG VÀO ĐÂY, VÍ DỤ: Truy Vấn Dữ Liệu Gộp & Stored Procedure]

Đầu ra bắt buộc là một khối mã định dạng CSV chuẩn (RFC 4180) với các yêu cầu:
1. File CSV có đúng các cột:
   Chapter,Title,Description,Difficulty,ExpectedQuery,Hint

2. Ý nghĩa các cột:
   - Chapter: Điền đúng số chương [VÍ DỤ: 4].
   - Title: Tên bài tập ngắn gọn bằng tiếng Việt.
   - Description: Mô tả chi tiết yêu cầu đề bài bằng tiếng Việt (rõ ràng, chỉ rõ cần lấy những cột nào, điều kiện là gì).
   - Difficulty: "Dễ", "Trung bình", hoặc "Khó". (Hãy tạo khoảng 40% câu Dễ, 40% câu Trung bình, 20% câu Khó).
   - ExpectedQuery: Câu lệnh SQL mẫu chuẩn chạy chính xác trên CSDL SQL Server.
   - Hint: Gợi ý cách viết truy vấn ngắn gọn.

3. Quy chuẩn định dạng CSV để tránh lỗi import:
   - Dùng dấu phẩy (,) ngăn cách các cột.
   - BẮT BUỘC bao quanh các trường dữ liệu bằng dấu nháy kép (") nếu trường đó chứa dấu phẩy (,) hoặc ký tự xuống dòng.
   - Nếu có dấu nháy kép (") bên trong giá trị, hãy đổi thành hai dấu nháy kép liên tiếp ("").
   - Chỉ trả về duy nhất khối mã CSV, không viết thêm lời giải thích hay lời mở đầu/kết thúc nào khác.

Hãy tạo cho tôi 10 bài tập chất lượng cao cho chương này.
```

---

## 📌 LỰA CHỌN 2: Prompt Tạo Bài Tập Thực Hành SQL Cho Nhiều Chương Cùng Lúc (Đa dạng)
> [!TIP]
> Hãy dùng prompt này khi bạn muốn tạo một bộ bài tập thực hành truy vấn bao quát, phân bổ đều trên toàn bộ giáo trình (từ Chương 1 đến Chương 8).

```text
Chào AI, tôi đang xây dựng ứng dụng luyện tập SQL Server. Dưới đây là Schema cơ sở dữ liệu (QLDSV_HTC) của tôi:

1. KHOA (MAKHOA, TENKHOA, SODT)
2. LOP (MALOP, TENLOP, KHOAHOC, MAKHOA)
3. SINHVIEN (MASV, HO, TEN, PHAI, DIACHI, NGAYSINH, MALOP, DANGHOC, MATKHAU) - Phái (0: Nam, 1: Nữ)
4. MONHOC (MAMH, TENMH, SOTIET_LT, SOTIET_TH)
5. GIANGVIEN (MAGV, MAKHOA, HO, TEN, HOCVI, HOCHAM, CHUYENMON)
6. LOPTINCHI (MALTC, NIENKHOA, HOCKY, MAMH, NHOM, MAGV, MAKHOA, SOSVTOITHIEU, HUYLOP)
7. DANGKY (MALTC, MASV, DIEM_CC, DIEM_GK, DIEM_CK, HUYDANGKY)

Nhiệm vụ của bạn:
Dựa trên tài liệu bài học đính kèm (các chương 1 đến 8), hãy tạo cho tôi danh sách bài tập SQL Server thực hành (T-SQL) trải đều trên tất cả các chương.

Đầu ra bắt buộc là một khối mã định dạng CSV chuẩn (RFC 4180) với các yêu cầu:
1. File CSV có đúng các cột:
   Chapter,Title,Description,Difficulty,ExpectedQuery,Hint

2. Ý nghĩa các cột:
   - Chapter: Số chương tương ứng từ 1 đến 8 dựa theo nội dung bài học.
   - Title: Tên bài tập ngắn gọn bằng tiếng Việt.
   - Description: Mô tả chi tiết yêu cầu đề bài bằng tiếng Việt (rõ ràng, chỉ rõ cần lấy những cột nào, điều kiện là gì).
   - Difficulty: "Dễ", "Trung bình", hoặc "Khó".
   - ExpectedQuery: Câu lệnh SQL mẫu chuẩn chạy chính xác trên CSDL SQL Server.
   - Hint: Gợi ý cách viết truy vấn ngắn gọn.

3. Quy chuẩn định dạng CSV để tránh lỗi import:
   - Dùng dấu phẩy (,) ngăn cách các cột.
   - BẮT BUỘC bao quanh các trường dữ liệu bằng dấu nháy kép (") nếu trường đó chứa dấu phẩy (,) hoặc ký tự xuống dòng.
   - Nếu có dấu nháy kép (") bên trong giá trị, hãy đổi thành hai dấu nháy kép liên tiếp ("").
   - Chỉ trả về duy nhất khối mã CSV, không viết thêm lời giải thích hay lời mở đầu/kết thúc nào khác.

Hãy tạo cho tôi tổng cộng 24 bài tập (mỗi chương từ chương 1 đến chương 8 có đúng 3 bài tập từ Dễ đến Khó).
```

---

## 📌 LỰA CHỌN 3: Prompt Tạo Câu Hỏi Trắc Nghiệm (Quizzes) Từ Tài Liệu Bài Học
> [!TIP]
> Hãy dùng prompt này khi bạn muốn tạo bộ câu hỏi trắc nghiệm (gồm câu hỏi, 4 phương án, đáp án đúng, giải thích) từ tài liệu đính kèm.

```text
Chào AI, tôi đang xây dựng ứng dụng học tập trắc nghiệm SQL Server.

Nhiệm vụ của bạn:
Dựa trên tài liệu lý thuyết bài học đính kèm (các chương 1 đến 8), hãy tạo cho tôi danh sách câu hỏi trắc nghiệm khách quan (Quizzes) để kiểm duyệt kiến thức lý thuyết của học viên.

Đầu ra bắt buộc là một khối mã định dạng CSV chuẩn (RFC 4180) với các yêu cầu:
1. File CSV có đúng các cột:
   Chapter,Question,Option1,Option2,Option3,Option4,AnswerIndex,Explanation

2. Ý nghĩa các cột:
   - Chapter: Số chương tương ứng từ 1 đến 8 (hoặc số chương tự chọn khác).
   - Question: Nội dung câu hỏi trắc nghiệm (bằng tiếng Việt).
   - Option1: Phương án lựa chọn A.
   - Option2: Phương án lựa chọn B.
   - Option3: Phương án lựa chọn C.
   - Option4: Phương án lựa chọn D.
   - AnswerIndex: Số nguyên từ 1 đến 4 đại diện cho phương án đúng (1 tương ứng Option1, 2 tương ứng Option2, 3 tương ứng Option3, 4 tương ứng Option4).
   - Explanation: Giải thích chi tiết tại sao phương án đó lại đúng (bằng tiếng Việt).

3. Quy chuẩn định dạng CSV để tránh lỗi import:
   - Dùng dấu phẩy (,) ngăn cách các cột.
   - BẮT BUỘC bao quanh các trường dữ liệu bằng dấu nháy kép (") nếu trường đó chứa dấu phẩy (,) hoặc ký tự xuống dòng.
   - Nếu có dấu nháy kép (") bên trong giá trị, hãy đổi thành hai dấu nháy kép liên tiếp ("").
   - Chỉ trả về duy nhất khối mã CSV, không viết thêm lời giải thích hay lời mở đầu/kết thúc nào khác.

Hãy tạo cho tôi tổng cộng 16 câu hỏi trắc nghiệm (mỗi chương từ chương 1 đến chương 8 có đúng 2 câu hỏi từ cơ bản đến nâng cao).
```
