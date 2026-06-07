import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-sql-server-learning-lab';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Middleware xác thực Token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để truy cập tài nguyên này.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
    req.user = user; // { userId: user.id, username: user.username }
    next();
  });
}

// ================= AUTH APIs =================

// 1. Đăng ký tài khoản mới
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    // Tạo token JWT (hạn dùng 7 ngày)
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công.',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra trên server.' });
  }
});

// 2. Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    // So khớp mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    // Tạo token JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra trên server.' });
  }
});

// ================= PROGRESS APIs =================

// 3. Lấy tiến độ của người dùng hiện tại
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userProgress = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessonProgress: true,
        quizProgress: true,
        exerciseProgress: true
      }
    });

    if (!userProgress) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin người dùng.' });
    }

    // Map dữ liệu về cấu trúc cũ để frontend sử dụng trực tiếp
    const lessonsRead = userProgress.lessonProgress.map(lp => lp.lessonId);
    
    const quizScores = {};
    userProgress.quizProgress.forEach(qp => {
      quizScores[qp.chapterId] = qp.score;
    });

    const passedExercises = userProgress.exerciseProgress.map(ep => ep.exerciseId);

    res.json({
      lessonsRead,
      quizScores,
      passedExercises
    });
  } catch (error) {
    console.error('Lỗi khi lấy tiến độ học:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin tiến độ học tập.' });
  }
});

// 4. Lưu bài học đã đọc
app.post('/api/progress/lesson', authenticateToken, async (req, res) => {
  const { lessonId } = req.body;
  if (lessonId === undefined) {
    return res.status(400).json({ error: 'Thiếu thông tin lessonId.' });
  }

  try {
    const userId = req.user.userId;

    await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: parseInt(lessonId) }
      },
      update: {}, // Không thay đổi gì nếu đã đọc
      create: {
        userId,
        lessonId: parseInt(lessonId)
      }
    });

    res.json({ success: true, message: 'Đã cập nhật trạng thái bài học.' });
  } catch (error) {
    console.error('Lỗi khi lưu tiến độ bài học:', error);
    res.status(500).json({ error: 'Không thể lưu tiến độ bài học.' });
  }
});

// 5. Lưu điểm số trắc nghiệm
app.post('/api/progress/quiz', authenticateToken, async (req, res) => {
  const { chapterId, score } = req.body;
  if (chapterId === undefined || score === undefined) {
    return res.status(400).json({ error: 'Thiếu thông tin chapterId hoặc score.' });
  }

  try {
    const userId = req.user.userId;

    // Chỉ cập nhật nếu điểm mới cao hơn điểm cũ
    const existing = await prisma.userQuizProgress.findUnique({
      where: {
        userId_chapterId: { userId, chapterId: parseInt(chapterId) }
      }
    });

    if (!existing || parseInt(score) > existing.score) {
      await prisma.userQuizProgress.upsert({
        where: {
          userId_chapterId: { userId, chapterId: parseInt(chapterId) }
        },
        update: { score: parseInt(score) },
        create: {
          userId,
          chapterId: parseInt(chapterId),
          score: parseInt(score)
        }
      });
    }

    res.json({ success: true, message: 'Đã cập nhật điểm thi trắc nghiệm.' });
  } catch (error) {
    console.error('Lỗi khi lưu điểm trắc nghiệm:', error);
    res.status(500).json({ error: 'Không thể lưu điểm trắc nghiệm.' });
  }
});

// 6. Lưu bài tập SQL Playground đã hoàn thành
app.post('/api/progress/exercise', authenticateToken, async (req, res) => {
  const { exerciseId } = req.body;
  if (exerciseId === undefined) {
    return res.status(400).json({ error: 'Thiếu thông tin exerciseId.' });
  }

  try {
    const userId = req.user.userId;

    await prisma.userExerciseProgress.upsert({
      where: {
        userId_exerciseId: { userId, exerciseId: parseInt(exerciseId) }
      },
      update: {},
      create: {
        userId,
        exerciseId: parseInt(exerciseId)
      }
    });

    res.json({ success: true, message: 'Đã cập nhật trạng thái bài tập SQL.' });
  } catch (error) {
    console.error('Lỗi khi lưu tiến độ bài tập SQL:', error);
    res.status(500).json({ error: 'Không thể lưu tiến độ bài tập.' });
  }
});


// ================= DATA CONTENT APIs =================

// 7. Lấy danh sách bài tập thực hành SQL (Playground)
app.get('/api/playground', async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        playgroundExercises: {
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { id: 'asc' }
    });

    const result = chapters.map(c => ({
      chapter: c.id,
      title: c.title,
      exercises: c.playgroundExercises.map(e => ({
        id: e.id,
        title: e.title,
        desc: e.desc,
        difficulty: e.difficulty,
        expectedQuery: e.expectedQuery,
        hint: e.hint
      }))
    })).filter(c => c.exercises.length > 0);

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài tập:', error);
    res.status(500).json({ error: 'Không thể kết nối đến cơ sở dữ liệu' });
  }
});

