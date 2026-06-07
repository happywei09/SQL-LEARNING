// Mock Database - QLDSV_HTC Schema
function N(s){return s;} // helper
function deepCopy(obj){return JSON.parse(JSON.stringify(obj));}

const DB = {
  KHOA: {
    columns: ['MAKHOA', 'TENKHOA'],
    rows: [
      ['CNTT', 'Công nghệ thông tin'],
      ['VT', 'Viễn Thông']
    ]
  },
  LOP: {
    columns: ['MALOP', 'TENLOP', 'KHOAHOC', 'MAKHOA'],
    rows: [
      ['D15CQCP01', 'Công nghệ phần mềm 2015', '2015-2019', 'CNTT'],
      ['D15CQIS01', 'Hệ thống thông tin 2015', '2015-2019', 'CNTT'],
      ['D15CQMT01', 'Mạng máy tính 2015', '2015-2019', 'CNTT'],
      ['D15CQVT01', 'Thông tin truyền thông 2015', '2015-2019', 'VT'],
      ['D16CQCP01', 'Công nghệ phần mềm 2016', '2016-2020', 'CNTT'],
      ['D16CQIS01', 'Hệ thống thông tin 2016', '2016-2020', 'CNTT'],
      ['D16CQMT01', 'Mạng máy tính 2016', '2016-2020', 'CNTT'],
      ['D16CQVT01', 'Thông tin truyền thông 2016', '2016-2020', 'VT']
    ]
  },
  GIANGVIEN: {
    columns: ['MAGV', 'MAKHOA', 'HO', 'TEN', 'HOCVI', 'HOCHAM', 'CHUYENMON'],
    rows: [
      ['GV01', 'CNTT', 'Lưu Nguyễn Kỳ', 'Thư', 'Thạc sĩ', '', 'Phần mềm'],
      ['GV02', 'CNTT', 'Lê Thành', 'Trì', 'Thạc sĩ', '', 'Mạng máy tính'],
      ['GV03', 'CNTT', 'Huỳnh Trung', 'Trụ', 'Thạc sĩ', '', 'Web, Phần mềm'],
      ['GV04', 'VT', 'Nguyễn Quốc', 'Minh', 'Tiến sĩ', '', 'Truyền thông'],
      ['GV05', 'CNTT', 'Châu Minh', 'Lâm', 'Tiến sĩ', null, 'Xử lý ảnh'],
      ['GV06', 'CNTT', 'Nguyễn Văn', 'Sáu', 'Thạc Sĩ', null, 'Phần mềm']
    ]
  },
  MONHOC: {
    columns: ['MAMH', 'TENMH', 'SOTIET_LT', 'SOTIET_TH'],
    rows: [
      ['AV', 'Anh văn', 45, 0],
      ['CTDL', 'Cấu trúc dữ liệu & Giải thuật', 40, 5],
      ['HDH', 'Hệ điều hành', 45, 0],
      ['KTDH', 'Kỹ thuật đồ họa', 45, 1],
      ['LTW', 'Lập trình Web', 40, 5],
      ['MMT', 'Mạng máy tính', 30, 15],
      ['XLA', 'Xử lý ảnh', 30, 0]
    ]
  },
  LOPTINCHI: {
    columns: ['MALTC', 'NIENKHOA', 'HOCKY', 'MAMH', 'NHOM', 'MAGV', 'MAKHOA', 'SOSVTOITHIEU', 'HUYLOP'],
    rows: [
      [1, '2021-2022', 1, 'CTDL', 1, 'GV01', 'CNTT', 10, 0],
      [2, '2021-2022', 1, 'CTDL', 2, 'GV01', 'CNTT', 10, 0],
      [3, '2021-2022', 1, 'XLA', 1, 'GV03', 'CNTT', 10, 0],
      [4, '2021-2022', 1, 'CTDL', 3, 'GV04', 'VT', 10, 0],
      [5, '2021-2022', 2, 'LTW', 1, 'GV03', 'CNTT', 10, 0],
      [6, '2021-2022', 2, 'KTDH', 1, 'GV06', 'CNTT', 10, 0],
      [8, '2021-2022', 2, 'MMT', 1, 'GV02', 'CNTT', 10, 0]
    ]
  },
  SINHVIEN: {
    columns: ['MASV', 'HO', 'TEN', 'PHAI', 'DIACHI', 'NGAYSINH', 'MALOP', 'DANGHIHOC', 'PASSWORD'],
    rows: [
      ['N15DCCN001', 'Võ Văn', 'Đức', 0, 'Quận 9', '1997-02-08', 'D15CQCP01', 0, ''],
      ['N15DCCN002', 'Lê Hữu', 'Tài', 0, 'Thủ Đức', '1997-03-07', 'D15CQCP01', 0, ''],
      ['N15DCCN003', 'Hoàng Thanh', 'Bùi', 0, 'Quận 9', '1997-08-07', 'D15CQCP01', 0, ''],
      ['N15DCCN004', 'Phạm', 'Tuấn', 0, 'Quận 9', '1997-10-11', 'D15CQCP01', 0, ''],
      ['N15DCCN005', 'Lê Thanh', 'Hà', 1, 'Quận 4', '1997-08-29', 'D15CQIS01', 0, ''],
      ['N15DCCN006', 'Tiền Hà', 'Nam', 0, 'Thủ Đức', '1997-10-09', 'D15CQIS01', 0, ''],
      ['N15DCCN007', 'Bùi Thị', 'Thanh', 1, 'Q.9', '1997-07-07', 'D15CQIS01', 0, ''],
      ['N15DCCN008', 'Lê Thanh', 'Bình', 0, 'Thủ Đức', '2096-07-07', 'D15CQIS01', 0, ''],
      ['N15DCVT001', 'Huỳnh Văn', 'Nghĩa', 0, 'Quận 9', '1996-07-29', 'D15CQVT01', 0, ''],
      ['N15DCVT002', 'Nguyễn Anh', 'Tài', 0, 'Thủ Đức', '1997-07-29', 'D15CQVT01', 0, ''],
      ['N15DCVT003', 'Phan', 'Tuấn', 0, 'Thủ Đức', '1997-08-28', 'D15CQVT01', 0, ''],
      ['N16DCVT001', 'Trần Thanh', 'Phan', 1, 'Thủ Đức', '1998-07-12', 'D16CQVT01', 0, ''],
      ['N16DCVT002', 'Nguyễn Thanh', 'Hoàng', 0, 'Thủ Đức', '1998-02-03', 'D15CQCP01', 0, '']
    ]
  },
  DANGKY: {
    columns: ['MALTC', 'MASV', 'DIEM_CC', 'DIEM_GK', 'DIEM_CK', 'HUYDANGKY'],
    rows: [
      [1, 'N15DCCN001', 10, 8, 9, 0],
      [1, 'N15DCCN002', 9, 7, 6, 0],
      [1, 'N15DCCN003', 10, 5, 4, 0],
      [1, 'N15DCCN005', 8, 6, 7.5, 0],
      [1, 'N15DCCN006', 7, 4, 3, 0],
      [3, 'N15DCCN001', 10, 9, 8.5, 0],
      [3, 'N15DCCN002', 8, 6.5, 7, 0],
      [3, 'N15DCCN003', 9, 8, 8, 0],
      [3, 'N15DCCN004', 10, 7.5, 8, 0],
      [3, 'N15DCCN005', 5, 5, 4.5, 0]
    ]
  }
};

const INITIAL_DB = deepCopy(DB);

// Dynamic Database Objects repository
export const PROCEDURES = {};
export const VIEWS = {};
export const FUNCTIONS = {};
export const TRIGGERS = {};
export const SEQUENCES = {};
export const CONSTRAINTS = {};
export const INDEXES = {};
export const DIAGRAMS = {
  'QLDSV_HTC DIAGRAM': {
    name: 'QLDSV_HTC Diagram',
    desc: 'Sơ đồ liên kết dữ liệu quản lý điểm sinh viên học tín chỉ.'
  }
};

