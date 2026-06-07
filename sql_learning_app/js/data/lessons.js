export const lessons = [
  {
    id: 1, title: "Tổng Quan Về SQL Server",
    tag: "Kiến trúc & Dịch vụ",
    summary: "Kiến trúc Client/Server, các API truy xuất dữ liệu, các dịch vụ hệ thống và các đối tượng CSDL.",
    content: `
<h2>I. Kiến Trúc Mạng Của SQL Server</h2>
<p>SQL Server hoạt động theo mô hình <strong>Client/Server</strong>. Client gửi yêu cầu thông qua các API (OLE DB, ODBC, DB-Library) → Thư viện mạng Client → IPC → Thư viện mạng Server → Open Data Services (ODS) → SQL Server xử lý và trả kết quả.</p>
<ul>
  <li><strong>OLE DB</strong>: API hiện đại nhất, hỗ trợ truy cập nhiều nguồn dữ liệu</li>
  <li><strong>ODBC</strong>: Giao diện chuẩn để kết nối CSDL quan hệ</li>
  <li><strong>DB-Library</strong>: API cũ, dùng cho các phiên bản SQL Server trước</li>
</ul>
<p>Giao thức mạng hỗ trợ: <code>TCP/IP</code>, <code>Named Pipes</code>, <code>Shared Memory</code>, IPX/SPX.</p>

<h2>II. Các Dịch Vụ Trong SQL Server</h2>
<ul>
  <li><strong>Database Engine</strong>: Lưu trữ, bảo mật, xử lý giao dịch</li>
  <li><strong>Full-Text Search</strong>: Tìm kiếm toàn văn bản</li>
  <li><strong>SQL Server Service</strong>: Quản lý file CSDL, thực thi câu lệnh SQL</li>
  <li><strong>SQL Server Agent</strong>: Lập lịch Jobs, Alerts tự động</li>
  <li><strong>MSDTC</strong>: Điều phối giao tác phân tán</li>
</ul>

<h2>III. Multiple Instances</h2>
<p>SQL Server hỗ trợ nhiều Instance chạy đồng thời trên cùng 1 máy:</p>
<ul>
  <li><strong>Default Instance</strong>: Nhận diện bằng tên máy tính</li>
  <li><strong>Named Instance</strong>: Nhận diện bằng <code>computer_name\\instance_name</code></li>
</ul>
<pre><code>-- Kiểm tra tên Server hiện tại
SELECT @@SERVERNAME</code></pre>

<h2>IV. Transact-SQL (T-SQL)</h2>
<p>T-SQL chia thành 3 loại:</p>
<ul>
  <li><strong>DDL</strong>: CREATE, ALTER, DROP (Database, Table, View...)</li>
  <li><strong>DML</strong>: SELECT, INSERT, UPDATE, DELETE, MERGE</li>
  <li><strong>DCL</strong>: GRANT, REVOKE, DENY</li>
</ul>

<h2>V. Kiến Trúc CSDL</h2>
<p>SQL Server có 4 CSDL hệ thống mặc định:</p>
<ul>
  <li><strong>master</strong>: Lưu thông tin mức hệ thống (login, cấu hình)</li>
  <li><strong>model</strong>: Template khi tạo CSDL mới</li>
  <li><strong>msdb</strong>: Lưu lịch Jobs, Alerts, Backup</li>
  <li><strong>tempdb</strong>: Chứa table tạm, được tạo lại mỗi lần SQL Server khởi động</li>
</ul>

<h2>VI. Các Đối Tượng CSDL</h2>
<ul>
  <li><strong>Table</strong>: Table hệ thống, Table tạm (#local, ##global), Table user</li>
  <li><strong>View</strong>: Table ảo từ câu lệnh SELECT</li>
  <li><strong>Index</strong>: Clustered Index (1/table) và Non-clustered Index (max 1024/table)</li>
  <li><strong>Constraint</strong>: PK, FK, Unique, Check, Not Null</li>
  <li><strong>Stored Procedure, Trigger, UDF</strong></li>
</ul>
`
  },
  {
    id: 2, title: "Hệ Quản Trị SQL Server",
    tag: "SSMS & Cấu hình",
    summary: "Cài đặt, cấu hình SQL Server Management Studio, quản lý Server và CSDL.",
    content: `
<h2>I. Cấu Hình SSMS</h2>
<p>Vào <code>Tools → Options</code> để cấu hình:</p>
<ul>
  <li><strong>SET NOCOUNT ON</strong>: Ngăn thông báo số dòng bị ảnh hưởng → Giảm tải mạng</li>
  <li><strong>SET NOEXEC ON</strong>: Biên dịch nhưng KHÔNG thực thi query</li>
  <li><strong>SET CONCAT_NULL_YIELDS_NULL</strong>: ON → <code>'abc' + NULL = NULL</code>; OFF → <code>'abc' + NULL = 'abc'</code></li>
</ul>

<h2>II. Đăng Ký Server</h2>
<p>Vào <code>View → Registered Servers</code>, chọn Authentication mode:</p>
<ul>
  <li><strong>Windows Authentication</strong>: Dùng tài khoản Windows</li>
  <li><strong>SQL Server Authentication</strong>: Login name + Password riêng</li>
</ul>

<h2>III. Thuộc Tính Server</h2>
<p>Right-click tên Server → Properties → 8 tabs: General, Memory, Processors, Security, Connections, Database Settings, Advanced, Permissions.</p>

<h2>IV. Giao Thức Kết Nối</h2>
<ul>
  <li><strong>Shared Memory</strong>: Client và Server cùng 1 máy</li>
  <li><strong>TCP/IP</strong>: Kết nối qua LAN/WAN</li>
  <li><strong>Named Pipes</strong>: Kết nối qua mạng LAN</li>
</ul>

<h2>V. Quản Lý CSDL</h2>
<p>Right-click Database → New Database → Nhập tên, cấu hình file .mdf và .ldf</p>
<ul>
  <li><strong>Restrict Access</strong>: Multi User (mặc định), Single User, Restricted Users</li>
  <li><strong>Database Read-Only</strong>: Chỉ cho phép đọc dữ liệu</li>
</ul>
`
  },
  {
    id: 3, title: "Data Definition Language (DDL)",
    tag: "CREATE / ALTER / DROP",
    summary: "Tạo CSDL, Table, View, Index, Constraint, và phân quyền trên đối tượng.",
    content: `
<h2>I. Tạo CSDL</h2>
<pre><code>CREATE DATABASE QLVT
ON PRIMARY (
  Name = Qlvt1,
  Filename = 'c:\\data\\qlvt1.mdf',
  Size = 10MB, MaxSize = 100MB, FileGrowth = 10MB
)
LOG ON (
  Name = QlvtLog,
  Filename = 'c:\\data\\qlvt1_log.ldf',
  Size = 10MB, MaxSize = 100MB, FileGrowth = 10MB
)</code></pre>
<p>Thao tác khác: <code>ALTER DATABASE ... ADD FILE</code>, <code>REMOVE FILE</code>, <code>MODIFY FILE</code>, <code>DROP DATABASE</code></p>

<h2>II. Tạo Table</h2>
<pre><code>CREATE TABLE Nhanvien (
  MANV    int PRIMARY KEY,
  HO      nVarChar(40) NOT NULL,
  TEN     nVarChar(10) NOT NULL,
  PHAI    nVarchar(3) NOT NULL DEFAULT 'Nam',
  LUONG   Money DEFAULT 800000
          CHECK (Luong >= 800000 AND Luong <= 6000000)
)</code></pre>
<h3>Ràng buộc (Constraints)</h3>
<ul>
  <li><strong>PRIMARY KEY</strong>: Khóa chính, duy nhất, không NULL</li>
  <li><strong>FOREIGN KEY ... REFERENCES</strong>: Khóa ngoại, ON DELETE CASCADE</li>
  <li><strong>UNIQUE</strong>: Không trùng, cho phép NULL</li>
  <li><strong>CHECK</strong>: Kiểm tra miền giá trị</li>
  <li><strong>DEFAULT</strong>: Giá trị mặc định</li>
</ul>

<h2>III. Tạo View</h2>
<pre><code>CREATE VIEW V_NV_nam AS
SELECT * FROM Nhanvien WHERE Phai='Nam'

-- View Read-Only khi có GROUP BY hoặc SubQuery
-- WITH CHECK OPTION: Ngăn vi phạm điều kiện View</code></pre>

<h2>IV. Tạo Index</h2>
<pre><code>CREATE INDEX IX_Tenho ON Nhanvien (Ten, Ho)
-- Sử dụng: SELECT * FROM Nhanvien WITH (INDEX(IX_Tenho))
DROP INDEX Nhanvien.IX_Tenho</code></pre>

<h2>V. GRANT / REVOKE</h2>
<pre><code>GRANT SELECT, UPDATE (HO, TEN) ON Nhanvien TO lnkthu
REVOKE INSERT ON Nhanvien TO lnkthu</code></pre>
`
  },
  {
    id: 4, title: "Data Manipulation Language & SP",
    tag: "SELECT / INSERT / SP",
    summary: "Câu lệnh SELECT nâng cao, INSERT, UPDATE, DELETE, MERGE và Stored Procedure.",
    content: `
<h2>I. Lệnh SELECT</h2>
<pre><code>SELECT [DISTINCT] [TOP n] danh_sách_cột
FROM nguồn_dữ_liệu
[WHERE điều_kiện]
[GROUP BY cột [HAVING đk]]
[ORDER BY cột [DESC]]</code></pre>
<h3>Toán tử thường dùng</h3>
<p><code>BETWEEN...AND</code>, <code>IN (...)</code>, <code>LIKE '%abc_'</code>, <code>IS NULL</code>, <code>EXISTS</code>, <code>NOT IN (SubQuery)</code></p>
<h3>CASE Expression</h3>
<pre><code>SELECT MANV, CASE
  WHEN DOANHSO < 20000000 THEN 1
  WHEN DOANHSO < 50000000 THEN 2
  ELSE 3
END AS LoaiNV FROM #TAM</code></pre>

<h2>II. INSERT / UPDATE / DELETE</h2>
<pre><code>INSERT INTO VATTU (MAVT, TENVT, DVT)
VALUES ('VT01', N'Máy giặt LG', N'Cái')

UPDATE Nhanvien SET TEN = N'Diệp' WHERE MANV = 1

DELETE FROM Nhanvien WHERE MANV = 2
TRUNCATE TABLE Nhanvien  -- Nhanh hơn DELETE</code></pre>

<h2>III. Lệnh MERGE</h2>
<pre><code>MERGE INTO VATTU AS Target
USING (SELECT 'VT20' AS MAVT, N'Đường' AS TENVT) AS Source
ON Target.MAVT = Source.MAVT
WHEN MATCHED THEN UPDATE SET SOLUONGTON = 20
WHEN NOT MATCHED THEN INSERT (MAVT, TENVT) VALUES (Source.MAVT, Source.TENVT);</code></pre>

<h2>IV. Stored Procedure</h2>
<pre><code>CREATE PROC sp_ThongKe @SoPX INT OUTPUT
AS
  SELECT MANV, SUM(SOLUONG*DONGIA) AS Tong
  FROM PhatSinh PS JOIN CT_PHATSINH CT ON PS.PHIEU=CT.PHIEU
  WHERE Loai='X' GROUP BY MANV
  SELECT @SoPX = COUNT(*) FROM PHATSINH WHERE LOAI='X'
  RETURN 0

-- Gọi:
DECLARE @n INT
EXEC sp_ThongKe @n OUTPUT</code></pre>
<h3>Transaction</h3>
<pre><code>BEGIN TRAN
BEGIN TRY
  UPDATE ... ; UPDATE ...
  COMMIT
END TRY
BEGIN CATCH
  ROLLBACK
  RAISERROR(ERROR_MESSAGE(), 16, 1)
END CATCH</code></pre>
`
  },
  {
    id: 5, title: "Cơ Chế An Toàn Bảo Mật",
    tag: "Login / User / Role",
    summary: "Các mức bảo mật, Login vs User, Server Role vs Database Role, GRANT/REVOKE/DENY.",
    content: `
<h2>I. Các Mức Bảo Mật</h2>
<ul>
  <li><strong>Server</strong>: Login name (đăng nhập vào SQL Server)</li>
  <li><strong>Database</strong>: User name (quyền truy cập CSDL)</li>
  <li><strong>Table</strong>: GRANT/REVOKE (quyền trên Table)</li>
  <li><strong>Field</strong>: GRANT/REVOKE trên từng cột</li>
</ul>
<p><strong>Login</strong> ≠ <strong>User</strong>: Login đại diện cho 1 người đăng nhập SQL Server; User đại diện cho 1 người dùng trong 1 CSDL cụ thể.</p>

<h2>II. Role (Nhóm quyền)</h2>
<h3>Server Roles (7 nhóm cố định)</h3>
<ul>
  <li><code>sysadmin</code>: Toàn quyền trên Server</li>
  <li><code>dbcreator</code>: Tạo/Thay đổi/Phục hồi CSDL</li>
  <li><code>securityadmin</code>: Quản lý logon, mật khẩu</li>
  <li><code>serveradmin</code>: Cấu hình Server</li>
</ul>
<h3>Database Roles (10 nhóm cố định)</h3>
<ul>
  <li><code>db_owner</code>: Toàn quyền trên CSDL</li>
  <li><code>db_datareader</code>: Đọc dữ liệu</li>
  <li><code>db_datawriter</code>: Thêm/Sửa/Xóa dữ liệu</li>
  <li><code>db_ddladmin</code>: Tạo/Sửa/Xóa đối tượng</li>
  <li><code>db_backupoperator</code>: Backup CSDL</li>
  <li><code>db_securityadmin</code>: Quản lý nhóm, quyền</li>
  <li><code>db_denydatareader / db_denydatawriter</code>: Cấm đọc/ghi</li>
</ul>

<h2>III. Stored Procedure Quản Lý Login</h2>
<pre><code>EXEC sp_addlogin 'Nhon', 'password', 'QLVT'
EXEC sp_grantdbaccess 'Nhon'
EXEC sp_addrole 'PKD'
EXEC sp_addrolemember 'PKD', 'Nhon'
EXEC sp_password NULL, 'newpass', 'Nhon'
EXEC sp_droplogin 'Nhon'</code></pre>
`
  },
  {
    id: 6, title: "Sao Lưu & Phục Hồi Dữ Liệu",
    tag: "Backup / Restore",
    summary: "Thiết bị backup, các loại backup (Full, Differential, Transaction Log), Restore Database.",
    content: `
<h2>I. Sao Lưu (Backup)</h2>
<h3>Thiết bị Backup</h3>
<pre><code>EXEC sp_addumpdevice 'disk', 'MyDevice', 'C:\\backup\\data.bak'
EXEC sp_dropdevice 'MyDevice', 'delfile'</code></pre>

<h3>Các Loại Backup</h3>
<ul>
  <li><strong>Full Backup</strong>: Toàn bộ CSDL tại thời điểm backup</li>
  <li><strong>Differential</strong>: Chỉ các trang dữ liệu thay đổi kể từ lần Full gần nhất</li>
  <li><strong>Transaction Log</strong>: Sao lưu nhật ký giao tác, đồng thời cắt bớt log file</li>
</ul>
<pre><code>BACKUP DATABASE QLVT TO DISK = 'D:\\backup\\QLVT.bak'
BACKUP DATABASE QLVT TO DISK = 'D:\\backup\\QLVT.bak' WITH DIFFERENTIAL
BACKUP LOG QLVT TO DISK = 'D:\\backup\\QLVT.trn'</code></pre>

<h3>Tùy chọn quan trọng</h3>
<ul>
  <li><code>WITH INIT</code>: Ghi đè file backup hiện tại</li>
  <li><code>NOINIT</code> (mặc định): Ghi nối tiếp các bản backup</li>
  <li><code>NO_TRUNCATE</code>: Không cắt bớt log file</li>
  <li><code>NORECOVERY</code>: Đưa CSDL vào trạng thái 'restoring'</li>
</ul>

<h2>II. Phục Hồi (Restore)</h2>
<pre><code>-- Full restore
RESTORE DATABASE QLVT FROM DISK = 'D:\\backup\\QLVT.bak'

-- Full + Log (phục hồi về thời điểm cụ thể)
RESTORE DATABASE QLVT FROM DISK = 'D:\\backup\\QLVT.bak' WITH NORECOVERY
RESTORE LOG QLVT FROM DISK = 'D:\\backup\\QLVT.trn'
  WITH STOPAT = '2018-12-05 07:20:00'
ALTER DATABASE QLVT SET MULTI_USER</code></pre>
<p><code>WITH REPLACE</code>: Ghi đè CSDL hiện có. <code>FILE = n</code>: Chọn bản backup thứ n.</p>
`
  },
  {
    id: 7, title: "Nhân Bản Dữ Liệu (Replication)",
    tag: "Publisher / Subscriber",
    summary: "Các thành phần (Publisher, Distributor, Subscriber) và 3 kiểu nhân bản dữ liệu.",
    content: `
<h2>I. Khái Niệm</h2>
<p>Nhân bản dữ liệu = Phân bố bản sao dữ liệu từ <strong>nguồn (Publisher)</strong> đến <strong>đích (Subscriber)</strong> tự động theo mô hình push-pull.</p>

<h2>II. Các Thành Phần</h2>
<ul>
  <li><strong>Article</strong>: Đơn vị dữ liệu cơ sở (1 table, 1 view, 1 SP...)</li>
  <li><strong>Publication</strong>: Nhóm các Article để nhân bản</li>
  <li><strong>Publisher</strong>: Server chứa CSDL gốc</li>
  <li><strong>Distributor</strong>: Chuyển dữ liệu giữa Publisher ↔ Subscriber</li>
  <li><strong>Subscriber</strong>: Server nhận dữ liệu nhân bản</li>
  <li><strong>Subscription</strong>: CSDL chứa các Article đã nhân bản</li>
</ul>

<h2>III. Các Kiểu Nhân Bản</h2>
<h3>1. Snapshot Replication</h3>
<p>Copy toàn bộ dữ liệu tại 1 thời điểm → Phù hợp khi <strong>không cần dữ liệu real-time</strong> (VD: hệ hỗ trợ quyết định cập nhật cuối ngày).</p>

<h3>2. Transactional Replication</h3>
<p>Dùng Transaction Log để nhân bản từng giao tác → <strong>Dữ liệu gần real-time</strong> (VD: 2 chi nhánh cùng đặt hàng từ chung 1 kho).</p>

<h3>3. Merge Replication</h3>
<p>Theo dõi thay đổi ở cả 2 phía, đồng bộ khi kết nối → <strong>Hoạt động offline</strong> (VD: chi nhánh làm việc cả ngày offline, cuối ngày merge với trung tâm).</p>
`
  },
  {
    id: 8, title: "Trigger & User-Defined Function",
    tag: "Trigger / UDF",
    summary: "Trigger (AFTER, INSTEAD OF), bảng inserted/deleted, UDF (Scalar, Table-valued).",
    content: `
<h2>A. TRIGGER</h2>
<h3>I. Cú Pháp</h3>
<pre><code>CREATE TRIGGER trigger_name ON table
{AFTER | INSTEAD OF} {INSERT, UPDATE, DELETE}
AS
  sql_statements</code></pre>
<p><strong>AFTER</strong>: Chạy SAU khi lệnh thực thi. <strong>INSTEAD OF</strong>: Chạy THAY THẾ lệnh gốc.</p>

<h3>II. Bảng inserted / deleted</h3>
<ul>
  <li><strong>INSERT</strong>: Bảng <code>inserted</code> chứa dữ liệu mới</li>
  <li><strong>DELETE</strong>: Bảng <code>deleted</code> chứa dữ liệu bị xóa</li>
  <li><strong>UPDATE</strong> = DELETE dữ liệu cũ + INSERT dữ liệu mới → Cả 2 bảng đều có dữ liệu</li>
</ul>
<pre><code>-- Trigger kiểm tra FK khi thêm sinh viên
CREATE TRIGGER Test_ThemSV ON Sinhvien FOR INSERT AS
BEGIN
  IF NOT EXISTS (SELECT * FROM Lop, inserted WHERE Lop.malop = inserted.malop)
    RAISERROR('Mã lớp chưa tồn tại!', 16, 1)
END

-- Trigger cập nhật tồn kho khi xóa CTPN
CREATE TRIGGER XOA_CTPN ON CTPN AFTER DELETE AS
BEGIN
  UPDATE VATTU SET SOLUONGTON = SOLUONGTON - (SELECT SOLUONG FROM deleted)
  WHERE MAVT = (SELECT MAVT FROM deleted)
END</code></pre>

<h2>B. USER-DEFINED FUNCTION (UDF)</h2>
<h3>2 loại UDF</h3>
<ul>
  <li><strong>Scalar Function</strong>: Trả về 1 giá trị đơn (int, varchar, decimal...)</li>
  <li><strong>Table-valued Function</strong>: Trả về 1 bảng (dùng thay View/SP)</li>
</ul>
<pre><code>-- Scalar Function
CREATE FUNCTION CubicVolume (@L decimal(4,1), @W decimal(4,1), @H decimal(4,1))
RETURNS decimal(12,3) AS
BEGIN
  RETURN (@L * @W * @H)
END

-- Inline Table-valued Function
CREATE FUNCTION FN_DSSVLOP (@MALOP NVARCHAR(10))
RETURNS TABLE AS
RETURN (SELECT MASV, HO, TEN FROM SINHVIEN WHERE MALOP = @MALOP)

-- Gọi: SELECT * FROM dbo.FN_DSSVLOP('D08-HTTT')</code></pre>

<h3>So sánh UDF vs SP vs View</h3>
<ul>
  <li>UDF trả về bảng → Dùng trong FROM (SP thì không)</li>
  <li>View giới hạn 1 câu SELECT, UDF linh hoạt hơn</li>
  <li>UDF không sử dụng tham biến (OUTPUT), SP thì có</li>
  <li>UDF lỗi → Dừng ngay; SP lỗi → Chạy tiếp lệnh tiếp theo</li>
</ul>
`
  }
];