// 8. Lưu danh sách bài tập thực hành SQL (Playground) - Giữ công khai để dễ import
app.post('/api/save-playground', async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Dữ liệu không đúng định dạng mảng' });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.playgroundExercise.deleteMany({});

      for (const ch of data) {
        await tx.chapter.upsert({
          where: { id: ch.chapter },
          update: { title: ch.title || `Chương ${ch.chapter}` },
          create: { id: ch.chapter, title: ch.title || `Chương ${ch.chapter}` }
        });

        for (const ex of ch.exercises) {
          await tx.playgroundExercise.create({
            data: {
              id: ex.id,
              title: ex.title,
              desc: ex.desc,
              difficulty: ex.difficulty,
              expectedQuery: ex.expectedQuery,
              hint: ex.hint || '',
              chapterId: ch.chapter
            }
          });
        }
      }
    });

    res.json({ success: true, message: 'Đã cập nhật bài tập thực hành lên Neon PostgreSQL.' });
  } catch (error) {
    console.error('Lỗi khi lưu bài tập thực hành:', error);
    res.status(500).json({ error: 'Không thể lưu bài tập vào cơ sở dữ liệu.' });
  }
});

// Helper to get user playgrounds file path
const getPlaygroundsFilePath = (userId) => {
  const dir = path.join(__dirname, 'playgrounds_data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, `user_${userId}.json`);
};

// Lấy danh sách custom playgrounds của người dùng
app.get('/api/user-playgrounds', authenticateToken, async (req, res) => {
  try {
    const filePath = getPlaygroundsFilePath(req.user.userId);
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const playgrounds = JSON.parse(rawData);
    res.json(playgrounds);
  } catch (error) {
    console.error('Lỗi khi đọc file playgrounds:', error);
    res.status(500).json({ error: 'Không thể tải danh sách SQL Playground.' });
  }
});

// Lưu danh sách custom playgrounds của người dùng
app.post('/api/save-user-playgrounds', authenticateToken, async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Dữ liệu không đúng định dạng mảng' });
  }

  try {
    const filePath = getPlaygroundsFilePath(req.user.userId);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, message: 'Đã lưu danh sách SQL Playground thành công.' });
  } catch (error) {
    console.error('Lỗi khi lưu file playgrounds:', error);
    res.status(500).json({ error: 'Không thể lưu danh sách SQL Playground.' });
  }
});

// 9. Lấy danh sách câu hỏi trắc nghiệm (Quizzes)
app.get('/api/quizzes', async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        quizQuestions: {
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { id: 'asc' }
    });

    const result = chapters.map(c => ({
      chapter: c.id,
      title: c.title,
      questions: c.quizQuestions.map(q => ({
        q: q.question,
        o: q.options,
        a: q.answerIndex,
        e: q.explanation
      }))
    })).filter(c => c.questions.length > 0);

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi trắc nghiệm:', error);
    res.status(500).json({ error: 'Không thể kết nối đến cơ sở dữ liệu' });
  }
});

// 10. Lưu danh sách câu hỏi trắc nghiệm (Quizzes) - Giữ công khai để dễ import
app.post('/api/save-quizzes', async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Dữ liệu không đúng định dạng mảng' });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing quiz questions
      await tx.quizQuestion.deleteMany({});

      // 2. Prepare chapters upsert and questions list
      const questionsToCreate = [];
      for (const ch of data) {
        await tx.chapter.upsert({
          where: { id: ch.chapter },
          update: { title: ch.title || `Chương ${ch.chapter}` },
          create: { id: ch.chapter, title: ch.title || `Chương ${ch.chapter}` }
        });

        for (const q of ch.questions) {
          questionsToCreate.push({
            question: q.q,
            options: q.o,
            answerIndex: q.a,
            explanation: q.e || '',
            chapterId: ch.chapter
          });
        }
      }

      // 3. Bulk insert all questions
      if (questionsToCreate.length > 0) {
        await tx.quizQuestion.createMany({
          data: questionsToCreate
        });
      }
    });

    res.json({ success: true, message: 'Đã cập nhật trắc nghiệm lên Neon PostgreSQL.' });
  } catch (error) {
    console.error('Lỗi khi lưu câu hỏi trắc nghiệm:', error);
    res.status(500).json({ error: 'Không thể lưu câu hỏi vào cơ sở dữ liệu.' });
  }
});

// Trả về trang chủ cho các trang web tĩnh
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SQL Server Learning Lab Backend (Neon + Prisma)`);
  console.log(`  Đang chạy tại: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