export function resetDatabase() {
  for (const t in DB) {
    if (INITIAL_DB[t]) {
      DB[t] = deepCopy(INITIAL_DB[t]);
    } else {
      delete DB[t];
    }
  }
  for (const t in INITIAL_DB) {
    if (!DB[t]) {
      DB[t] = deepCopy(INITIAL_DB[t]);
    }
  }
}

export function getDBState() {
  return deepCopy(DB);
}

export function getFullDBState() {
  return {
    DB: deepCopy(DB),
    VIEWS: deepCopy(VIEWS),
    PROCEDURES: deepCopy(PROCEDURES),
    FUNCTIONS: deepCopy(FUNCTIONS),
    TRIGGERS: deepCopy(TRIGGERS),
    SEQUENCES: deepCopy(SEQUENCES),
    CONSTRAINTS: deepCopy(CONSTRAINTS),
    INDEXES: deepCopy(INDEXES),
    DIAGRAMS: deepCopy(DIAGRAMS)
  };
}

export function setFullDBState(state) {
  // Clear DB and INITIAL_DB
  for (const t in DB) {
    delete DB[t];
  }
  for (const t in INITIAL_DB) {
    delete INITIAL_DB[t];
  }
  
  // Load DB and INITIAL_DB
  if (state && state.DB) {
    for (const t in state.DB) {
      DB[t] = deepCopy(state.DB[t]);
      INITIAL_DB[t] = deepCopy(state.DB[t]);
    }
  }
  
  // Clear and load VIEWS
  for (const v in VIEWS) delete VIEWS[v];
  if (state && state.VIEWS) {
    for (const v in state.VIEWS) VIEWS[v] = state.VIEWS[v];
  }
  
  // Clear and load PROCEDURES
  for (const p in PROCEDURES) delete PROCEDURES[p];
  if (state && state.PROCEDURES) {
    for (const p in state.PROCEDURES) PROCEDURES[p] = deepCopy(state.PROCEDURES[p]);
  }

  // Clear and load FUNCTIONS
  for (const f in FUNCTIONS) delete FUNCTIONS[f];
  if (state && state.FUNCTIONS) {
    for (const f in state.FUNCTIONS) FUNCTIONS[f] = deepCopy(state.FUNCTIONS[f]);
  }

  // Clear and load TRIGGERS
  for (const tr in TRIGGERS) delete TRIGGERS[tr];
  if (state && state.TRIGGERS) {
    for (const tr in state.TRIGGERS) TRIGGERS[tr] = deepCopy(state.TRIGGERS[tr]);
  }

  // Clear and load SEQUENCES
  for (const s in SEQUENCES) delete SEQUENCES[s];
  if (state && state.SEQUENCES) {
    for (const s in state.SEQUENCES) SEQUENCES[s] = deepCopy(state.SEQUENCES[s]);
  }

  // Clear and load CONSTRAINTS
  for (const c in CONSTRAINTS) delete CONSTRAINTS[c];
  if (state && state.CONSTRAINTS) {
    for (const c in state.CONSTRAINTS) CONSTRAINTS[c] = deepCopy(state.CONSTRAINTS[c]);
  }

  // Clear and load INDEXES
  for (const idx in INDEXES) delete INDEXES[idx];
  if (state && state.INDEXES) {
    for (const idx in state.INDEXES) INDEXES[idx] = deepCopy(state.INDEXES[idx]);
  }

  // Clear and load DIAGRAMS
  for (const d in DIAGRAMS) delete DIAGRAMS[d];
  if (state && state.DIAGRAMS) {
    for (const d in state.DIAGRAMS) DIAGRAMS[d] = deepCopy(state.DIAGRAMS[d]);
  } else {
    DIAGRAMS['QLDSV_HTC DIAGRAM'] = {
      name: 'QLDSV_HTC Diagram',
      desc: 'Sơ đồ liên kết dữ liệu quản lý điểm sinh viên học tín chỉ.'
    };
  }
}

export function getSchema(){
  const schema={};
  for(const t in DB) schema[t]=DB[t].columns.map((c,i)=>({name:c}));
  return schema;
}

export function executeSQL(sql){
  const start = performance.now();
  try {
    const originalSql = sql;
    sql = removeSQLComments(sql).trim();
    if (!sql) {
      return {type:'message',message:'Truy vấn trống hoặc chỉ chứa chú thích.',success:true,time:performance.now()-start};
    }
    
    // Split into batches by GO
    const batches = splitByGo(originalSql); // use originalSql to preserve exact line numbering
    if (batches.length === 0) {
      return {type:'message',message:'Truy vấn trống.',success:true,time:performance.now()-start};
    }
    
    let lastResult = null;
    for (const batch of batches) {
      try {
        lastResult = executeSingleBatch(batch.text, start);
        if (lastResult.type === 'message' && !lastResult.success) {
          throwSqlError(lastResult.message, lastResult.msgNo || 102, lastResult.level || 15, lastResult.state || 1, batch.text);
        }
      } catch(e) {
        e.batchStartLine = batch.startLine;
        e.batchText = batch.text;
        throw e;
      }
    }
    return lastResult;
  } catch(e){
    const msgNo = e.msgNo || 102;
    const level = e.level || 15;
    const state = e.state || 1;
    
    const relativeLine = findErrorLineWithinBatch(e.batchText || sql, e.message, e.queryText);
    const lineNum = (e.batchStartLine || 1) + relativeLine - 1;
    
    // Exact SSMS error message output formatting
    const formattedErrorMsg = `Msg ${msgNo}, Level ${level}, State ${state}, Line ${lineNum}\n${e.message}`;
    return {
      type: 'message',
      message: formattedErrorMsg,
      success: false,
      time: performance.now() - start
    };
  }
}

function removeSQLComments(sql) {
  let result = '';
  let i = 0;
  let inSingleQuote = false;
  while (i < sql.length) {
    // Handle single-quoted strings
    if (sql[i] === "'" && !inSingleQuote) {
      inSingleQuote = true;
      result += sql[i];
      i++;
      continue;
    }
    if (sql[i] === "'" && inSingleQuote) {
      inSingleQuote = false;
      result += sql[i];
      i++;
      continue;
    }
    if (inSingleQuote) {
      result += sql[i];
      i++;
      continue;
    }
    // Single-line comment: -- ...
    if (sql[i] === '-' && i + 1 < sql.length && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      // Keep the newline to preserve line numbering
      if (i < sql.length) {
        result += '\n';
        i++;
      }
      continue;
    }
    // Multi-line comment: /* ... */
    if (sql[i] === '/' && i + 1 < sql.length && sql[i + 1] === '*') {
      i += 2;
      while (i < sql.length && !(sql[i] === '*' && i + 1 < sql.length && sql[i + 1] === '/')) {
        if (sql[i] === '\n') result += '\n'; // preserve line numbering
        i++;
      }
      if (i < sql.length) i += 2; // skip */
      continue;
    }
    result += sql[i];
    i++;
  }
  return result;
}

export function throwSqlError(message, msgNo = 102, level = 15, state = 1, queryText = null) {
  const err = new Error(message);
  err.msgNo = msgNo;
  err.level = level;
  err.state = state;
  err.queryText = queryText;
  throw err;
}

function findErrorLineWithinBatch(batchText, errorMessage, queryText) {
  if (queryText) {
    const idx = batchText.indexOf(queryText);
    if (idx !== -1) {
      return batchText.substring(0, idx).split('\n').length;
    }
  }
  
  // Try to find the exact statement or line causing the error
  const match = errorMessage.match(/(?:Table|View|Stored Procedure|Constraint|Index|Function|Trigger|Sequence|object|column)\s+["']?(\w+)["']?/i);
  if (match && match[1]) {
    const keyword = match[1];
    const lines = batchText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toUpperCase().includes(keyword.toUpperCase())) {
        return i + 1;
      }
    }
  }
  
  return 1;
}

function splitByGo(sql) {
  const batches = [];
  let cur = '';
  let startLine = 1;
  const lines = sql.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().toUpperCase() === 'GO') {
      if (cur.trim()) {
        batches.push({ text: cur, startLine: startLine });
      }
      cur = '';
      startLine = i + 2; // Next line after GO
    } else {
      if (cur === '') {
        startLine = i + 1;
      }
      cur += line + '\n';
    }
  }
  if (cur.trim()) {
    batches.push({ text: cur, startLine: startLine });
  }
  return batches;
}

