import { PrismaClient } from '@prisma/client';
import { playgroundExercises } from '../js/data/playgroundExercises.js';
import { exercises } from '../js/data/exercises.js';
import { lessons } from '../js/data/lessons.js';

const prisma = new PrismaClient();

async function main() {
  console.log('=======================================================');
  console.log('  Bắt đầu dọn dẹp dữ liệu cũ trong Database...');
  await prisma.playgroundExercise.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.chapter.deleteMany({});
  console.log('  Đã xóa sạch dữ liệu cũ.');

  console.log('-------------------------------------------------------');
  console.log('  Bắt đầu tạo các Chương (Chapters)...');
  
  // Thu thập tất cả các mã chương xuất hiện trong dữ liệu mẫu
  const chaptersMap = new Map();
  
  // Nạp từ danh sách bài học lý thuyết
  lessons.forEach(l => {
    chaptersMap.set(l.id, l.title);
  });
  
  // Nạp từ danh sách bài tập thực hành
  playgroundExercises.forEach(ch => {
    if (!chaptersMap.has(ch.chapter)) {
      chaptersMap.set(ch.chapter, ch.title || `Chương ${ch.chapter}`);
    }
  });

  // Nạp từ danh sách câu hỏi trắc nghiệm
  exercises.forEach(ch => {
    if (!chaptersMap.has(ch.chapter)) {
      const lessonTitle = lessons.find(l => l.id === ch.chapter)?.title;
      chaptersMap.set(ch.chapter, lessonTitle || `Chương ${ch.chapter}`);
    }
  });

  // Thêm các chương vào DB
  for (const [chId, title] of chaptersMap.entries()) {
    await prisma.chapter.create({
      data: {
        id: chId,
        title: title
      }
    });
  }
  console.log(`  Đã tạo thành công ${chaptersMap.size} chương học.`);

  console.log('-------------------------------------------------------');
  console.log('  Bắt đầu đồng bộ danh sách Bài tập thực hành SQL...');
  let totalEx = 0;
  for (const chData of playgroundExercises) {
    for (const ex of chData.exercises) {
      await prisma.playgroundExercise.create({
        data: {
          title: ex.title,
          desc: ex.desc,
          difficulty: ex.difficulty,
          expectedQuery: ex.expectedQuery,
          hint: ex.hint || '',
          chapterId: chData.chapter
        }
      });
      totalEx++;
    }
  }
  console.log(`  Đã đồng bộ thành công ${totalEx} bài tập thực hành.`);

  console.log('-------------------------------------------------------');
  console.log('  Bắt đầu đồng bộ câu hỏi Trắc nghiệm...');
  let totalQuizzes = 0;
  for (const chData of exercises) {
    for (const q of chData.questions) {
      await prisma.quizQuestion.create({
        data: {
          question: q.q,
          options: q.o,
          answerIndex: q.a,
          explanation: q.e || '',
          chapterId: chData.chapter
        }
      });
      totalQuizzes++;
    }
  }
  console.log(`  Đã đồng bộ thành công ${totalQuizzes} câu hỏi trắc nghiệm.`);
  console.log('=======================================================');
  console.log('🎉 ĐỒNG BỘ DỮ LIỆU SEED LÊN NEON POSTGRESQL HOÀN TẤT!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi xảy ra khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