function executeSingleBatch(sql, start) {
  const cleanSql = removeSQLComments(sql).trim();
  if (!cleanSql) {
    return {type:'message',message:'Truy vấn trống.',success:true,time:performance.now()-start};
  }
  
  // Check if this is a compound statement that should NOT be split by semicolons
  const upperCheck = cleanSql.toUpperCase().replace(/\s+/g, ' ').trim();
  const isCompound = upperCheck.startsWith('CREATE PROCEDURE') || upperCheck.startsWith('CREATE PROC')
    || upperCheck.startsWith('CREATE OR ALTER PROCEDURE') || upperCheck.startsWith('CREATE OR ALTER PROC')
    || upperCheck.startsWith('CREATE VIEW') || upperCheck.startsWith('CREATE OR ALTER VIEW')
    || upperCheck.startsWith('CREATE TRIGGER') || upperCheck.startsWith('CREATE OR ALTER TRIGGER')
    || upperCheck.startsWith('CREATE FUNCTION') || upperCheck.startsWith('CREATE OR ALTER FUNCTION');
  
  if (!isCompound) {
    const statements = splitStatements(cleanSql);
    if (statements.length > 1) {
      let lastResult = null;
      for (let stmt of statements) {
        stmt = stmt.trim();
        if (!stmt) continue;
        lastResult = executeSingleBatch(stmt, start);
        if (lastResult.type === 'message' && !lastResult.success) {
          return lastResult;
        }
      }
      return lastResult || {type:'message',message:'Thực thi thành công.',success:true,time:performance.now()-start};
    }
  }
  
  const singleSql = cleanSql;
  
  const upper = singleSql.toUpperCase().replace(/\s+/g, ' ').trim();
  
  // CREATE TABLE
  if (upper.startsWith('CREATE TABLE')) {
    return { ...runCreateTable(singleSql), time: performance.now() - start };
  }

  // CREATE DATABASE
  if (upper.startsWith('CREATE DATABASE')) {
    const dbName = upper.replace(/CREATE\s+DATABASE\s+/i, '').trim().toUpperCase();
    return { type: 'message', message: `✅ Đã tạo cơ sở dữ liệu "${dbName}" thành công.`, success: true, time: performance.now() - start };
  }

  // CREATE [OR ALTER] PROCEDURE
  if (upper.startsWith('CREATE PROCEDURE') || upper.startsWith('CREATE PROC') || upper.startsWith('CREATE OR ALTER PROCEDURE') || upper.startsWith('CREATE OR ALTER PROC')) {
    // Normalize: remove OR ALTER so the parser works
    const normalizedSql = singleSql.replace(/CREATE\s+OR\s+ALTER\s+/i, 'CREATE ');
    return { ...runCreateProcedure(normalizedSql), time: performance.now() - start };
  }

  // EXECUTE / EXEC
  if (upper.startsWith('EXEC ') || upper.startsWith('EXECUTE ')) {
    return { ...runExecuteProcedure(singleSql, upper), time: performance.now() - start };
  }

  // CREATE [OR ALTER] VIEW
  if (upper.startsWith('CREATE VIEW') || upper.startsWith('CREATE OR ALTER VIEW')) {
    const normalizedSql = singleSql.replace(/CREATE\s+OR\s+ALTER\s+/i, 'CREATE ');
    return { ...runCreateView(normalizedSql), time: performance.now() - start };
  }

  // DROP PROCEDURE / VIEW / TABLE
  if (upper.startsWith('DROP PROCEDURE') || upper.startsWith('DROP PROC')) {
    const name = upper.replace(/DROP\s+(?:PROCEDURE|PROC)\s+/i, '').trim();
    if (PROCEDURES[name]) {
      delete PROCEDURES[name];
      return { type: 'message', message: `✅ Đã xóa Stored Procedure "${name}".`, success: true, time: performance.now() - start };
    }
    throwSqlError(`Could not find stored procedure '${name}'.`, 2812, 16, 62, name);
  }

  if (upper.startsWith('DROP VIEW')) {
    const name = upper.replace(/DROP\s+VIEW\s+/i, '').trim();
    if (VIEWS[name]) {
      delete VIEWS[name];
      if (DB[name]) delete DB[name];
      return { type: 'message', message: `✅ Đã xóa View "${name}".`, success: true, time: performance.now() - start };
    }
    throwSqlError(`Invalid object name '${name}'.`, 208, 16, 1, name);
  }

  if (upper.startsWith('DROP TABLE')) {
    const name = upper.replace(/DROP\s+TABLE\s+/i, '').trim().toUpperCase();
    for (const t in DB) {
      if (t === name) {
        delete DB[t];
        return { type: 'message', message: `✅ Đã xóa Table "${name}".`, success: true, time: performance.now() - start };
      }
    }
    throwSqlError(`Invalid object name '${name}'.`, 208, 16, 1, name);
  }

  // ALTER TABLE
  if (upper.startsWith('ALTER TABLE')) {
    if (upper.includes('ADD CONSTRAINT')) {
      const match = singleSql.match(/ALTER\s+TABLE\s+(\w+)\s+ADD\s+CONSTRAINT\s+(\w+)\s+([\w\s\(\),]+)/i);
      if (match) {
        const tblName = match[1].toUpperCase();
        const consName = match[2].toUpperCase();
        const consBody = match[3].trim();
        CONSTRAINTS[consName] = {
          name: match[2],
          tableName: tblName,
          body: consBody
        };
        return { type: 'message', message: `✅ Đã tạo Ràng buộc (Constraint) "${consName}" trên bảng "${tblName}".`, success: true, time: performance.now() - start };
      }
    }
    
    const match = singleSql.match(/ALTER\s+TABLE\s+([\w\.\[\]]+)\s+ADD\s+([\w\.\[\]]+)/i);
    if (match) {
      const tblName = match[1].toUpperCase().replace(/\[|\]/g, '');
      const colName = match[2].toUpperCase().replace(/\[|\]/g, '');
      if (!DB[tblName]) throwSqlError(`Invalid object name '${tblName}'.`, 208, 16, 1, tblName);
      if (DB[tblName].columns.includes(colName)) {
        throwSqlError(`Column names in each table must be unique. Column name '${colName}' in table '${tblName}' is specified more than once.`, 2705, 16, 2, colName);
      }
      
      DB[tblName].columns.push(colName);
      for (const row of DB[tblName].rows) {
        row.push(null);
      }
      INITIAL_DB[tblName] = deepCopy(DB[tblName]);
      return { type: 'message', message: `✅ Đã thêm cột "${colName}" vào bảng "${tblName}".`, success: true, time: performance.now() - start };
    }
    throw new Error('Cú pháp ALTER TABLE chưa được hỗ trợ hoặc không hợp lệ.');
  }

  // TRUNCATE TABLE
  if (upper.startsWith('TRUNCATE TABLE')) {
    const tblName = upper.replace(/TRUNCATE\s+TABLE\s+/i, '').trim().toUpperCase().replace(/\[|\]/g, '');
    if (!DB[tblName]) throw new Error(`Bảng ${tblName} không tồn tại.`);
    DB[tblName].rows = [];
    INITIAL_DB[tblName].rows = [];
    return { type: 'message', message: `✅ Đã xóa sạch dữ liệu bảng "${tblName}" (TRUNCATE).`, success: true, time: performance.now() - start };
  }

  // GRANT
  if (upper.startsWith('GRANT ')) {
    return { type: 'message', message: `✅ Đã cấp quyền thành công: ${singleSql.trim()}`, success: true, time: performance.now() - start };
  }

  // REVOKE
  if (upper.startsWith('REVOKE ')) {
    return { type: 'message', message: `✅ Đã thu hồi quyền thành công: ${singleSql.trim()}`, success: true, time: performance.now() - start };
  }

  // BEGIN TRANSACTION / START TRANSACTION
  if (upper.startsWith('BEGIN TRANSACTION') || upper.startsWith('BEGIN TRAN') || upper.startsWith('START TRANSACTION')) {
    return { type: 'message', message: `✅ Đã bắt đầu giao dịch (Transaction started).`, success: true, time: performance.now() - start };
  }

  // COMMIT
  if (upper.startsWith('COMMIT')) {
    return { type: 'message', message: `✅ Đã lưu thay đổi vào cơ sở dữ liệu (Transaction committed).`, success: true, time: performance.now() - start };
  }

  // ROLLBACK
  if (upper.startsWith('ROLLBACK')) {
    return { type: 'message', message: `✅ Đã hoàn tác các thay đổi (Transaction rolled back).`, success: true, time: performance.now() - start };
  }

  // SAVEPOINT
  if (upper.startsWith('SAVEPOINT ')) {
    const spName = upper.replace(/SAVEPOINT\s+/i, '').trim();
    return { type: 'message', message: `✅ Đã tạo Savepoint "${spName}".`, success: true, time: performance.now() - start };
  }

  // MERGE (Upsert)
  if (upper.startsWith('MERGE ')) {
    return { type: 'message', message: `✅ Đã hoàn thành lệnh MERGE (Upsert). Dữ liệu đã được cập nhật thành công.`, success: true, time: performance.now() - start };
  }

  // CURSORS
  if (upper.startsWith('DECLARE ') && upper.includes('CURSOR')) {
    const match = singleSql.match(/DECLARE\s+(\w+)\s+CURSOR/i);
    const cursorName = match ? match[1] : 'Cursor';
    return { type: 'message', message: `✅ Đã khai báo Cursor "${cursorName}".`, success: true, time: performance.now() - start };
  }
  if (upper.startsWith('OPEN ')) {
    const cursorName = singleSql.replace(/OPEN\s+/i, '').trim();
    return { type: 'message', message: `✅ Đã mở Cursor "${cursorName}".`, success: true, time: performance.now() - start };
  }
  if (upper.startsWith('FETCH ')) {
    const match = singleSql.match(/FETCH\s+(?:NEXT\s+FROM\s+)?(\w+)/i);
    const cursorName = match ? match[1] : 'Cursor';
    return { type: 'message', message: `✅ Đã lấy dòng tiếp theo từ Cursor "${cursorName}".`, success: true, time: performance.now() - start };
  }
  if (upper.startsWith('CLOSE ')) {
    const cursorName = singleSql.replace(/CLOSE\s+/i, '').trim();
    return { type: 'message', message: `✅ Đã đóng Cursor "${cursorName}".`, success: true, time: performance.now() - start };
  }
  if (upper.startsWith('DEALLOCATE ')) {
    const cursorName = singleSql.replace(/DEALLOCATE\s+/i, '').trim();
    return { type: 'message', message: `✅ Đã giải phóng Cursor "${cursorName}".`, success: true, time: performance.now() - start };
  }

  // CREATE FUNCTION
  if (upper.startsWith('CREATE FUNCTION')) {
    const match = singleSql.match(/CREATE\s+FUNCTION\s+([\w\.]+)/i);
    if (!match) throw new Error("Cú pháp CREATE FUNCTION không hợp lệ.");
    const fnName = match[1].toUpperCase();
    const asIdx = findKeywordIndex(singleSql, 'RETURNS');
    const body = asIdx !== -1 ? singleSql.substring(asIdx).trim() : singleSql;
    FUNCTIONS[fnName] = {
      name: match[1],
      body: body
    };
    return { type: 'message', message: `✅ Đã tạo Function "${fnName}" thành công.`, success: true, time: performance.now() - start };
  }

  // CREATE TRIGGER
  if (upper.startsWith('CREATE TRIGGER')) {
    const match = singleSql.match(/CREATE\s+TRIGGER\s+([\w\.]+)/i);
    if (!match) throw new Error("Cú pháp CREATE TRIGGER không hợp lệ.");
    const trName = match[1].toUpperCase();
    TRIGGERS[trName] = {
      name: match[1],
      body: singleSql
    };
    return { type: 'message', message: `✅ Đã tạo Trigger "${trName}" thành công.`, success: true, time: performance.now() - start };
  }

  // CREATE SEQUENCE
  if (upper.startsWith('CREATE SEQUENCE')) {
    const match = singleSql.match(/CREATE\s+SEQUENCE\s+([\w\.]+)/i);
    if (!match) throw new Error("Cú pháp CREATE SEQUENCE không hợp lệ.");
    const seqName = match[1].toUpperCase();
    SEQUENCES[seqName] = {
      name: match[1],
      body: singleSql
    };
    return { type: 'message', message: `✅ Đã tạo Sequence "${seqName}" thành công.`, success: true, time: performance.now() - start };
  }

  // CREATE INDEX
  if (upper.startsWith('CREATE INDEX') || upper.startsWith('CREATE UNIQUE INDEX')) {
    const match = singleSql.match(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+(\w+)\s+ON\s+(\w+)/i);
    if (match) {
      const idxName = match[1].toUpperCase();
      const tblName = match[2].toUpperCase();
      INDEXES[idxName] = {
        name: match[1],
        tableName: tblName,
        body: singleSql
      };
      return { type: 'message', message: `✅ Đã tạo Index "${idxName}" trên bảng "${tblName}".`, success: true, time: performance.now() - start };
    }
    return { type: 'message', message: `✅ Đã tạo Index thành công.`, success: true, time: performance.now() - start };
  }
  
  // SET statements (SET NOCOUNT ON/OFF, SET IDENTITY_INSERT, etc.)
  if (upper.startsWith('SET ')) {
    return { type: 'message', message: `✅ Đã thực thi: ${singleSql.trim()}`, success: true, time: performance.now() - start };
  }

  // USE database
  if (upper.startsWith('USE ')) {
    const dbName = upper.replace(/USE\s+/i, '').trim();
    return { type: 'message', message: `✅ Đã chuyển sang cơ sở dữ liệu "${dbName}".`, success: true, time: performance.now() - start };
  }

  // PRINT
  if (upper.startsWith('PRINT ')) {
    const msg = singleSql.replace(/PRINT\s+/i, '').trim().replace(/^N?'/, '').replace(/'$/, '');
    return { type: 'message', message: msg, success: true, time: performance.now() - start };
  }

  if (upper.startsWith('SELECT')) return {type:'result',...runSelect(singleSql,upper),time:performance.now()-start};
  if (upper.startsWith('INSERT')) return {type:'message',message:runInsert(singleSql),success:true,time:performance.now()-start};
  if (upper.startsWith('UPDATE')) return {type:'message',message:runUpdate(singleSql,upper),success:true,time:performance.now()-start};
  if (upper.startsWith('DELETE')) return {type:'message',message:runDelete(singleSql,upper),success:true,time:performance.now()-start};
  
  return {type:'message',message:'⚠️ Chỉ hỗ trợ: SELECT, INSERT, UPDATE, DELETE, CREATE PROCEDURE/VIEW/TABLE/DATABASE, ALTER TABLE, TRUNCATE TABLE, DCL (GRANT/REVOKE), TCL (COMMIT/ROLLBACK/SAVEPOINT), MERGE, CURSORS, SET, USE, PRINT',success:false,time:performance.now()-start};
}

function runCreateProcedure(sql) {
  const asIndex = findKeywordIndex(sql, 'AS');
  if (asIndex === -1) {
    throwSqlError("Incorrect syntax near 'CREATE PROCEDURE'. Missing keyword 'AS'.", 102, 15, 1, 'CREATE PROCEDURE');
  }
  
  const header = sql.substring(0, asIndex).trim();
  let body = sql.substring(asIndex + 2).trim();
  
  let bodyUpper = body.toUpperCase();
  if (bodyUpper.startsWith('BEGIN')) {
    body = body.substring(5).trim();
    if (body.toUpperCase().endsWith('END')) {
      body = body.substring(0, body.length - 3).trim();
    } else if (body.toUpperCase().endsWith('END;')) {
      body = body.substring(0, body.length - 4).trim();
    }
  }
  
  const headerClean = header.replace(/\s+/g, ' ');
  const matchName = headerClean.match(/CREATE\s+(?:PROCEDURE|PROC)\s+([\w\.]+)/i);
  if (!matchName) {
    throwSqlError("Incorrect syntax near 'CREATE PROCEDURE'. Unable to determine name.", 102, 15, 1, 'CREATE PROCEDURE');
  }
  const procName = matchName[1].trim();
  
  const procNameIndex = headerClean.toUpperCase().indexOf(procName.toUpperCase());
  const paramsText = headerClean.substring(procNameIndex + procName.length).trim();
  
  const params = [];
  if (paramsText) {
    const paramParts = paramsText.split(',');
    for (let part of paramParts) {
      part = part.trim();
      if (!part) continue;
      const m = part.match(/(@\w+)/);
      if (m) {
        params.push(m[1]);
      }
    }
  }
  
  PROCEDURES[procName.toUpperCase()] = {
    name: procName,
    params: params,
    body: body
  };
  
  return {
    type: 'message',
    message: `✅ Stored Procedure "${procName}" đã được tạo thành công.`,
    success: true
  };
}

function runExecuteProcedure(sql, upperSql) {
  const isExecute = upperSql.startsWith('EXECUTE ');
  const prefixLength = isExecute ? 8 : 5;
  const commandText = sql.substring(prefixLength).trim();
  
  let firstSpaceIndex = -1;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  for (let i = 0; i < commandText.length; i++) {
    const ch = commandText[i];
    if (ch === "'" && (i === 0 || commandText[i-1] !== '\\')) inSingleQuote = !inSingleQuote;
    else if (ch === '"' && (i === 0 || commandText[i-1] !== '\\')) inDoubleQuote = !inDoubleQuote;
    
    if (!inSingleQuote && !inDoubleQuote && /\s/.test(ch)) {
      firstSpaceIndex = i;
      break;
    }
  }
  
  let procName = '';
  let argsText = '';
  if (firstSpaceIndex === -1) {
    procName = commandText;
  } else {
    procName = commandText.substring(0, firstSpaceIndex).trim();
    argsText = commandText.substring(firstSpaceIndex).trim();
  }
  
  procName = procName.toUpperCase();
  const proc = PROCEDURES[procName];
  if (!proc) {
    throwSqlError(`Could not find stored procedure '${procName}'.`, 2812, 16, 62, procName);
  }
  
  const args = [];
  if (argsText) {
    let cur = '';
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < argsText.length; i++) {
      const ch = argsText[i];
      if (ch === "'" && (i === 0 || argsText[i-1] !== '\\')) inSingle = !inSingle;
      else if (ch === '"' && (i === 0 || argsText[i-1] !== '\\')) inDouble = !inDouble;
      
      if (ch === ',' && !inSingle && !inDouble) {
        args.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) args.push(cur.trim());
  }
  
  const paramValues = {};
  const isNamed = args.length > 0 && args[0].startsWith('@') && args[0].includes('=');
  
  if (isNamed) {
    for (const arg of args) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const pName = arg.substring(0, eqIdx).trim().toUpperCase();
        const pVal = arg.substring(eqIdx + 1).trim();
        paramValues[pName] = pVal;
      }
    }
  } else {
    for (let i = 0; i < proc.params.length; i++) {
      const pName = proc.params[i].toUpperCase();
      paramValues[pName] = i < args.length ? args[i] : 'NULL';
    }
  }
  
  let executedBody = proc.body;
  const sortedParams = [...proc.params].sort((a, b) => b.length - a.length);
  
  for (const pName of sortedParams) {
    const val = paramValues[pName.toUpperCase()] || 'NULL';
    const escapedParam = pName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedParam + '\\b', 'gi');
    executedBody = executedBody.replace(regex, val);
  }
  
  const bodyStatements = splitStatements(executedBody);
  let lastResult = null;
  
  for (let stmt of bodyStatements) {
    stmt = stmt.trim();
    if (!stmt) continue;
    
    lastResult = executeSQL(stmt);
    if (lastResult.type === 'message' && !lastResult.success) {
      return lastResult;
    }
  }
  
  if (!lastResult) {
    return {
      type: 'message',
      message: `✅ Thực thi Stored Procedure "${proc.name}" thành công.`,
      success: true
    };
  }
  
  return lastResult;
}

function runCreateView(sql) {
  const asIndex = findKeywordIndex(sql, 'AS');
  if (asIndex === -1) {
    throwSqlError("Incorrect syntax near 'CREATE VIEW'. Missing keyword 'AS'.", 102, 15, 1, 'CREATE VIEW');
  }
  const header = sql.substring(0, asIndex).trim();
  const selectQuery = sql.substring(asIndex + 2).trim();
  
  const headerClean = header.replace(/\s+/g, ' ');
  const matchName = headerClean.match(/CREATE\s+VIEW\s+([\w\.]+)/i);
  if (!matchName) {
    throwSqlError("Incorrect syntax near 'CREATE VIEW'. Unable to determine name.", 102, 15, 1, 'CREATE VIEW');
  }
  const viewName = matchName[1].trim().toUpperCase();
  
  VIEWS[viewName] = selectQuery;
  
  return {
    type: 'message',
    message: `✅ View "${viewName}" đã được tạo thành công.`,
    success: true
  };
}

function findKeywordIndex(text, keyword) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  const upperText = text.toUpperCase();
  const kw = keyword.toUpperCase();
  
  for (let i = 0; i < text.length - kw.length + 1; i++) {
    const ch = text[i];
    if (ch === "'" && (i === 0 || text[i-1] !== '\\')) inSingleQuote = !inSingleQuote;
    else if (ch === '"' && (i === 0 || text[i-1] !== '\\')) inDoubleQuote = !inDoubleQuote;
    
    if (!inSingleQuote && !inDoubleQuote) {
      if (upperText.substring(i, i + kw.length) === kw) {
        const prevChar = i > 0 ? text[i - 1] : ' ';
        const nextChar = i + kw.length < text.length ? text[i + kw.length] : ' ';
        const isWordBoundary = /[\s\(\),;]/.test(prevChar) && /[\s\(\),;]/.test(nextChar);
        if (isWordBoundary) {
          return i;
        }
      }
    }
  }
  return -1;
}

function removeSQLComments(sql) {
  let cleaned = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.split('\n')
    .map(line => {
      let inSingleQuote = false;
      let inDoubleQuote = false;
      for (let i = 0; i < line.length - 1; i++) {
        if (line[i] === "'" && (i === 0 || line[i-1] !== "\\")) {
          inSingleQuote = !inSingleQuote;
        } else if (line[i] === '"' && (i === 0 || line[i-1] !== "\\")) {
          inDoubleQuote = !inDoubleQuote;
        } else if (line[i] === '-' && line[i+1] === '-' && !inSingleQuote && !inDoubleQuote) {
          return line.slice(0, i);
        }
      }
      return line;
    })
    .join('\n');
  return cleaned;
}

function findTable(name){
  const u=name.toUpperCase().replace(/\[|\]|DBO\./gi,'').trim();
  if (VIEWS[u]) {
    const res = executeSQL(VIEWS[u]);
    if (res.type === 'result') {
      DB[u] = {
        columns: res.columns,
        rows: res.rows
      };
      return u;
    } else {
      throwSqlError(`Lỗi khi thực thi View "${name}": ${res.message}`, 208, 16, 1, name);
    }
  }
  for(const t in DB) if(t===u) return t;
  throwSqlError(`Invalid object name '${name}'.`, 208, 16, 1, name);
}

function resolveColumnName(name, cols) {
  // Strip table alias: SV.MASV -> MASV
  let n = name.trim();
  if (n.includes('.')) {
    n = n.split('.').pop();
  }
  return n.toUpperCase().replace(/\[|\]/g, '');
}

function parseValue(v){
  v=v.trim();
  if(v.startsWith("'")&&v.endsWith("'")) return v.slice(1,-1);
  if(v.startsWith("N'")&&v.endsWith("'")) return v.slice(2,-1);
  if(!isNaN(v)) return Number(v);
  if(v.toUpperCase()==='NULL') return null;
  return v;
}

function evalCondition(row,cols,cond){
  if(!cond||!cond.trim()) return true;
  let c=cond.trim();
  // Handle AND/OR (simple)
  const orParts=splitLogical(c,'OR');
  if(orParts.length>1) return orParts.some(p=>evalCondition(row,cols,p));
  const andParts=splitLogical(c,'AND');
  if(andParts.length>1) return andParts.every(p=>evalCondition(row,cols,p));
  // IS NOT NULL / IS NULL
  let m=c.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
  if(m){const ci=colIdx(cols,m[1]);return row[ci]!==null&&row[ci]!==undefined;}
  m=c.match(/^(\w+)\s+IS\s+NULL$/i);
  if(m){const ci=colIdx(cols,m[1]);return row[ci]===null||row[ci]===undefined;}
  // LIKE
  m=c.match(/^(\w+)\s+LIKE\s+'([^']+)'$/i);
  if(m){const ci=colIdx(cols,m[1]);const pat=m[2].replace(/%/g,'.*').replace(/_/g,'.');return new RegExp('^'+pat+'$','i').test(String(row[ci]));}
  // BETWEEN
  m=c.match(/^(\w+)\s+BETWEEN\s+(.+)\s+AND\s+(.+)$/i);
  if(m){const ci=colIdx(cols,m[1]);const v=row[ci],lo=parseValue(m[2]),hi=parseValue(m[3]);return v>=lo&&v<=hi;}
  // IN
  m=c.match(/^(\w+)\s+IN\s*\((.+)\)$/i);
  if(m){const ci=colIdx(cols,m[1]);const vals=m[2].split(',').map(parseValue);return vals.includes(row[ci]);}
  // Comparison
  m=c.match(/^(\w+)\s*(>=|<=|<>|!=|=|>|<)\s*(.+)$/);
  if(m){
    const ci=colIdx(cols,m[1]);const op=m[2];const val=parseValue(m[3]);const rv=row[ci];
    switch(op){
      case'=':return rv==val;case'<>':case'!=':return rv!=val;
      case'>':return rv>val;case'<':return rv<val;
      case'>=':return rv>=val;case'<=':return rv<=val;
    }
  }
  return true;
}

function splitLogical(s,keyword){
  const parts=[];let depth=0,cur='',re=new RegExp('\\b'+keyword+'\\b','gi');
  const tokens=s.split(re);
  // simple split
  if(tokens.length>1) return tokens;
  return [s];
}

function colIdx(cols,name){
  const u=resolveColumnName(name, cols);
  const i=cols.findIndex(c=>c.toUpperCase()===u);
  if(i===-1) throwSqlError(`Invalid column name '${name}'.`, 207, 16, 1, name);
  return i;
}

function runSelect(sql,upper){
  // Parse FROM (handle JOIN)
  const fromMatch=upper.match(/FROM\s+([\w\.\[\]#]+)/);
  if(!fromMatch) {
    if (upper.includes('@@SERVERNAME')) {
      return { columns: [''], rows: [['SQL-SERVER-2014-MOCK']] };
    }
    if (upper.includes('@@VERSION')) {
      return { columns: [''], rows: [['Microsoft SQL Server 2014 - 12.0.2000.8 (X64)']] };
    }
    throw new Error('Thiếu mệnh đề FROM.');
  }
  
  // Handle JOINs: merge tables
  let tblName=findTable(fromMatch[1]);
  let tbl=DB[tblName];
  let rows=deepCopy(tbl.rows);
  let cols=[...tbl.columns];
  
  // Process all JOINs
  const joinRegex=/(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([\w\.\[\]#]+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+([\w\.]+)\s*=\s*([\w\.]+)/gi;
  let joinMatch;
  while ((joinMatch = joinRegex.exec(sql)) !== null) {
    const joinTblName = findTable(joinMatch[1]);
    const joinTbl = DB[joinTblName];
    const leftCol = resolveColumnName(joinMatch[3], cols);
    const rightCol = resolveColumnName(joinMatch[4], joinTbl.columns);
    
    const leftIdx = cols.findIndex(c => c.toUpperCase() === leftCol);
    const rightIdx = joinTbl.columns.findIndex(c => c.toUpperCase() === rightCol);
    
    if (leftIdx === -1 && rightIdx === -1) continue;
    
    // Determine which is which
    let lIdx = leftIdx !== -1 ? leftIdx : joinTbl.columns.findIndex(c => c.toUpperCase() === leftCol);
    let rIdx = rightIdx !== -1 ? rightIdx : cols.findIndex(c => c.toUpperCase() === rightCol);
    
    // If leftCol is in join table and rightCol is in main table, swap
    if (leftIdx === -1 && rightIdx === -1) continue;
    if (leftIdx === -1) { lIdx = rIdx; rIdx = joinTbl.columns.findIndex(c => c.toUpperCase() === leftCol); }
    
    // Add join table columns (skip duplicate join column)
    const newCols = [...cols];
    const joinColIndices = [];
    for (let i = 0; i < joinTbl.columns.length; i++) {
      if (!newCols.includes(joinTbl.columns[i])) {
        newCols.push(joinTbl.columns[i]);
        joinColIndices.push(i);
      }
    }
    
    // Perform INNER JOIN
    const newRows = [];
    const joinRows = deepCopy(joinTbl.rows);
    const mainJoinIdx = leftIdx !== -1 ? leftIdx : cols.findIndex(c => c.toUpperCase() === rightCol);
    const otherJoinIdx = rightIdx !== -1 ? rightIdx : joinTbl.columns.findIndex(c => c.toUpperCase() === leftCol);
    
    for (const mainRow of rows) {
      for (const jRow of joinRows) {
        if (String(mainRow[mainJoinIdx]).toUpperCase() === String(jRow[otherJoinIdx]).toUpperCase()) {
          const merged = [...mainRow];
          for (const ji of joinColIndices) {
            merged.push(jRow[ji]);
          }
          newRows.push(merged);
        }
      }
    }
    cols = newCols;
    rows = newRows;
  }
  
  // WHERE
  const whereMatch=sql.match(/WHERE\s+(.+?)(?=GROUP\s+BY|ORDER\s+BY|$)/is);
  if(whereMatch) rows=rows.filter(r=>evalCondition(r,cols,whereMatch[1]));
  // SELECT columns
  const selMatch=sql.match(/SELECT\s+(.*?)\s+FROM/is);
  let selCols=selMatch?selMatch[1].trim():'*';
  const isDistinct=upper.includes('DISTINCT');
  // GROUP BY
  const groupMatch=sql.match(/GROUP\s+BY\s+([\w\s,\.]+?)(?=HAVING|ORDER|$)/is);
  // HAVING
  const havingMatch=sql.match(/HAVING\s+(.+?)(?=ORDER|$)/is);
  // ORDER BY
  const orderMatch=sql.match(/ORDER\s+BY\s+(.+)$/is);
  // Handle aggregate
  if(groupMatch||/\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/i.test(selCols)){
    return handleAggregate(selCols,rows,cols,groupMatch,havingMatch,orderMatch,tblName);
  }
  // Select specific columns
  let outCols,outRows;
  if(selCols==='*'){
    outCols=cols;outRows=rows;
  } else {
    const parts=splitSelectColumns(selCols);
    outCols=[];const computedFns=[];
    for(const p of parts){
      const aliasMatch=p.match(/^(.+?)\s+AS\s+([\w]+)$/i);
      const expr = aliasMatch ? aliasMatch[1].trim() : p.trim();
      const alias = aliasMatch ? aliasMatch[2] : null;
      
      // Check if it's a string concatenation expression (contains +)
      if (expr.includes('+') && !expr.match(/^\w+$/)) {
        outCols.push(alias || expr);
        computedFns.push({type:'expr', expr: expr, cols: cols});
      } else {
        const resolvedName = resolveColumnName(expr, cols);
        const idx = cols.findIndex(c=>c.toUpperCase()===resolvedName);
        if (idx === -1) throwSqlError(`Invalid column name '${expr}'.`, 207, 16, 1, expr);
        outCols.push(alias || resolvedName);
        computedFns.push({type:'col', idx: idx});
      }
    }
    outRows=rows.map(r=>computedFns.map(fn=>{
      if(fn.type==='col') return r[fn.idx];
      if(fn.type==='expr') return evalExpression(fn.expr, r, cols);
      return null;
    }));
  }
  // DISTINCT
  if(isDistinct){
    const seen=new Set();
    outRows=outRows.filter(r=>{const k=JSON.stringify(r);if(seen.has(k))return false;seen.add(k);return true;});
  }
  // ORDER BY
  if(orderMatch) outRows=applyOrder(outRows,outCols,orderMatch[1]);
  // TOP
  const topMatch=upper.match(/TOP\s+(\d+)/);
  if(topMatch) outRows=outRows.slice(0,parseInt(topMatch[1]));
  return {columns:outCols,rows:outRows};
}

function splitSelectColumns(selStr) {
  const parts = [];
  let cur = '', depth = 0, inQuote = false;
  for (let i = 0; i < selStr.length; i++) {
    const ch = selStr[i];
    if (ch === "'" && !inQuote) { inQuote = true; cur += ch; continue; }
    if (ch === "'" && inQuote) { inQuote = false; cur += ch; continue; }
    if (inQuote) { cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function evalExpression(expr, row, cols) {
  // Handle string concatenation with +
  const parts = [];
  let cur = '', inQuote = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inQuote) { inQuote = true; cur += ch; continue; }
    if (ch === "'" && inQuote) { inQuote = false; cur += ch; continue; }
    if (inQuote) { cur += ch; continue; }
    if (ch === '+') {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  
  return parts.map(p => {
    p = p.trim();
    if ((p.startsWith("'") && p.endsWith("'")) || (p.startsWith("N'") && p.endsWith("'"))) {
      return parseValue(p);
    }
    const resolved = resolveColumnName(p, cols);
    const idx = cols.findIndex(c => c.toUpperCase() === resolved);
    if (idx !== -1) return row[idx] != null ? String(row[idx]) : '';
    return p;
  }).join('');
}

function handleAggregate(selStr,rows,cols,groupMatch,havingMatch,orderMatch){
  const groupCols=groupMatch?groupMatch[1].split(',').map(s=>s.trim()):[];
  const groups={};
  if(groupCols.length===0){groups['__all__']=rows;}
  else{
    const gIdxs=groupCols.map(c=>colIdx(cols,c));
    for(const r of rows){
      const key=gIdxs.map(i=>r[i]).join('|||');
      if(!groups[key])groups[key]=[];
      groups[key].push(r);
    }
  }
  const selParts=selStr.split(',').map(s=>s.trim());
  const outCols=[],fns=[];
  for(const p of selParts){
    const aggM=p.match(/^(COUNT|SUM|AVG|MAX|MIN)\s*\(\s*(\*|\w+)\s*\)\s*(?:AS\s+(\w+))?$/i);
    if(aggM){
      const fn=aggM[1].toUpperCase(),col=aggM[2],alias=aggM[3]||`${fn}(${col})`;
      outCols.push(alias);
      fns.push({type:'agg',fn,col});
    } else {
      const alias=p.match(/^(.+?)\s+AS\s+(\w+)$/i);
      const cName=alias?alias[1]:p;
      outCols.push(alias?alias[2]:cName);
      fns.push({type:'col',col:cName});
    }
  }
  let outRows=[];
  for(const key in groups){
    const grp=groups[key];
    const row=fns.map(f=>{
      if(f.type==='col') return grp[0][colIdx(cols,f.col)];
      const ci=f.col==='*'?0:colIdx(cols,f.col);
      const vals=grp.map(r=>r[ci]);
      switch(f.fn){
        case'COUNT':return vals.length;
        case'SUM':return vals.reduce((a,b)=>a+(Number(b)||0),0);
        case'AVG':return Math.round(vals.reduce((a,b)=>a+(Number(b)||0),0)/vals.length*100)/100;
        case'MAX':return Math.max(...vals.map(Number));
        case'MIN':return Math.min(...vals.map(Number));
      }
    });
    outRows.push(row);
  }
  // HAVING
  if(havingMatch){
    outRows=outRows.filter(r=>evalCondition(r,outCols,havingMatch[1]));
  }
  if(orderMatch) outRows=applyOrder(outRows,outCols,orderMatch[1]);
  return {columns:outCols,rows:outRows};
}

function applyOrder(rows,cols,orderStr){
  const parts=orderStr.split(',').map(s=>s.trim());
  const orders=parts.map(p=>{
    const m=p.match(/^(\w+)\s*(DESC|ASC)?$/i);
    if(!m) return null;
    return {idx:cols.findIndex(c=>c.toUpperCase()===m[1].toUpperCase()),desc:m[2]&&m[2].toUpperCase()==='DESC'};
  }).filter(Boolean);
  return rows.sort((a,b)=>{
    for(const o of orders){
      if(o.idx===-1)continue;
      const va=a[o.idx],vb=b[o.idx];
      let cmp=va<vb?-1:va>vb?1:0;
      if(o.desc)cmp=-cmp;
      if(cmp!==0)return cmp;
    }
    return 0;
  });
}

function runInsert(sql){
  // Try INSERT INTO ... SELECT first
  const selectMatch = sql.match(/INSERT\s+INTO\s+([#\w\.\[\]]+)\s*(?:\(([^)]*)\))?\s*SELECT\s+(.+)/is);
  if (selectMatch) {
    const tbl = findTable(selectMatch[1]);
    const selectSql = 'SELECT ' + selectMatch[3];
    const selectUpper = selectSql.toUpperCase().replace(/\s+/g, ' ').trim();
    const result = runSelect(selectSql, selectUpper);
    
    if (result.rows.length === 0) {
      return `✅ Đã thêm 0 dòng vào ${tbl}. (Tổng: ${DB[tbl].rows.length} dòng)`;
    }
    
    let insertedCount = 0;
    for (const vals of result.rows) {
      // Map columns if specified, otherwise use all columns in order
      const row = DB[tbl].columns.map((c, idx) => {
        return idx < vals.length ? vals[idx] : null;
      });
      DB[tbl].rows.push(row);
      insertedCount++;
    }
    return `✅ Đã thêm ${insertedCount} dòng vào ${tbl}. (Tổng: ${DB[tbl].rows.length} dòng)`;
  }
  
  // INSERT INTO ... VALUES
  const m=sql.match(/INSERT\s+INTO\s+([#\w\.\[\]]+)\s*\(([^)]+)\)\s*VALUES\s*(.+)/is);
  if(!m) throwSqlError("Incorrect syntax near 'INSERT'.", 102, 15, 1, 'INSERT');
  const tbl=findTable(m[1]);
  const flds=m[2].split(',').map(s=>s.trim());
  const valuesStr=m[3].trim();
  
  const allRowsValues = parseInsertValues(valuesStr);
  if (allRowsValues.length === 0) {
    throwSqlError("Incorrect syntax near 'VALUES'.", 102, 15, 1, 'VALUES');
  }

  let insertedCount = 0;
  for (const vals of allRowsValues) {
    if (flds.length !== vals.length) {
      throwSqlError(`There are ${flds.length < vals.length ? 'fewer' : 'more'} columns in the INSERT statement than values specified in the VALUES clause.`, 110, 15, 1, 'INSERT');
    }

    const row=DB[tbl].columns.map(c=>{
      const i=flds.findIndex(f=>f.toUpperCase()===c.toUpperCase());
      return i>=0?vals[i]:null;
    });
    
    // Validate duplicate Primary Key constraint
    if (DB[tbl].columns.length > 0) {
      const pkColName = DB[tbl].columns[0];
      const newPkValue = row[0];
      const pkExists = DB[tbl].rows.some(r => String(r[0]).toUpperCase() === String(newPkValue).toUpperCase());
      if (pkExists) {
        throwSqlError(`Violation of PRIMARY KEY constraint 'PK_${tbl}'. Cannot insert duplicate key in object 'dbo.${tbl}'. The duplicate key value is (${newPkValue}).`, 2627, 14, 1, 'INSERT');
      }
    }

    DB[tbl].rows.push(row);
    insertedCount++;
  }
  
  return `✅ Đã thêm ${insertedCount} dòng vào ${tbl}. (Tổng: ${DB[tbl].rows.length} dòng)`;
}

function runUpdate(sql){
  const m=sql.match(/UPDATE\s+([\w\.\[\]]+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/is);
  if(!m) throwSqlError("Incorrect syntax near 'UPDATE'.", 102, 15, 1, 'UPDATE');
  const tbl=findTable(m[1]);
  const sets=m[2].split(',').map(s=>{const p=s.split('=');return{col:p[0].trim(),val:parseValue(p[1])};});
  const where=m[3]||'';
  let count=0;
  for(const r of DB[tbl].rows){
    if(evalCondition(r,DB[tbl].columns,where)){
      for(const s of sets){const ci=colIdx(DB[tbl].columns,s.col);r[ci]=s.val;}
      count++;
    }
  }
  return `✅ Đã cập nhật ${count} dòng trong ${tbl}.`;
}

function runDelete(sql){
  const m=sql.match(/DELETE\s+(?:FROM\s+)?([\w\.\[\]]+)(?:\s+WHERE\s+(.+))?$/is);
  if(!m) throwSqlError("Incorrect syntax near 'DELETE'.", 102, 15, 1, 'DELETE');
  const tbl=findTable(m[1]);
  const where=m[2]||'';
  const before=DB[tbl].rows.length;
  DB[tbl].rows=DB[tbl].rows.filter(r=>!evalCondition(r,DB[tbl].columns,where));
  return `✅ Đã xóa ${before-DB[tbl].rows.length} dòng từ ${tbl}.`;
}

// ===== CUSTOM SCHEMA IMPORT SUPPORT =====
const DEFAULT_DB = deepCopy(INITIAL_DB);

export function restoreDefaultSchema() {
  for (const t in DB) delete DB[t];
  Object.assign(DB, deepCopy(DEFAULT_DB));
  
  for (const t in INITIAL_DB) delete INITIAL_DB[t];
  Object.assign(INITIAL_DB, deepCopy(DB));
}

export function importSQLSchema(sqlText) {
  // Clear comments
  let cleanSql = removeSQLComments(sqlText);
  
  // Split statements by semicolon (ignoring semicolons inside quotes)
  const statements = splitStatements(cleanSql);
  
  const newDB = {};
  
  for (let stmt of statements) {
    stmt = stmt.trim();
    if (!stmt) continue;
    
    const upper = stmt.toUpperCase().replace(/\s+/g, ' ');
    
    if (upper.startsWith('CREATE TABLE')) {
      const match = stmt.match(/CREATE\s+TABLE\s+([\w\.\[\]]+)\s*\((.*)\)/is);
      if (match) {
        const tblName = match[1].toUpperCase().replace(/\[|\]|DBO\./gi, '').trim();
        const colsText = match[2];
        
        const cols = [];
        let cur = '';
        let depth = 0;
        for (let i = 0; i < colsText.length; i++) {
          const ch = colsText[i];
          if (ch === '(') depth++;
          else if (ch === ')') depth--;
          
          if (ch === ',' && depth === 0) {
            cols.push(cur.trim());
            cur = '';
          } else {
            cur += ch;
          }
        }
        if (cur.trim()) cols.push(cur.trim());
        
        const columnNames = cols.map(c => {
          const parts = c.trim().split(/\s+/);
          return parts[0].toUpperCase().replace(/\[|\]/g, '');
        }).filter(name => name && !['CONSTRAINT', 'PRIMARY', 'FOREIGN', 'KEY', 'CHECK'].includes(name));
        
        newDB[tblName] = {
          columns: columnNames,
          rows: []
        };
      }
    } else if (upper.startsWith('INSERT INTO')) {
      const match = stmt.match(/INSERT\s+INTO\s+([\w\.\[\]]+)\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)/is);
      if (match) {
        const tblName = match[1].toUpperCase().replace(/\[|\]|DBO\./gi, '').trim();
        if (newDB[tblName]) {
          const flds = match[2].split(',').map(s => s.trim().toUpperCase().replace(/\[|\]/g, ''));
          const vals = splitInsertValues(match[3]).map(parseValue);
          
          const row = newDB[tblName].columns.map(c => {
            const idx = flds.indexOf(c);
            return idx >= 0 ? vals[idx] : null;
          });
          newDB[tblName].rows.push(row);
        }
      }
    }
  }
  
  if (Object.keys(newDB).length > 0) {
    for (const t in DB) delete DB[t];
    Object.assign(DB, newDB);
    
    for (const t in INITIAL_DB) delete INITIAL_DB[t];
    Object.assign(INITIAL_DB, deepCopy(DB));
    return { success: true, tableCount: Object.keys(newDB).length };
  }
  
  throw new Error("Không tìm thấy lệnh CREATE TABLE hợp lệ nào trong file SQL.");
}

function splitStatements(sql) {
  const stmts = [];
  let cur = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'" && (i === 0 || sql[i-1] !== '\\')) inSingleQuote = !inSingleQuote;
    else if (ch === '"' && (i === 0 || sql[i-1] !== '\\')) inDoubleQuote = !inDoubleQuote;
    
    if (ch === ';' && !inSingleQuote && !inDoubleQuote) {
      stmts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) stmts.push(cur);
  return stmts;
}

function splitInsertValues(valsStr) {
  const vals = [];
  let cur = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let depth = 0;
  for (let i = 0; i < valsStr.length; i++) {
    const ch = valsStr[i];
    if (ch === "'" && (i === 0 || valsStr[i-1] !== '\\')) inSingleQuote = !inSingleQuote;
    else if (ch === '"' && (i === 0 || valsStr[i-1] !== '\\')) inDoubleQuote = !inDoubleQuote;
    else if (ch === '(') depth++;
    else if (ch === ')') depth--;
    
    if (ch === ',' && !inSingleQuote && !inDoubleQuote && depth === 0) {
      vals.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) vals.push(cur);
  return vals;
}

function parseInsertValues(valuesStr) {
  const rows = [];
  let cur = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let depth = 0;
  
  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];
    if (ch === "'" && (i === 0 || valuesStr[i-1] !== '\\')) inSingleQuote = !inSingleQuote;
    else if (ch === '"' && (i === 0 || valuesStr[i-1] !== '\\')) inDoubleQuote = !inDoubleQuote;
    
    if (!inSingleQuote && !inDoubleQuote) {
      if (ch === '(') {
        depth++;
        if (depth === 1) {
          cur = '';
          continue;
        }
      } else if (ch === ')') {
        depth--;
        if (depth === 0) {
          rows.push(cur.trim());
          cur = '';
          continue;
        }
      }
    }
    
    if (depth > 0) {
      cur += ch;
    }
  }
  
  return rows.map(rowStr => {
    return splitInsertValues(rowStr).map(parseValue);
  });
}

function runCreateTable(sql) {
  const match = sql.match(/CREATE\s+TABLE\s+([#\w\.\[\]]+)\s*\((.*)\)/is);
  if (!match) throwSqlError("Incorrect syntax near 'CREATE TABLE'.", 102, 15, 1, 'CREATE TABLE');
  
  const tblName = match[1].toUpperCase().replace(/\[|\]|DBO\./gi, '').trim();
  if (DB[tblName]) throwSqlError(`There is already an object named '${tblName}' in the database.`, 2714, 16, 6, tblName);
  
  const colsText = match[2];
  const cols = [];
  let cur = '';
  let depth = 0;
  for (let i = 0; i < colsText.length; i++) {
    const ch = colsText[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    
    if (ch === ',' && depth === 0) {
      cols.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) cols.push(cur.trim());
  
  const columnNames = cols.map(c => {
    const parts = c.trim().split(/\s+/);
    return parts[0].toUpperCase().replace(/\[|\]/g, '');
  }).filter(name => name && !['CONSTRAINT', 'PRIMARY', 'FOREIGN', 'KEY', 'CHECK'].includes(name));
  
  DB[tblName] = {
    columns: columnNames,
    rows: []
  };
  
  INITIAL_DB[tblName] = deepCopy(DB[tblName]);
  
  return { type: 'message', message: `✅ Đã tạo bảng "${tblName}" thành công.`, success: true };
}
